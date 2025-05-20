import { supabase } from "./client.js";

// insert User into 'users' table
export async function insertUser({ telefono, nombre, contrasena = null}) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        telefono: telefono,
        nombre: nombre,
        contrasena: contrasena,
      },
    ])
    .select();

  if (error) {
    console.log(error);
    return null;
  }

  console.log(data);
  return data;
}

export const validarUsuario = async (phone, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("telefono", phone)
    .eq("contrasena", password)
    .single();
  if (error) {
    console.error("Error al validar usuario:", error);
    return null;
  }

  return data;
};

export const updateUser = async (userId, userData) => {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", userId)
    .select();

  if (error) {
    console.error("Error al actualizar usuario:", error);
    return null;
  }

  return data;
};
