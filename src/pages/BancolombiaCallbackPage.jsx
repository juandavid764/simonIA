import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyBancolombiaToken,
  createPaymentSource,
  createSubscription,
} from "../api/wompiFunctions";
import { useAuth } from "../context/AuthContext";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const BancolombiaCallbackPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verificando autorización...");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Recuperar datos guardados antes de la redirección
        const savedData = sessionStorage.getItem("bancolombia_payment_data");
        if (!savedData) {
          throw new Error("No se encontraron datos de pago");
        }

        const { token, email, billingCycle, merchantData } =
          JSON.parse(savedData);

        // Verificar estado del token
        setMessage("Verificando autorización con Bancolombia...");
        const isApproved = await verifyBancolombiaToken(token);

        if (!isApproved) {
          throw new Error("La autorización no fue aprobada");
        }

        // Crear Payment Source
        setMessage("Creando método de pago...");

        const paymentSource = await createPaymentSource({
          userId: user.id,
          token: token,
          type: "BANCOLOMBIA_TRANSFER",
          email: email,
          acceptance_token: merchantData.acceptance_token,
          accept_personal_auth: merchantData.accept_personal_auth,
        });

        // Crear Subscription
        setMessage("Creando suscripción...");
        await createSubscription({
          user_id: user.id,
          payment_source_id: paymentSource.id,
          billing_interval: billingCycle,
          email: email,
        });

        // Limpiar sessionStorage y tokens de aceptación
        sessionStorage.removeItem("bancolombia_payment_data");
        sessionStorage.removeItem("merchant_acceptance_tokens");

        setStatus("success");
        setMessage("¡Suscripción creada exitosamente!");

        // Redirigir a planes después de 2 segundos
      } catch (error) {
        console.error("Error en callback:", error);
        setStatus("error");
        setMessage(error.message || "Error al procesar el pago");
      }
    };

    if (user) {
      processCallback();
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="animate-spin h-12 w-12 text-[#25D366] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Procesando...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-green-500 text-2xl font-bold mb-2">¡Éxito!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => {
                // Recargar para actualizar el estado de suscripción
                window.location.href = "/Dashboard/avanzadas";
              }}
              className="mt-4 bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors font-semibold"
            >
              Continuar
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/Dashboard/planes")}
              className="mt-4 bg-[#25D366] text-white px-6 py-2 rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              Volver a intentar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BancolombiaCallbackPage;
