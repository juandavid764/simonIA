import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase/client.js";

export const useSubscription = (userId) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el estado de la suscripción
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Llamar a la Edge Function para obtener el estado
      const { data, error: functionError } = await supabase.functions.invoke(
        "get-subscription-status",
        {
          body: { userId: userId },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      setSubscription(data);
    } catch (err) {
      console.error("Error obteniendo suscripción:", err);
      setError(err.message);

      // Fallback: obtener directamente de la base de datos
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!fallbackError && fallbackData) {
          const now = new Date();
          const isActive =
            fallbackData.status === "active" &&
            fallbackData.current_period_end &&
            new Date(fallbackData.current_period_end) > now;

          setSubscription({
            hasSubscription: true,
            subscription: fallbackData,
            isProUser: isActive && fallbackData.plan_type === "pro",
            isActive: isActive,
            isTrialing: fallbackData.status === "trialing",
          });
        } else {
          // Usuario sin suscripción
          setSubscription({
            hasSubscription: false,
            planType: "basic",
            isProUser: false,
            isActive: true, // Plan básico siempre activo
            isTrialing: false,
          });
        }
      } catch (fallbackErr) {
        console.error("Error en fallback:", fallbackErr);
        setError(fallbackErr.message);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Función para crear una suscripción
  const createSubscription = async (
    planType,
    billingCycle,
    userEmail,
    userPhone
  ) => {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke(
        "create-subscription",
        {
          body: {
            userId: userId,
            planType: planType,
            billingCycle: billingCycle,
            userEmail: userEmail,
            userPhone: userPhone,
            sessionId: window.$wompi?.sessionId,
            deviceId: window.$wompi?.deviceId,
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data.success) {
        throw new Error(data.error || "Error creando suscripción");
      }

      // Actualizar el estado local
      await fetchSubscriptionStatus();

      return data;
    } catch (err) {
      console.error("Error creando suscripción:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar suscripción
  const cancelSubscription = async (reason = "") => {
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke(
        "cancel-subscription",
        {
          body: {
            userId: userId,
            reason: reason,
          },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data.success) {
        throw new Error(data.error || "Error cancelando suscripción");
      }

      // Actualizar el estado local
      await fetchSubscriptionStatus();

      return data;
    } catch (err) {
      console.error("Error cancelando suscripción:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el usuario puede acceder a funciones Pro
  const canAccessProFeature = (featureName) => {
    if (!subscription) return false;

    // Si no tiene suscripción, solo funciones básicas
    if (!subscription.hasSubscription) {
      return false;
    }

    // Si tiene suscripción Pro activa
    if (subscription.isProUser && subscription.isActive) {
      return true;
    }

    // Si está en período de gracia (cancelada pero aún en período pagado)
    if (
      subscription.subscription?.status === "canceled" &&
      subscription.subscription?.current_period_end &&
      new Date(subscription.subscription.current_period_end) > new Date()
    ) {
      return true;
    }

    return false;
  };

  // Función para obtener información de límites
  const getLimits = () => {
    if (canAccessProFeature("unlimited")) {
      return {
        monthlyTransactions: null, // Ilimitadas
        advancedAnalytics: true,
        prioritySupport: true,
        predictions: true,
        customReports: true,
      };
    }

    return {
      monthlyTransactions: 100,
      advancedAnalytics: false,
      prioritySupport: false,
      predictions: false,
      customReports: false,
    };
  };

  // Cargar suscripción al montar el componente
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`subscriptions_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Recargar estado cuando hay cambios
          fetchSubscriptionStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchSubscriptionStatus]);

  return {
    // Estado
    subscription,
    loading,
    error,

    // Propiedades computadas
    isProUser: subscription?.isProUser || false,
    isActive: subscription?.isActive || false,
    isTrialing: subscription?.isTrialing || false,
    hasSubscription: subscription?.hasSubscription || false,
    planType: subscription?.subscription?.plan_type || "basic",
    daysRemaining: subscription?.daysRemaining || 0,

    // Funciones
    createSubscription,
    cancelSubscription,
    canAccessProFeature,
    getLimits,
    refreshSubscription: fetchSubscriptionStatus,

    // Información de funciones
    features: {
      unlimitedTransactions: canAccessProFeature("unlimited"),
      advancedAnalytics: canAccessProFeature("analytics"),
      prioritySupport: canAccessProFeature("support"),
      predictions: canAccessProFeature("predictions"),
      customReports: canAccessProFeature("reports"),
    },
  };
};
