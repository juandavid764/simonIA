import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase/client.js";

export const useSubscription = (userId) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el estado de la suscripción directamente de la DB
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log("🔍 Buscando suscripción para userId:", userId);

      // Obtener directamente de la base de datos (sin Edge Function por ahora)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", parseInt(userId)) // Asegurar que sea INTEGER
        .order("created_at", { ascending: false })
        .limit(1);

      console.log("📊 Datos de suscripción:", fallbackData);
      console.log("❌ Error de suscripción:", fallbackError);

      if (!fallbackError && fallbackData && fallbackData.length > 0) {
        const subscriptionData = fallbackData[0];
        const now = new Date();
        const isActive =
          subscriptionData.status === "active" &&
          subscriptionData.current_period_end &&
          new Date(subscriptionData.current_period_end) > now;

        const daysRemaining = subscriptionData.current_period_end
          ? Math.max(
              0,
              Math.ceil(
                (new Date(subscriptionData.current_period_end).getTime() -
                  now.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0;

        setSubscription({
          hasSubscription: true,
          subscription: subscriptionData,
          isProUser: isActive && subscriptionData.plan_type === "pro",
          isActive: isActive,
          isTrialing: subscriptionData.status === "trialing",
          daysRemaining: daysRemaining,
        });
      } else {
        // Usuario sin suscripción
        console.log("👤 Usuario sin suscripción, estableciendo plan básico");
        setSubscription({
          hasSubscription: false,
          planType: "basic",
          isProUser: false,
          isActive: true, // Plan básico siempre activo
          isTrialing: false,
          daysRemaining: 0,
        });
      }
    } catch (err) {
      console.error("Error obteniendo suscripción:", err);
      setError(err.message);

      // Fallback a plan básico en caso de error
      setSubscription({
        hasSubscription: false,
        planType: "basic",
        isProUser: false,
        isActive: true,
        isTrialing: false,
        daysRemaining: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Función para crear una suscripción (usando Edge Function)
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

      console.log("🚀 Intentando crear suscripción:", {
        userId,
        planType,
        billingCycle,
        userEmail,
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
            sessionId: window.$wompi?.sessionId,
            deviceId: window.$wompi?.deviceId,
          },
        }
      );

      if (functionError) {
        console.error("❌ Error en Edge Function:", functionError);
        throw functionError;
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Error creando suscripción");
      }

      console.log("✅ Suscripción creada:", data);

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

  // Función para cancelar suscripción (usando Edge Function)
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

  // Suscribirse a cambios en tiempo real (deshabilitado por ahora)
  // useEffect(() => {
  //   if (!userId) return;

  //   const channel = supabase
  //     .channel(`subscriptions_${userId}`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "subscriptions",
  //         filter: `user_id=eq.${userId}`,
  //       },
  //       () => {
  //         fetchSubscriptionStatus();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [userId, fetchSubscriptionStatus]);

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
