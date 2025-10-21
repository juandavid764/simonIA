import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase/client";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

const PaymentProcessing = ({
  paymentId,
  userId,
  onSuccess,
  onCancel,
  onClose,
}) => {
  const [status, setStatus] = useState("processing"); // processing, completed, failed, declined, voided, error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentId || !userId) return;

    // Suscripción en tiempo real a la tabla payments
    const subscription = supabase
      .channel(`payment-${paymentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `wompi_transaction_id=eq.${paymentId}`,
        },
        (payload) => {
          console.log("📡 Cambio detectado en payment:", payload);

          if (payload.eventType === "UPDATE") {
            const newData = payload.new;
            setPaymentData(newData);

            // Actualizar estado según el status del payment
            if (newData.status === "APPROVED") {
              setStatus("completed");
            } else if (newData.status === "DECLINED") {
              setStatus("declined");
              setError(newData.status_message || "El pago fue rechazado");
            } else if (newData.status === "VOIDED") {
              setStatus("voided");
              setError(newData.status_message || "El pago fue anulado");
            } else if (newData.status === "ERROR") {
              setStatus("error");
              setError(
                newData.status_message || "Ocurrió un error con el pago"
              );
            } else if (newData.status === "PENDING") {
              setStatus("processing");
            }
          }
        }
      )
      .subscribe();

    // Consultar el estado inicial
    const fetchInitialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("wompi_transaction_id", paymentId)
          .single();

        if (error) throw error;

        if (data) {
          setPaymentData(data);

          if (data.status === "APPROVED") {
            setStatus("completed");
            setTimeout(() => {
              if (onSuccess) onSuccess(data);
            }, 2000);
          } else if (data.status === "DECLINED") {
            setStatus("declined");
            setError(data.status_message || "El pago fue rechazado");
          } else if (data.status === "VOIDED") {
            setStatus("voided");
            setError(data.status_message || "El pago fue anulado");
          } else if (data.status === "ERROR") {
            setStatus("error");
            setError(data.status_message || "Ocurrió un error con el pago");
          }
        }
      } catch (err) {
        console.error("Error al obtener estado inicial del pago:", err);
        setError("No se pudo verificar el estado del pago");
      }
    };

    fetchInitialStatus();

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => {
      subscription.unsubscribe();
    };
  }, [paymentId, userId, onSuccess]);

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const renderContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Loader2 className="w-20 h-20 text-[#25D366] mx-auto animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Procesando tu pago
            </h3>
            <p className="text-gray-600 mb-2">
              Esto puede tardar unos segundos...
            </p>
            <p className="text-sm text-gray-500">
              Por favor, no cierres esta ventana
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Esperando confirmación del pago</span>
            </div>
          </div>
        );

      case "completed":
        return (
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Pago completado! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Tu suscripción ha sido activada exitosamente
            </p>
            {paymentData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Estado del pago:</strong> {paymentData.status}
                </p>
                {paymentData.amount && (
                  <p className="text-sm text-gray-700">
                    <strong>Monto:</strong> $
                    {(paymentData.amount / 100).toLocaleString()} COP
                  </p>
                )}
              </div>
            )}
            <button
              onClick={handleClose}
              className="w-full bg-[#25D366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#128C7E] transition-colors"
            >
              Continuar
            </button>
          </div>
        );

      case "declined":
        return (
          <div className="text-center">
            <div className="mb-6">
              <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Pago rechazado
            </h3>
            <p className="text-gray-600 mb-4">
              El pago fue rechazado por la entidad bancaria
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button
              onClick={handleCancel}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Volver a intentar
            </button>
          </div>
        );

      case "voided":
        return (
          <div className="text-center">
            <div className="mb-6">
              <XCircle className="w-20 h-20 text-orange-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Pago anulado
            </h3>
            <p className="text-gray-600 mb-4">El pago ha sido anulado</p>
            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-700">{error}</p>
              </div>
            )}
            <button
              onClick={handleCancel}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Salir
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="mb-6">
              <XCircle className="w-20 h-20 text-red-600 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Error en el pago
            </h3>
            <p className="text-gray-600 mb-4">
              Ocurrió un error procesando tu pago
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <button
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Salir
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
      {renderContent()}
    </div>
  );
};

export default PaymentProcessing;
