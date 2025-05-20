"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserId, updateUserId } from "@/lib/user-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }
    
    setIsLoading(true);
    updateUserId(userId.trim());
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      router.push("/home");
    }, 1000);
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
          </div>
        </form>
      </div>
    </div>
  );
} 