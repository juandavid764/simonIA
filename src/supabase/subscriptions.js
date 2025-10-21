import { supabase } from "./client.js";

// Obtener suscripción activa del usuario
export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      subscription_payments (
        id,
        amount,
        status,
        payment_date,
        wompi_transaction_id,
        failure_reason
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

// Verificar si el usuario es Pro
export async function isUserPro(userId) {
  try {
    const { data, error } = await supabase.rpc("is_pro_user", {
      p_user_id: userId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error verificando usuario Pro:", error);
    return false;
  }
}

// Obtener información activa de suscripción
export async function getActiveSubscription(userId) {
  try {
    const { data, error } = await supabase.rpc("get_active_subscription", {
      p_user_id: userId,
    });

    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error obteniendo suscripción activa:", error);
    return null;
  }
}

// Obtener historial de pagos
export async function getPaymentHistory(userId, limit = 10) {
  const { data, error } = await supabase
    .from("subscription_payments")
    .select(
      `
      *,
      subscriptions (
        plan_type,
        billing_cycle
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Actualizar estado de suscripción
export async function updateSubscriptionStatus(
  subscriptionId,
  status,
  updates = {}
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...updates,
    })
    .eq("id", subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Crear registro de pago
export async function createPaymentRecord(paymentData) {
  const { data, error } = await supabase
    .from("subscription_payments")
    .insert(paymentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Obtener estadísticas de suscripciones (para admin)
export async function getSubscriptionStats() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_type, status, billing_cycle, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Procesar estadísticas
  const stats = {
    total: data.length,
    active: data.filter((s) => s.status === "active").length,
    canceled: data.filter((s) => s.status === "canceled").length,
    trial: data.filter((s) => s.status === "trialing").length,
    pro: data.filter((s) => s.plan_type === "pro").length,
    monthly: data.filter((s) => s.billing_cycle === "monthly").length,
    yearly: data.filter((s) => s.billing_cycle === "yearly").length,
    revenue: {
      monthly:
        data.filter(
          (s) => s.billing_cycle === "monthly" && s.status === "active"
        ).length * 9990,
      yearly:
        data.filter(
          (s) => s.billing_cycle === "yearly" && s.status === "active"
        ).length * 99990,
    },
  };

  return stats;
}

// Verificar límites de usuario
export async function checkUserLimits(userId) {
  const subscription = await getUserSubscription(userId);
  const isPro =
    subscription &&
    subscription.status === "active" &&
    subscription.plan_type === "pro";

  // Obtener conteo de transacciones del mes actual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { count: transactionCount, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("fecha", startOfMonth.toISOString().split("T")[0])
    .lte("fecha", endOfMonth.toISOString().split("T")[0]);

  if (error) throw error;

  return {
    isPro,
    subscription,
    limits: {
      monthlyTransactions: isPro ? null : 100,
      currentTransactions: transactionCount || 0,
      canAddTransaction: isPro || (transactionCount || 0) < 100,
      hasAdvancedAnalytics: isPro,
      hasPrioritySupport: isPro,
      hasPredictions: isPro,
      hasCustomReports: isPro,
    },
  };
}

// Función para manejar expiración de suscripciones
export async function handleExpiredSubscriptions() {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .lt("current_period_end", now)
    .in("status", ["active", "trialing"])
    .select();

  if (error) throw error;

  console.log(`${data.length} suscripciones expiradas actualizadas`);
  return data;
}

// Función para enviar recordatorios de renovación (placeholder)
export async function sendRenewalReminders() {
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + 7); // 7 días antes

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      users (
        nombre,
        telefono
      )
    `
    )
    .eq("status", "active")
    .lte("current_period_end", reminderDate.toISOString())
    .gte("current_period_end", new Date().toISOString());

  if (error) throw error;

  // Aquí puedes integrar con un servicio de email/SMS
  console.log(`${data.length} usuarios necesitan recordatorio de renovación`);

  return data;
}

// Función para cancelar una suscripción
export async function cancelSubscription(userId, subscriptionId = null) {
  try {
    // Si no se proporciona subscriptionId, buscar la suscripción activa del usuario
    let targetSubscriptionId = subscriptionId;

    if (!targetSubscriptionId) {
      const { data: activeSubscription, error: findError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (findError) {
        if (findError.code === "PGRST116") {
          throw new Error(
            "No se encontró una suscripción activa para cancelar"
          );
        }
        throw findError;
      }

      targetSubscriptionId = activeSubscription.id;
    }

    // Actualizar el estado de la suscripción a 'cancelled'
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
      })
      .eq("id", targetSubscriptionId)
      .eq("user_id", userId) // Asegurar que solo el dueño puede cancelar
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error(
        "No se pudo cancelar la suscripción. Verifica que tengas permisos."
      );
    }

    console.log("✅ Suscripción cancelada exitosamente:", data);
    return {
      success: true,
      subscription: data,
      message: "Suscripción cancelada exitosamente",
    };
  } catch (error) {
    console.error("❌ Error al cancelar suscripción:", error);
    throw error;
  }
}
