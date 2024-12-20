import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://goadsipygomhxrtvxoum.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYWRzaXB5Z29taHhydHZ4b3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjY0MDEsImV4cCI6MjA0OTQwMjQwMX0.vkdbiimB5_360GvtUg8iEUNLY1klxSklCfHKBPEnIDY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

