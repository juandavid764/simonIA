import { supabase } from "./client.js";

export const checkActiveSubscription = async (userId) => {
  if (!userId) {
    return { hasActiveSubscription: false, subscription: null };
  }

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["active", "canceled"])
      .order("start_date", { ascending: false })
      .maybeSingle();

    if (error) {
      console.error("Error consultando suscripción:", error);
      return { hasActiveSubscription: false, subscription: null };
    }

    // Si no hay suscripción, retornar false
    if (!data) {
      return { hasActiveSubscription: false, subscription: null };
    }

    // Verificar si la suscripción está activa basándose en next_billing_date
    const now = new Date();
    const nextBillingDate = new Date(data.next_billing_date);

    // La suscripción está activa si next_billing_date no ha pasado
    const isActive = nextBillingDate > now;

    return {
      hasActiveSubscription: isActive,
      subscription: isActive ? data : null,
    };
  } catch (err) {
    console.error("Error en checkActiveSubscription:", err);
    return { hasActiveSubscription: false, subscription: null };
  }
};

/**
 * Cancela una suscripción cambiando su estado a 'canceled' y elimina los métodos de pago del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const cancelSubscription = async (userId) => {
  if (!userId) {
    return { success: false, error: "Usuario no válido" };
  }

  try {
    // Cancelar la suscripción
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Error cancelando suscripción:", error);
      return { success: false, error: error.message };
    }

    // Eliminar los métodos de pago del usuario
    const { error: deletePaymentError } = await supabase
      .from("user_payment_sources")
      .delete()
      .eq("user_id", userId);

    if (deletePaymentError) {
      console.error("Error eliminando métodos de pago:", deletePaymentError);
      // No retornamos error aquí porque la suscripción ya fue cancelada exitosamente
      // Solo loggeamos el error
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error en cancelSubscription:", err);
    return { success: false, error: err.message };
  }
};
