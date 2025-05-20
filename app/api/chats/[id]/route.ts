import { NextResponse } from "next/server";
import { getChatById, deleteChat } from "@/lib/supabase-chat-store";
import { checkSupabaseConnection } from "@/lib/supabase";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
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
    
    const { id } = await params;
    const chat = await getChatById(id, userId);
    
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
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
    
    const { id } = await params;
    await deleteChat(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
} 