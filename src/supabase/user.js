import { supabase } from "./client.js";

const toDigits = (value = "") => value.replace(/\D/g, "");

export const normalizePhone = (phone = "") => {
  const digits = toDigits(phone);

  if (digits.length === 10) return `57${digits}`;
  if (digits.length === 12 && digits.startsWith("57")) return digits;

  return digits;
};

export async function getUserProfileById(userId) {
  if (userId === null || typeof userId === "undefined") return null;

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, telefono, fecha_registro")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function insertUser({ telefono, nombre, contrasena = null }) {
  const normalizedPhone = normalizePhone(telefono);

  if (!normalizedPhone || !contrasena) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .insert([
      {
        nombre,
        telefono: normalizedPhone,
        contrasena,
      },
    ])
    .select("id, nombre, telefono, fecha_registro")
    .single();

  if (error) {
    console.error("Error al registrar usuario:", error);
    return null;
  }

  return data;
}

export const validarUsuario = async (phone, password) => {
  const normalizedPhone = normalizePhone(phone);

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, telefono, fecha_registro")
    .eq("telefono", normalizedPhone)
    .eq("contrasena", password)
    .maybeSingle();

  if (error) {
    console.error("Error al validar usuario:", error);
    return null;
  }

  return data || null;
};

export const updateUser = async (userId, userData) => {
  if (!userId) return null;

  const updates = { ...userData };

  if (typeof updates.telefono === "string" && updates.telefono.length > 0) {
    updates.telefono = normalizePhone(updates.telefono);
  }

  if (typeof updates.contrasena === "string" && updates.contrasena.length === 0) {
    delete updates.contrasena;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", userId)
    .select("id, nombre, telefono, fecha_registro")
    .single();

  if (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }

  return data;
};
