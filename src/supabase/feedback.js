import { supabase } from "./client.js";


// Crear feedback
export async function createFeedback({ user_id, message }) {
    const { data, error } = await supabase
        .from('feedback')
        .insert([{ user_id, message }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Leer feedback por id
export async function getFeedbackById(id) {
    const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// Leer todos los feedbacks
export async function getAllFeedback() {
    const { data, error } = await supabase
        .from('feedback')
        .select('*');
    if (error) throw error;
    return data;
}

// Actualizar feedback
export async function updateFeedback(id, { message }) {
    const { data, error } = await supabase
        .from('feedback')
        .update({ message })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Eliminar feedback
export async function deleteFeedback(id) {
    const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
}