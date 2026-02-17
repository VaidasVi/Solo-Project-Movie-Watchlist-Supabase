// Supabase client configuration
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.error("Supabase environment variables are missing:", {
		VITE_SUPABASE_URL: supabaseUrl ? "present" : "missing",
		VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "present" : "missing",
	});
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
