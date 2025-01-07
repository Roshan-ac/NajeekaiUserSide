import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://injzfowyohrgxavcnicm.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluanpmb3d5b2hyZ3hhdmNuaWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTAzMTYsImV4cCI6MjA1MTMyNjMxNn0.A0eStWCzgoGFo2F5wIqN-Nz4yOupFQbTsWThQD-DbN8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
