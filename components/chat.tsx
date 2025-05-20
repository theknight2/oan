"use client";

import { defaultModel, type modelID } from "@/ai/providers";
import { Message, useChat } from "@ai-sdk/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getUserId } from "@/lib/user-id";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { convertToUIMessages } from "@/lib/chat-store";
import { type Message as DBMessage } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { useMCP } from "@/lib/context/mcp-context";

// Type for chat data from DB
interface ChatData {
  id: string;
  messages: DBMessage[];
  createdAt: string;
  updatedAt: string;
}

export default function Chat() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params?.id as string | undefined;
  const queryClient = useQueryClient();
  const tool = searchParams.get('tool');
  
  const [selectedModel, setSelectedModel] = useLocalStorage<modelID>("selectedModel", defaultModel);
  const [userId, setUserId] = useState<string>('');
  const [generatedChatId, setGeneratedChatId] = useState<string>('');
  
  // Get MCP server data from context
  const { mcpServersForApi } = useMCP();
  
  // Initialize userId
  useEffect(() => {
    setUserId(getUserId());
  }, []);
  
  // Generate a chat ID if needed
  useEffect(() => {
    if (!chatId) {
      setGeneratedChatId(nanoid());
    }
  }, [chatId]);

  // System message based on the selected tool
  const systemMessage = useMemo(() => {
    if (tool === 'nova') {
      return `You are Nova, an advanced AI assistant specialized in data analysis and visualization.
You have strong reasoning and analytical capabilities, and can handle complex data-related queries.
Today's date is ${new Date().toISOString().split('T')[0]}.`;
    }
    return undefined; // Let the API route use the default system message for Nebula
  }, [tool]);
  
  // Use React Query to fetch chat history
  const { data: chatData, isLoading: isLoadingChat, error } = useQuery({
    queryKey: ['chat', chatId, userId] as const,
    queryFn: async ({ queryKey }) => {
      const [_, chatId, userId] = queryKey;
      if (!chatId || !userId) return null;
      
      const response = await fetch(`/api/chats/${chatId}`, {
        headers: {
          'x-user-id': userId
        }
      });
      
      if (!response.ok) {
        // For 404, return empty chat data instead of throwing
        if (response.status === 404) {
          return { id: chatId, messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        }
        throw new Error('Failed to load chat');
      }
      
      return response.json() as Promise<ChatData>;
    },
    enabled: !!chatId && !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    }
  }, [error]);
  
  // Prepare initial messages from query data
  const initialMessages = useMemo(() => {
    if (!chatData || !chatData.messages || chatData.messages.length === 0) {
      return [];
    }
    
    // Convert DB messages to UI format, then ensure it matches the Message type from @ai-sdk/react
    const uiMessages = convertToUIMessages(chatData.messages);
    return uiMessages.map(msg => ({
      id: msg.id,
      role: msg.role as Message['role'], // Ensure role is properly typed
      content: msg.content,
      parts: msg.parts,
    } as Message));
  }, [chatData]);
  
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      id: chatId || generatedChatId, // Use generated ID if no chatId in URL
      initialMessages,
      maxSteps: 20,
      body: {
        selectedModel,
        mcpServers: mcpServersForApi,
        chatId: chatId || generatedChatId, // Use generated ID if no chatId in URL
        userId,
        systemMessage, // Pass the system message based on the selected tool
      },
      experimental_throttle: 500,
      onFinish: () => {
        // Invalidate the chats query to refresh the sidebar
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ['chats', userId] });
        }
      },
      onError: (error) => {
        toast.error(
          error.message.length > 0
            ? error.message
            : "An error occured, please try again later.",
          { position: "top-center", richColors: true },
        );
      },
    });
    
  // Custom submit handler
  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!chatId && generatedChatId && input.trim()) {
      // If this is a new conversation, redirect to the chat page with the generated ID
      const effectiveChatId = generatedChatId;
      
      // Submit the form
      handleSubmit(e);
      
      // Redirect to the chat page with the generated ID and any tool parameter
      const toolParam = tool ? `?tool=${tool}` : '';
      router.push(`/chat/${effectiveChatId}${toolParam}`);
    } else {
      // Normal submission for existing chats
      handleSubmit(e);
    }
  }, [chatId, generatedChatId, input, handleSubmit, router, tool]);

  const isLoading = status === "streaming" || status === "submitted" || isLoadingChat;

  // Set page title based on tool
  const pageTitle = tool === 'nova' ? 'Nova - Data Analysis Assistant' : 'Nebula';

  return (
    <div className="h-dvh flex flex-col justify-center w-full max-w-3xl mx-auto px-3 sm:px-6 md:py-6">
      {messages.length === 0 && !isLoadingChat ? (
        <div className="max-w-xl mx-auto w-full backdrop-blur-sm bg-background/90 p-6 rounded-2xl border border-border/40 shadow-md">
          <ProjectOverview />
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium">{pageTitle}</h2>
            <p className="text-muted-foreground text-sm mt-2">
              {tool === 'nova' 
                ? 'Ask me about data analysis and visualization'
                : <span className="text-primary">Blockchain.Simplified</span>}
            </p>
          </div>
          
          {/* Sample Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <button 
              onClick={() => handleInputChange({ target: { value: "What is the current price of Bitcoin?" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">💰</span>
              <span className="line-clamp-2">What is the current price of Bitcoin?</span>
            </button>
            <button 
              onClick={() => handleInputChange({ target: { value: "What are today&apos;s trending crypto tokens?" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">📈</span>
              <span className="line-clamp-2">What are today&apos;s trending crypto tokens?</span>
            </button>
            <button 
              onClick={() => handleInputChange({ target: { value: "Analyze Ethereum wallet 0x2B25B37c683F042E9Ae1877bc59A1Bb642Eb1073" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">👛</span>
              <span className="line-clamp-2">Analyze Ethereum wallet 0x2B25B37c683F042E9Ae1877bc59A1Bb642Eb1073</span>
            </button>
            <button 
              onClick={() => handleInputChange({ target: { value: "What is the Twitter sentiment for Ethereum?" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">🐦</span>
              <span className="line-clamp-2">What is the Twitter sentiment for Ethereum?</span>
            </button>
            <button 
              onClick={() => handleInputChange({ target: { value: "What are the latest news in Web3?" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">📰</span>
              <span className="line-clamp-2">What are the latest news in Web3?</span>
            </button>
            <button 
              onClick={() => handleInputChange({ target: { value: "Check token security for 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9 on Ethereum" } } as React.ChangeEvent<HTMLTextAreaElement>)}
              className="flex items-center p-3 text-sm rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors text-left"
            >
              <span className="mr-3 text-lg">🔒</span>
              <span className="line-clamp-2">Check token security for 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9</span>
            </button>
          </div>
          
          <form
            onSubmit={handleFormSubmit}
            className="mt-6 w-full mx-auto"
          >
            <Textarea
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              handleInputChange={handleInputChange}
              input={input}
              isLoading={isLoading}
              status={status}
              stop={stop}
            />
          </form>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto min-h-0 pb-4">
            <Messages messages={messages} isLoading={isLoading} status={status} />
          </div>
          <form
            onSubmit={handleFormSubmit}
            className="sticky bottom-0 mt-2 w-full mx-auto mb-2 sm:mb-0 backdrop-blur-sm bg-background/30 pt-2 pb-3 px-1 z-10"
          >
            <Textarea
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              handleInputChange={handleInputChange}
              input={input}
              isLoading={isLoading}
              status={status}
              stop={stop}
            />
          </form>
        </>
      )}
    </div>
  );
}
