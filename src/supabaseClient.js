import { createClient } from '@supabase/supabase-js';

const superbaseUrl = import.meta.env.VITE_SUPERBASE_URL
const superbaseAnonKey = import.meta.env.VITE_SUPERBASE_ANON_KEY

const supabase = createClient(superbaseUrl, superbaseAnonKey);
export default supabase;