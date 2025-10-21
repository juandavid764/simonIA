import { useState, useEffect } from "react";
import { supabase } from "../supabase/client.js";

export const useWompi = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Verificar si Wompi está disponible
    const initializeWompi = () => {
      if (typeof window !== "undefined" && window.$wompi) {
        window.$wompi.initialize(function (data, error) {
          if (error === null) {
            setSessionId(data.sessionId);
            setDeviceId(data.deviceData.deviceID);
            setIsInitialized(true);
            setError(null);
            console.log("✅ Wompi inicializado correctamente:", {
              sessionId: data.sessionId,
              deviceId: data.deviceData.deviceID,
            });
          } else {
            setError(error);
            console.error("❌ Error al inicializar Wompi:", error);
          }
          setIsLoading(false);
        });
      } else {
        // Si Wompi no está disponible, intentar de nuevo en un momento
        setTimeout(() => {
          if (window.$wompi) {
            initializeWompi();
          } else {
            setError("Wompi no está disponible");
            setIsLoading(false);
          }
        }, 1000);
      }
    };

    initializeWompi();
  }, []);

  // Función para reinicializar si es necesario
  const reinitialize = () => {
    setIsLoading(true);
    setError(null);
    setIsInitialized(false);

    if (window.$wompi) {
      window.$wompi.initialize(function (data, error) {
        if (error === null) {
          setSessionId(data.sessionId);
          setDeviceId(data.deviceData.deviceID);
          setIsInitialized(true);
          setError(null);
        } else {
          setError(error);
        }
        setIsLoading(false);
      });
    }
  };

  // Función para crear suscripción usando las Edge Functions
  const createSubscription = async (
    planType,
    billingCycle,
    userEmail,
    userPhone,
    userId
  ) => {
    if (!isInitialized) {
      throw new Error("Wompi no está inicializado");
    }

    if (!sessionId || !deviceId) {
      throw new Error("Faltan datos de sesión de Wompi");
    }

    try {
      setIsProcessing(true);
      setError(null);

      console.log("🚀 Creando suscripción:", {
        planType,
        billingCycle,
        userEmail,
        sessionId,
        deviceId,
      });

      const { data, error: functionError } = await supabase.functions.invoke(
        "create-subscription",
        {
          body: {
            userId: userId,
            planType: planType,
            billingCycle: billingCycle,
            userEmail: userEmail,
            userPhone: userPhone,
            sessionId: sessionId,
            deviceId: deviceId,
          },
        }
      );

      if (functionError) {
        console.error("Error en Edge Function:", functionError);
        throw new Error(functionError.message || "Error al crear suscripción");
      }

      if (!data.success) {
        throw new Error(data.error || "Error desconocido al crear suscripción");
      }

      console.log("✅ Suscripción creada exitosamente:", data);
      return data;
    } catch (err) {
      console.error("❌ Error creando suscripción:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para procesar pago único (no suscripción)
  const processPayment = async (
    amount,
    currency = "COP",
    reference,
    userEmail
  ) => {
    if (!isInitialized) {
      throw new Error("Wompi no está inicializado");
    }

    try {
      setIsProcessing(true);
      setError(null);

      const paymentData = {
        amount_in_cents: amount * 100,
        currency: currency,
        customer_email: userEmail,
        reference: reference,
        payment_method: {
          type: "CARD",
          session_id: sessionId,
        },
      };

      // Aquí puedes implementar lógica adicional para pagos únicos si es necesario
      console.log("Procesando pago único:", paymentData);

      return paymentData;
    } catch (err) {
      console.error("Error procesando pago:", err);
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // Estados
    isInitialized,
    sessionId,
    deviceId,
    error,
    isLoading,
    isProcessing,

    // Funciones
    reinitialize,
    createSubscription,
    processPayment,

    // Información de estado
    isReady: isInitialized && !isLoading && !error,
    canProcess: isInitialized && sessionId && deviceId && !isProcessing,
  };
};
