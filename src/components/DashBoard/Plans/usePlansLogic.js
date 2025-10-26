import { useState } from "react";
import { useWompi } from "../../../Hooks/useWompi";
import { useSubscription } from "../../../Hooks/useSubscription_temp";
import { useAuth } from "../../../context/AuthContext";
import { pricing } from "./constants";

export const usePlansLogic = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuth();
  const {
    error: wompiError,
    reinitialize,
    createSubscription,
    isProcessing: wompiProcessing,
    canProcess,
  } = useWompi();

  const {
    subscription,
    error: subscriptionError,
    isProUser,
    isActive,
    isTrialing,
    hasSubscription,
    planType,
    daysRemaining,
    cancelSubscription,
    refreshSubscription,
    features,
  } = useSubscription(user?.id);

  // Función para manejar la actualización a Pro
  const handleUpgradeToPro = async () => {
    if (!user) {
      alert("Debes estar autenticado para actualizar tu plan");
      return;
    }

    if (wompiError) {
      alert(
        "Hay un problema con el sistema de pagos. Intentando reconectar..."
      );
      reinitialize();
      return;
    }

    if (!canProcess) {
      alert("El sistema de pagos no está listo. Por favor espera un momento.");
      return;
    }

    try {
      setIsProcessing(true);

      console.log("🚀 Iniciando proceso de suscripción:", {
        userId: user.id,
        userEmail: user.email || `${user.telefono}@simonai.com`,
        planType: "pro",
        billingCycle,
        amount: pricing[billingCycle].pro,
      });

      const result = await createSubscription(
        "pro",
        billingCycle,
        user.email || `${user.telefono}@simonai.com`,
        user.telefono,
        user.id
      );

      if (result.success) {
        alert("¡Suscripción creada exitosamente! Serás redirigido al pago.");

        // Si hay URL de pago, redirigir
        if (result.payment_url) {
          window.open(result.payment_url, "_blank");
        }

        // Actualizar estado de suscripción
        await refreshSubscription();
      }
    } catch (err) {
      console.error("❌ Error en el proceso de pago:", err);
      alert(`Error al procesar el pago: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancelSubscription = async () => {
    try {
      setIsProcessing(true);

      const result = await cancelSubscription(cancelReason);

      if (result.success) {
        alert(
          `Suscripción cancelada exitosamente. Tendrás acceso hasta ${new Date(
            result.access_until
          ).toLocaleDateString()}`
        );
        setShowCancelModal(false);
        setCancelReason("");
        await refreshSubscription();
      }
    } catch (err) {
      console.error("Error cancelando suscripción:", err);
      alert(`Error al cancelar la suscripción: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // State
    billingCycle,
    setBillingCycle,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    isProcessing,

    // User and subscription data
    user,
    subscription,
    subscriptionError,
    isProUser,
    isActive,
    isTrialing,
    hasSubscription,
    planType,
    daysRemaining,
    features,

    // Wompi data
    wompiError,
    wompiProcessing,
    canProcess,
    reinitialize,

    // Handlers
    handleUpgradeToPro,
    handleCancelSubscription,
    refreshSubscription,
  };
};
