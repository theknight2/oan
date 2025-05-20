// Environment variables with defaults to avoid runtime errors
export const env = {
  // Supabase configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xgbdwdlmtdmqypggocfr.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnYmR3ZGxtdGRtcXlwZ2dvY2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTYzODQsImV4cCI6MjA2MzIzMjM4NH0.ZVC1lnAtM3ecmTwGwjp0gtcATY_dinfVPVNa3fYo0dg',
  
  // API Keys
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key', // Add your key in .env file
  
  // App URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000',
  
  // Debug info
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Print all env vars (for debugging)
  printEnv: () => {
    if (typeof window !== 'undefined') {
      return 'Cannot display env vars in browser';
    }
    
    // Only print on server side
    const envVars = Object.keys(process.env)
      .filter(key => key.includes('SUPABASE') || key.includes('APP_URL') || key === 'NODE_ENV')
      .map(key => `${key}: ${process.env[key] ? 'Set' : 'Undefined'}`);
    
    return envVars.join('\n');
  }
} 