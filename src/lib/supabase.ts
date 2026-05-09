import { createClient } from "@supabase/supabase-js";

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(API_URL, API_KEY);
