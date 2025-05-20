// Environment variables with defaults to avoid runtime errors
export const env = {
  // Supabase configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xgbdwdlmtdmqypggocfr.supabase.co',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnYmR3ZGxtdGRtcXlwZ2dvY2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTYzODQsImV4cCI6MjA2MzIzMjM4NH0.ZVC1lnAtM3ecmTwGwjp0gtcATY_dinfVPVNa3fYo0dg',
  
  // API Keys
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key', // Add your key in .env file
  
  // App URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} 