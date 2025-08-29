import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hewjkfadeygzhinmwpts.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhld2prZmFkZXlnemhpbm13cHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjc2MjgsImV4cCI6MjA3MTcwMzYyOH0.ro93XZpepznI7PAFxJOf6wUMrE7og_ZQZ8p8N0mzVow';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Auth types
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    provider?: string;
  };
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
};
