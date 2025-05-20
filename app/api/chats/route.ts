import { NextResponse } from "next/server";
import { getChats } from "@/lib/supabase-chat-store";
import { checkSupabaseConnection, checkSupabaseEnv } from "@/lib/supabase";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Check environment variables first
    const { isValid, issues } = checkSupabaseEnv();
    if (!isValid) {
      return NextResponse.json(
        { 
          error: "Invalid Supabase configuration", 
          issues,
          envStatus: {
            urlSet: !!env.SUPABASE_URL,
            keySet: !!env.SUPABASE_ANON_KEY,
            nodeEnv: env.NODE_ENV
          }
        },
        { status: 500 }
      );
    }
    
    // Check Supabase connection
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: "Database connection error. Please check your Supabase configuration.",
          envStatus: {
            urlSet: !!env.SUPABASE_URL,
            keySet: !!env.SUPABASE_ANON_KEY,
            nodeEnv: env.NODE_ENV
          }
        },
        { status: 500 }
      );
    }
    
    const chats = await getChats(userId);
    return NextResponse.json(chats);
  } catch (error: any) {
    console.error("Error fetching chats:", error);
    
    // Provide more detailed error info
    return NextResponse.json(
      { 
        error: "Failed to fetch chats",
        message: error?.message || "Unknown error",
        envStatus: {
          urlSet: !!env.SUPABASE_URL,
          keySet: !!env.SUPABASE_ANON_KEY,
          nodeEnv: env.NODE_ENV
        }
      },
      { status: 500 }
    );
  }
} 