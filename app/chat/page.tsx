import Chat from "@/components/chat";
import { Suspense } from "react";
 
export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <Chat />
    </Suspense>
  );
} 