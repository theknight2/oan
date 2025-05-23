import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create a Supabase client using environment variables with fallbacks
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true, // defaults to true
      autoRefreshToken: true, // defaults to true
    },
    global: {
      // Maximum retries when a request fails
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            // Add a custom header for troubleshooting
            'X-Client-Info': 'openalpha-mcp-chat',
          },
        });
      },
    },
  }
);

// Check if Supabase environment variables are properly set
export function checkSupabaseEnv(): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  let isValid = true;

  // Check URL
  if (!env.SUPABASE_URL) {
    issues.push("SUPABASE_URL is not set");
    isValid = false;
  } else if (!env.SUPABASE_URL.includes('supabase.co')) {
    issues.push(`SUPABASE_URL appears invalid: ${env.SUPABASE_URL}`);
    isValid = false;
  }

  // Check API Key
  if (!env.SUPABASE_ANON_KEY) {
    issues.push("SUPABASE_ANON_KEY is not set");
    isValid = false;
  } else if (env.SUPABASE_ANON_KEY === 'your-supabase-anon-key' || env.SUPABASE_ANON_KEY.length < 20) {
    issues.push("SUPABASE_ANON_KEY appears to be a placeholder or invalid");
    isValid = false;
  }

  return { isValid, issues };
}

// Helper function to get database connection status with retries
export async function checkSupabaseConnection(retries = 2): Promise<boolean> {
  try {
    // First check if the URL is valid
    if (!env.SUPABASE_URL || !env.SUPABASE_URL.includes('supabase.co')) {
      console.error('Invalid Supabase URL:', env.SUPABASE_URL);
      return false;
    }

    // Make a simple query to check connection
    const { data, error } = await supabase.from('chats').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      
      // If we have retries left, wait and try again
      if (retries > 0) {
        console.log(`Retrying connection... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return checkSupabaseConnection(retries - 1);
      }
      
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    
    // If we have retries left, wait and try again
    if (retries > 0) {
      console.log(`Retrying connection after error... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return checkSupabaseConnection(retries - 1);
    }
    
    return false;
  }
} 