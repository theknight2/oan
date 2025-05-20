import { NextResponse } from "next/server";
import { getChats } from "@/lib/supabase-chat-store";
import { checkSupabaseConnection } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Check Supabase connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection error. Please check your Supabase configuration." },
        { status: 500 }
      );
    }
    
    const chats = await getChats(userId);
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
} 