"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserId, updateUserId } from "@/lib/user-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { checkSupabaseConnection, checkSupabaseEnv } from "@/lib/supabase";
import { env } from "@/lib/env";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<string>("Loading...");
  const [envIssues, setEnvIssues] = useState<string[]>([]);

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check environment variables
        const { isValid, issues } = checkSupabaseEnv();
        setEnvIssues(issues);
        
        // Show environment info (omitting sensitive values)
        const envSummary = `
          URL: ${env.SUPABASE_URL ? "✓ Set" : "✗ Missing"}
          Key: ${env.SUPABASE_ANON_KEY ? "✓ Set (length: " + env.SUPABASE_ANON_KEY.length + ")" : "✗ Missing"}
          NODE_ENV: ${env.NODE_ENV}
          APP_URL: ${env.APP_URL}
        `;
        setEnvInfo(envSummary);

        // Check connection
        const connected = await checkSupabaseConnection();
        setConnectionStatus(connected ? "connected" : "failed");
        
        // If already logged in, redirect to home
        const currentUserId = getUserId();
        if (currentUserId && connected) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionStatus("error");
      }
    };
    
    checkConnection();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }
    
    setIsLoading(true);

    try {
      // Check connection again before proceeding
      const connected = await checkSupabaseConnection();
      
      if (!connected) {
        toast.error("Cannot connect to database. Using local mode only.");
        // Continue anyway after warning
      }
      
      updateUserId(userId.trim());
      
      setTimeout(() => {
        setIsLoading(false);
        router.push("/home");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
    }
  };

  // Debug info
  const connectionStatusDisplay = () => {
    if (connectionStatus === null) return "Checking connection...";
    if (connectionStatus === "connected") return "Database connected";
    if (connectionStatus === "error") return "Connection error occurred";
    return "Database connection failed - using local storage only";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-8 p-8 rounded-xl border border-border/60">
        <div className="text-center space-y-2">
          <div className="size-24 mx-auto flex items-center justify-center">
            <Image 
              src="/alpha-logo.svg" 
              alt="OpenΑlpha Logo" 
              width={96} 
              height={96} 
              className="w-full h-full"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-6">Welcome to OpenΑlpha</h1>
          <p className="text-muted-foreground">Enter your user ID to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full"
              required
            />
            <p className="text-xs text-muted-foreground">
              This ID will be used to save your conversations
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Continue to OpenΑlpha"}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            <p>First time? Just enter any ID you want to use.</p>
            <p className="mt-2">Status: {connectionStatusDisplay()}</p>

            {envIssues.length > 0 && (
              <div className="mt-2 p-2 bg-red-500/10 rounded text-left">
                <p className="font-semibold">Environment Issues:</p>
                <ul className="list-disc pl-4">
                  {envIssues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <details className="mt-2 text-left">
              <summary className="cursor-pointer">Environment Info (Debug)</summary>
              <pre className="text-xs p-2 bg-black/10 rounded mt-1 whitespace-pre-wrap">
                {envInfo}
              </pre>
            </details>
          </div>
        </form>
      </div>
    </div>
  );
} 