import { supabase } from "./supabase";
import { nanoid } from "nanoid";
import { generateTitle } from "@/app/actions";

export type MessagePart = {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  args?: any;
  result?: any;
  [key: string]: any;
};

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  TOOL = "tool"
}

export type Chat = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DBMessage = {
  id: string;
  chatId: string;
  role: string;
  parts: MessagePart[];
  createdAt: Date;
};

export type Message = {
  id: string;
  chatId: string;
  role: string;
  parts: MessagePart[];
  createdAt: Date;
};

type AIMessage = {
  role: string;
  content: string | any[];
  id?: string;
  parts?: MessagePart[];
};

type UIMessage = {
  id: string;
  role: string;
  content: string;
  parts: MessagePart[];
  createdAt?: Date;
};

type SaveChatParams = {
  id?: string;
  userId: string;
  messages?: any[];
  title?: string;
};

type ChatWithMessages = Chat & {
  messages: Message[];
};

// Save messages to Supabase
export async function saveMessages({
  messages: dbMessages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    if (dbMessages.length > 0) {
      const chatId = dbMessages[0].chatId;
      
      // First delete any existing messages for this chat
      await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId);
      
      // Then insert the new messages
      const { data, error } = await supabase
        .from('messages')
        .insert(
          dbMessages.map(msg => ({
            id: msg.id,
            chat_id: msg.chatId,
            role: msg.role,
            parts: msg.parts,
            created_at: msg.createdAt.toISOString()
          }))
        );
        
      if (error) {
        console.error('Error inserting messages:', error);
        throw error;
      }
      
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

// Function to convert AI messages to DB format
export function convertToDBMessages(aiMessages: AIMessage[], chatId: string): DBMessage[] {
  return aiMessages.map(msg => {
    // Use existing id or generate a new one
    const messageId = msg.id || nanoid();
    
    // If msg has parts, use them directly
    if (msg.parts) {
      return {
        id: messageId,
        chatId,
        role: msg.role,
        parts: msg.parts,
        createdAt: new Date()
      };
    }
    
    // Otherwise, convert content to parts
    let parts: MessagePart[];
    
    if (typeof msg.content === 'string') {
      parts = [{ type: 'text', text: msg.content }];
    } else if (Array.isArray(msg.content)) {
      if (msg.content.every(item => typeof item === 'object' && item !== null)) {
        // Content is already in parts-like format
        parts = msg.content as MessagePart[];
      } else {
        // Content is an array but not in parts format
        parts = [{ type: 'text', text: JSON.stringify(msg.content) }];
      }
    } else {
      // Default case
      parts = [{ type: 'text', text: String(msg.content) }];
    }
    
    return {
      id: messageId,
      chatId,
      role: msg.role,
      parts,
      createdAt: new Date()
    };
  });
}

// Convert DB messages to UI format
export function convertToUIMessages(dbMessages: Array<any>): Array<UIMessage> {
  return dbMessages.map((message) => ({
    id: message.id,
    parts: message.parts,
    role: message.role,
    content: getTextContent(message),
    createdAt: new Date(message.created_at),
  }));
}

export async function saveChat({ id, userId, messages: aiMessages, title }: SaveChatParams) {
  // Generate a new ID if one wasn't provided
  const chatId = id || nanoid();
  
  // Check if title is provided, if not generate one
  let chatTitle = title;
  
  // Generate title if messages are provided and no title is specified
  if (aiMessages && aiMessages.length > 0) {
    const hasEnoughMessages = aiMessages.length >= 2 && 
      aiMessages.some(m => m.role === 'user') && 
      aiMessages.some(m => m.role === 'assistant');
    
    if (!chatTitle || chatTitle === 'New Chat' || chatTitle === undefined) {
      if (hasEnoughMessages) {
        try {
          // Use AI to generate a meaningful title based on conversation
          chatTitle = await generateTitle(aiMessages);
        } catch (error) {
          console.error('Error generating title:', error);
          // Fallback to basic title extraction if AI title generation fails
          const firstUserMessage = aiMessages.find(m => m.role === 'user');
          if (firstUserMessage) {
            // Check for parts first (new format)
            if (firstUserMessage.parts && Array.isArray(firstUserMessage.parts)) {
              const textParts = firstUserMessage.parts.filter((p: MessagePart) => p.type === 'text' && p.text);
              if (textParts.length > 0) {
                chatTitle = textParts[0].text?.slice(0, 50) || 'New Chat';
                if ((textParts[0].text?.length || 0) > 50) {
                  chatTitle += '...';
                }
              } else {
                chatTitle = 'New Chat';
              }
            } 
            // Fallback to content (old format)
            else if (typeof firstUserMessage.content === 'string') {
              chatTitle = firstUserMessage.content.slice(0, 50);
              if (firstUserMessage.content.length > 50) {
                chatTitle += '...';
              }
            } else {
              chatTitle = 'New Chat';
            }
          } else {
            chatTitle = 'New Chat';
          }
        }
      } else {
        // Not enough messages for AI title, use first message
        const firstUserMessage = aiMessages.find(m => m.role === 'user');
        if (firstUserMessage) {
          // Check for parts first (new format)
          if (firstUserMessage.parts && Array.isArray(firstUserMessage.parts)) {
            const textParts = firstUserMessage.parts.filter((p: MessagePart) => p.type === 'text' && p.text);
            if (textParts.length > 0) {
              chatTitle = textParts[0].text?.slice(0, 50) || 'New Chat';
              if ((textParts[0].text?.length || 0) > 50) {
                chatTitle += '...';
              }
            } else {
              chatTitle = 'New Chat';
            }
          }
          // Fallback to content (old format)
          else if (typeof firstUserMessage.content === 'string') {
            chatTitle = firstUserMessage.content.slice(0, 50);
            if (firstUserMessage.content.length > 50) {
              chatTitle += '...';
            }
          } else {
            chatTitle = 'New Chat';
          }
        } else {
          chatTitle = 'New Chat';
        }
      }
    }
  } else {
    chatTitle = chatTitle || 'New Chat';
  }

  // Check if chat already exists
  const { data: existingChat } = await supabase
    .from('chats')
    .select()
    .eq('id', chatId)
    .eq('user_id', userId)
    .single();

  if (existingChat) {
    // Update existing chat
    const { error } = await supabase
      .from('chats')
      .update({ 
        title: chatTitle,
        updated_at: new Date().toISOString() 
      })
      .eq('id', chatId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  } else {
    // Create new chat
    const { error } = await supabase
      .from('chats')
      .insert({
        id: chatId,
        user_id: userId,
        title: chatTitle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  return { id: chatId };
}

// Helper to get just the text content for display
export function getTextContent(message: any): string {
  try {
    const parts = message.parts;
    return parts
      .filter((part: MessagePart) => part.type === 'text' && part.text)
      .map((part: MessagePart) => part.text)
      .join('\n');
  } catch (e) {
    // If parsing fails, return empty string
    return '';
  }
}

export async function getChats(userId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select()
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
  
  return data.map(chat => ({
    id: chat.id,
    userId: chat.user_id,
    title: chat.title,
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at)
  }));
}

export async function getChatById(id: string, userId: string): Promise<ChatWithMessages | null> {
  // Get the chat
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select()
    .eq('id', id)
    .eq('user_id', userId)
    .single();
    
  if (chatError || !chat) {
    if (chatError && chatError.code !== 'PGRST116') { // PGRST116 is the not found error
      console.error('Error fetching chat:', chatError);
    }
    return null;
  }

  // Get the messages for the chat
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select()
    .eq('chat_id', id)
    .order('created_at', { ascending: true });
    
  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    throw messagesError;
  }

  return {
    id: chat.id,
    userId: chat.user_id,
    title: chat.title,
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at),
    messages: messages.map(msg => ({
      id: msg.id,
      chatId: msg.chat_id,
      role: msg.role,
      parts: msg.parts,
      createdAt: new Date(msg.created_at)
    }))
  };
}

export async function deleteChat(id: string, userId: string) {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
} 