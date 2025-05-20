import { supabase } from "./client.js";

// Create a new config
export async function createConfig({ user_id, recordatorio }) {
    const { data, error } = await supabase
        .from('config')
        .insert([{ user_id, recordatorio }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Read all configs
export async function getConfigs() {
    const { data, error } = await supabase
        .from('config')
        .select('*');
    if (error) throw error;
    return data;
}

// Read a config by id
export async function getConfigById(id) {
    const { data, error } = await supabase
        .from('config')
        .select('*')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
}

// Update a config by id
export async function updateConfig(id, updates) {
    const { data, error } = await supabase
        .from('config')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Update a config by user id
export async function updateConfigByUserId(user_id, updates) {
    const { data, error } = await supabase
        .from('config')
        .update(updates)
        .eq('user_id', user_id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Delete a config by id
export async function deleteConfig(id) {
    const { error } = await supabase
        .from('config')
        .delete()
        .eq('id', id);
    if (error) throw error;
    return true;
}