import { supabase } from "./client.js";

// Create a new transaction
export async function createTransaction(transaction) {
    const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Get all transactions (optionally by user_id)
export async function getTransactions(user_id = null) {
    let query = supabase.from('transactions').select('*').order('fecha', { ascending: false });
    if (user_id) {
        query = query.eq('user_id', user_id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// Get a single transaction by id
export async function getTransactionById(id) {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// Update a transaction by id
export async function updateTransaction(id, updates) {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Delete a transaction by id
export async function deleteTransaction(id) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
}
