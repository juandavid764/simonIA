import { supabase } from "../supabase/client.js";


// insert User into 'users' table
export async function insertUser({ telefono, nombre }) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        telefono: telefono,
        nombre: nombre,
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
