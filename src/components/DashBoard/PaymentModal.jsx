import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import PaymentMethodSelector from "./PaymentInputs/PaymentMethodSelector";
import CardInputs from "./PaymentInputs/CardInputs";
import NequiInputs from "./PaymentInputs/NequiInputs";
import NequiVerification from "./PaymentInputs/NequiVerification";
import PaymentProcessing from "./PaymentInputs/PaymentProcessing";
import {
  tokenizeCard,
  tokenizeNequi,
  verifyNequiSubscription,
  createPaymentSource,
  createSubscription,
} from "../../api/wompiFunctions";

const PaymentModal = ({
  isOpen,
  onClose,
  billingCycle = "monthly",
  pricing,
  merchantData = null,
}) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataPolicy, setAcceptedDataPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNequiVerification, setShowNequiVerification] = useState(false);
  const [nequiTokenData, setNequiTokenData] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [createdPaymentId, setCreatedPaymentId] = useState(null);

  // Estados para los datos de tarjeta
  const [cardData, setCardData] = useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    card_holder: "",
  });

  // Estados para los datos del viejo nequi
  const [nequiData, setNequiData] = useState({
    name: "",
    phone: "",
  });

  // Calcular precios
  const proPrice = pricing
    ? pricing[billingCycle].pro
    : billingCycle === "monthly"
    ? 9990
    : 99990;
  const savings = billingCycle === "yearly" ? 9990 * 12 - proPrice : 0;

  // Funciones para manejar cambios en los inputs
  const handleCardChange = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleNequiChange = (field, value) => {
    setNequiData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  // Validaciones
  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    return newErrors;
  };

  const validateCardData = () => {
    const newErrors = {};

    if (!cardData.number.trim()) {
      newErrors.number = "El número de tarjeta es obligatorio";
    } else if (cardData.number.length < 13) {
      newErrors.number = "El número de tarjeta debe tener al menos 13 dígitos";
    }

    if (!cardData.exp_month.trim()) {
      newErrors.exp_month = "El mes es obligatorio";
    } else if (
      parseInt(cardData.exp_month) < 1 ||
      parseInt(cardData.exp_month) > 12
    ) {
      newErrors.exp_month = "Mes inválido";
    }

    if (!cardData.exp_year.trim()) {
      newErrors.exp_year = "El año es obligatorio";
    } else if (parseInt(cardData.exp_year) < 24) {
      newErrors.exp_year = "Año inválido";
    }

    if (!cardData.cvc.trim()) {
      newErrors.cvc = "El CVC es obligatorio";
    } else if (cardData.cvc.length < 3) {
      newErrors.cvc = "CVC debe tener al menos 3 dígitos";
    }

    if (!cardData.card_holder.trim()) {
      newErrors.card_holder = "El nombre del titular es obligatorio";
    } else if (cardData.card_holder.length < 5) {
      newErrors.card_holder = "El nombre debe tener al menos 5 caracteres";
    }

    return newErrors;
  };

  const validateNequiData = () => {
    const newErrors = {};

    if (!nequiData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (nequiData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!nequiData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio";
    } else if (nequiData.phone.length !== 10) {
      newErrors.phone = "El número debe tener 10 dígitos";
    }

    return newErrors;
  };

  const handleVerifyNequi = async () => {
    setIsProcessing(true);
    try {
      // Verificar el estado del token de Nequi
      console.log("");
      const result = await verifyNequiSubscription(nequiTokenData.data.id);
      if (result === true) {
        console.log("✅ Token de Nequi verificado correctamente");
      } else {
        alert("Suscripción no verificada, Confirma en la app de Nequi");
        setIsProcessing(false);
        return;
      }

      // Extraer tokens de aceptación del merchantData
      const acceptanceToken =
        merchantData?.data?.presigned_acceptance?.acceptance_token;
      const acceptPersonalAuth =
        merchantData?.data?.presigned_personal_data_auth?.acceptance_token;

      // Crear método de pago (Payment Source) con Nequi
      console.log("Creando método de pago Nequi (Payment Source)...");

      const paymentSource = await createPaymentSource({
        userId: user.id,
        token: nequiTokenData.data.id,
        type: "NEQUI",
        email: email,
        acceptance_token: acceptanceToken,
        accept_personal_auth: acceptPersonalAuth,
      });

      console.log(
        "✅ Método de pago Nequi creado exitosamente:",
        paymentSource
      );

      // Crear la suscripción usando el ID del payment source
      console.log("Creando suscripción Nequi con el Payment Source...");

      const subscriptionData = await createSubscription({
        user_id: user.id,
        payment_source_id: paymentSource.id,
        billing_interval: billingCycle === "monthly" ? "monthly" : "yearly",
        email: email,
      });

      console.log(
        "✅ Suscripción Nequi creada exitosamente:",
        subscriptionData
      );

      // Guardar el ID del pago y mostrar pantalla de procesamiento
      const paymentId =
        subscriptionData.payment?.id || subscriptionData.payment_id;

      if (paymentId) {
        setCreatedPaymentId(paymentId);
        setShowNequiVerification(false);
        setShowPaymentProcessing(true);
      } else {
        console.error("⚠️ No se pudo obtener el ID del pago");
        alert("Suscripción creada pero no se pudo obtener el ID del pago");
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Error al verificar Nequi:", error);
      alert(`Error en la verificación: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handleCancelNequi = () => {
    setShowNequiVerification(false);
    setNequiTokenData(null);
    setNequiData({ name: "", phone: "" });
  };

  // Callbacks para PaymentProcessing
  const handlePaymentSuccess = (subscriptionData) => {
    console.log("✅ Pago completado exitosamente:", subscriptionData);
    // Aquí puedes agregar lógica adicional, como actualizar el estado de la app
    // o redirigir al usuario
    setShowPaymentProcessing(false);
    onClose();
    // Podrías agregar una notificación de éxito o recargar datos del usuario
  };

  const handlePaymentCancel = () => {
    console.log("❌ Pago cancelado");
    setShowPaymentProcessing(false);
    setCreatedPaymentId(null);
    // Volver a mostrar el formulario de pago
  };

  const handlePaymentClose = () => {
    setShowPaymentProcessing(false);
    setCreatedPaymentId(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar email primero
    const emailErrors = validateEmail();
    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors);
      return;
    }

    // Validar según el método de pago
    const validationErrors =
      paymentMethod === "card" ? validateCardData() : validateNequiData();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validar aceptación de términos
    if (!acceptedTerms) {
      alert("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    if (!acceptedDataPolicy) {
      alert(
        "Debes aceptar la política de tratamiento de datos personales para continuar"
      );
      return;
    }

    setIsProcessing(true);

    try {
      let tokenData;

      // Tokenizar según el método de pago
      if (paymentMethod === "card") {
        console.log("Tokenizando tarjeta...");
        tokenData = await tokenizeCard(cardData);
        console.log("✅ Tokenización exitosa:", tokenData);
      } else if (paymentMethod === "nequi") {
        console.log("Tokenizando Nequi...");
        tokenData = await tokenizeNequi(nequiData.phone);

        // Guardar el token y mostrar pantalla de verificación de Nequi
        setNequiTokenData(tokenData);
        setShowNequiVerification(true);
        setIsProcessing(false);
        return; // Detener aquí para mostrar la verificación
      }

      // Extraer tokens de aceptación del merchantData
      const acceptanceToken =
        merchantData?.data?.presigned_acceptance?.acceptance_token;
      const acceptPersonalAuth =
        merchantData?.data?.presigned_personal_data_auth?.acceptance_token;

      // Crear método de pago (Payment Source) después de tokenización exitosa
      if (paymentMethod === "card") {
        console.log("Creando método de pago (Payment Source)...");

        const paymentSource = await createPaymentSource({
          userId: user.id,
          token: tokenData.data.id,
          type: "CARD",
          email: email,
          acceptance_token: acceptanceToken,
          accept_personal_auth: acceptPersonalAuth,
        });

        console.log("✅ Método de pago creado exitosamente:", paymentSource);

        // Crear la suscripción usando el ID del payment source
        console.log("Creando suscripción con el Payment Source...");

        const subscriptionData = await createSubscription({
          user_id: user.id,
          payment_source_id: paymentSource.id,
          billing_interval: billingCycle === "monthly" ? "monthly" : "yearly",
          email: email,
        });

        console.log("✅ Suscripción creada exitosamente:", subscriptionData);

        // Guardar el ID del pago y mostrar pantalla de procesamiento
        const paymentId =
          subscriptionData.payment?.id || subscriptionData.payment_id;

        if (paymentId) {
          setCreatedPaymentId(paymentId);
          setShowPaymentProcessing(true);
          setIsProcessing(false);
          return; // Salir para mostrar el componente de procesamiento
        } else {
          console.error("⚠️ No se pudo obtener el ID del pago");
          alert("Suscripción creada pero no se pudo obtener el ID del pago");
        }
      }

      setIsProcessing(false);
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  // Si está en modo de procesamiento de pago, mostrar ese componente
  if (showPaymentProcessing && createdPaymentId) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <PaymentProcessing
          paymentId={createdPaymentId}
          userId={user.id}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          onClose={handlePaymentClose}
        />
      </div>,
      document.body
    );
  }

  // Si está en modo de verificación de Nequi, mostrar ese componente
  if (showNequiVerification) {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <NequiVerification
          onVerify={handleVerifyNequi}
          onCancel={handleCancelNequi}
          onClose={() => {
            handleCancelNequi();
            onClose();
          }}
        />
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full  max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <h2 className="pl-5 text-xl font-bold text-gray-900">
            Suscribete al Plan Pro
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[calc(95vh-80px)] overflow-y-auto">
          {/* Panel izquierdo - Resumen del plan con colores de Simon */}
          <div className="bg-[#1A202C] text-white p-8">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-3 text-[#25D366]">
                SimonIA plan Pro
              </h3>
              <p className="text-gray-300 text-lg">
                Acceso completo a todas las funciones de SimonIA
              </p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-[#25D366]">
                Incluye:
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mr-3"></div>
                  Análisis financiero avanzado
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mr-3"></div>
                  Recomendaciones personalizadas
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mr-3"></div>
                  Soporte prioritario 24/7
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#25D366] rounded-full mr-3"></div>
                  Reportes detallados
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="space-y-4 border-t border-gray-600 pt-6">
              <div className="flex justify-between text-lg">
                <span>
                  Plan Pro ({billingCycle === "monthly" ? "mensual" : "anual"})
                </span>
                <span>${proPrice.toLocaleString()} COP</span>
              </div>

              {billingCycle === "yearly" && savings > 0 && (
                <div className="flex justify-between text-sm text-[#25D366]">
                  <span>Ahorro anual</span>
                  <span>-${savings.toLocaleString()} COP</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-400">
                <span>Impuestos</span>
                <span>$0 COP</span>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between font-bold text-xl text-[#25D366]">
                  <span>Total a pagar hoy</span>
                  <span>${proPrice.toLocaleString()} COP</span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="text-sm text-gray-400 mt-1">
                    Equivale a ${Math.round(proPrice / 12).toLocaleString()}{" "}
                    COP/mes
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario de pago */}
          <div className="p-8 bg-white">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Introduce los datos del pago
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  placeholder="tu@ejemplo.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Método de pago */}
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />

              {/* Inputs dinámicos según método de pago */}
              {paymentMethod === "card" && (
                <CardInputs
                  cardData={cardData}
                  onCardChange={handleCardChange}
                  errors={errors}
                />
              )}

              {paymentMethod === "nequi" && (
                <NequiInputs
                  nequiData={nequiData}
                  onNequiChange={handleNequiChange}
                  errors={errors}
                />
              )}

              {/* Políticas de Wompi */}
              <div className="space-y-4 border-t border-gray-200 pt-4">
                {/* Términos y condiciones */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366] border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600"
                  >
                    <span className="font-medium">
                      Acepto haber leído los{" "}
                      <a
                        href={
                          merchantData?.data?.presigned_acceptance?.permalink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline"
                      >
                        reglamentos y politica de privacidad
                      </a>
                    </span>
                  </label>
                </div>

                {/* Política de datos personales */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptDataPolicy"
                    checked={acceptedDataPolicy}
                    onChange={(e) => setAcceptedDataPolicy(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#25D366] focus:ring-[#25D366] border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="acceptDataPolicy"
                    className="text-sm text-gray-600"
                  >
                    <span className="font-medium">
                      Autorizo el{" "}
                      <a
                        href={
                          merchantData?.data?.presigned_personal_data_auth
                            ?.permalink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline"
                      >
                        tratamiento de mis datos personales
                      </a>
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className={`flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 transition-colors ${
                    isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#25D366] text-white hover:bg-[#128C7E]"
                  }`}
                >
                  {isProcessing ? "Procesando..." : "Comenzar suscripción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;
