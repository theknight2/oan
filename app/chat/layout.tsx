"use client";

import { useEffect } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Menu } from "lucide-react";
import { getUserId } from "@/lib/user-id";
import { useRouter } from "next/navigation";
import { useMCP } from "@/lib/context/mcp-context";
import Link from "next/link";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  // Get MCP context
  const { mcpServers, selectedMcpServers, setSelectedMcpServers } = useMCP();
  
  // Check if user is logged in
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
    }
  }, [router]);
  
  // Auto-connect to MCP servers
  useEffect(() => {
    if (mcpServers.length > 0 && selectedMcpServers.length === 0) {
      // Automatically select all available MCP servers
      setSelectedMcpServers(mcpServers.map(server => server.id));
    }
  }, [mcpServers, selectedMcpServers, setSelectedMcpServers]);

  return (
    <div className="flex h-dvh w-full">
      <ChatSidebar />
      <main className="flex-1 flex flex-col relative">
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <SidebarTrigger>
            <button className="flex items-center justify-center h-8 w-8 bg-muted hover:bg-accent rounded-md transition-colors">
              <Menu className="h-4 w-4" />
            </button>
          </SidebarTrigger>
          <Link href="/home" className="flex items-center justify-center h-8 w-8 bg-muted hover:bg-accent rounded-md transition-colors" title="Back to Home">
            <Home className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          {children}
        </div>
      </main>
    </div>
  );
} 