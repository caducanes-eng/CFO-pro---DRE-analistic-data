import { createClient } from '@supabase/supabase-js';

// Credenciais integradas conforme solicitado pelo Financial Architect
const supabaseUrl = 'https://pfjlmjghiwnegfrdsfuq.supabase.co';
const supabaseAnonKey = 'sb_publishable_xWe4Cx6bdB6hC5jmqH1l9w_OnPHUxnD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = true;
