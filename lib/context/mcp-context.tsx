"use client";

import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { startSandbox, stopSandbox } from "@/app/actions";

// Define types for MCP server
export interface KeyValuePair {
  key: string;
  value: string;
}

export type ServerStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  type: 'sse' | 'stdio';
  command?: string;
  args?: string[];
  env?: KeyValuePair[];
  headers?: KeyValuePair[];
  description?: string;
  status?: ServerStatus;
  errorMessage?: string;
  sandboxUrl?: string; // Store the sandbox URL directly on the server object
}

// Type for processed MCP server config for API
export interface MCPServerApi {
  type: 'sse';
  url: string;
  headers?: KeyValuePair[];
}

// Default MCP Server Configuration
const DEFAULT_MCP_SERVER: MCPServer = {
  id: "default-heurist-mcp",
  name: "Heurist",
  url: "https://sequencer-v2.heurist.xyz/toolf44df210/sse",
  type: "sse",
  headers: [
    {
      key: "Authorization",
      value: "Bearer 0x22fe62b6a5a34fa2255888d398b3bacd1969b12c-17b6f643748e71e"
    }
  ],
  description: "Default Heurist MCP Server",
  status: "disconnected"
};

// DexPaprika MCP Server Configuration
const DEXPAPRIKA_MCP_SERVER: MCPServer = {
  id: "dexpaprika-mcp",
  name: "DexPaprika",
  url: "https://dexpaprika-mcp.your-deployment-url.com/mcp",  // Replace with actual deployment URL when online
  type: "sse",
  headers: [],
  description: "DexPaprika MCP for cryptocurrency and DEX data analytics across multiple blockchains",
  status: "disconnected"
};

// All available servers
const AVAILABLE_MCP_SERVERS: MCPServer[] = [
  DEFAULT_MCP_SERVER,
  DEXPAPRIKA_MCP_SERVER
];

interface MCPContextType {
  mcpServers: MCPServer[];
  setMcpServers: (servers: MCPServer[]) => void;
  selectedMcpServers: string[];
  setSelectedMcpServers: (serverIds: string[]) => void;
  mcpServersForApi: MCPServerApi[];
  startServer: (serverId: string) => Promise<boolean>;
  stopServer: (serverId: string) => Promise<boolean>;
  updateServerStatus: (serverId: string, status: ServerStatus, errorMessage?: string) => void;
  getActiveServersForApi: () => MCPServerApi[];
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

// Helper function to wait for server readiness
async function waitForServerReady(url: string, maxAttempts = 20, timeout = 3000) {
  console.log(`Checking server readiness at ${url}, will try ${maxAttempts} times`);
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.status === 200) {
        console.log(`Server ready at ${url} after ${i + 1} attempts`);
        return true;
      }
      console.log(`Server not ready yet (attempt ${i + 1}), status: ${response.status}`);
    } catch (error) {
      console.log(`Server connection failed (attempt ${i + 1}): ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Wait before next attempt with progressive backoff
    const waitTime = Math.min(1000 * (i + 1), 5000); // Start with 1s, increase each time, max 5s
    console.log(`Waiting ${waitTime}ms before next attempt`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  console.log(`Server failed to become ready after ${maxAttempts} attempts`);
  return false;
}

export function MCPProvider({ children }: { children: React.ReactNode }) {
  const [mcpServers, setMcpServers] = useLocalStorage<MCPServer[]>(
    STORAGE_KEYS.MCP_SERVERS, 
    AVAILABLE_MCP_SERVERS
  );
  
  const [selectedMcpServers, setSelectedMcpServers] = useLocalStorage<string[]>(
    STORAGE_KEYS.SELECTED_MCP_SERVERS, 
    ["default-heurist-mcp"]
  );
  
  // Create a ref to track active servers and avoid unnecessary re-renders
  const activeServersRef = useRef<Record<string, boolean>>({});

  // We'll initialize the default MCP server after defining needed functions
  
  // Helper to get a server by ID
  const getServerById = (serverId: string): MCPServer | undefined => {
    return mcpServers.find(server => server.id === serverId);
  };
  
  // Update server status
  const updateServerStatus = (serverId: string, status: ServerStatus, errorMessage?: string) => {
    setMcpServers(currentServers => 
      currentServers.map(server => 
        server.id === serverId 
          ? { ...server, status, errorMessage: errorMessage || undefined } 
          : server
      )
    );
  };
  
  // Update server with sandbox URL
  const updateServerSandboxUrl = (serverId: string, sandboxUrl: string) => {
    console.log(`Storing sandbox URL for server ${serverId}: ${sandboxUrl}`);
    
    // Update in memory and force save to localStorage
    setMcpServers(currentServers => {
      const updatedServers = currentServers.map(server => 
        server.id === serverId 
          ? { ...server, sandboxUrl, status: 'connected' as ServerStatus } 
          : server
      );
      
      // Log the updated servers to verify the changes are there
      console.log('Updated server with sandbox URL:', 
        updatedServers.find(s => s.id === serverId));
      
      // Return the updated servers to set in state and localStorage
      return updatedServers;
    });
  };
  
  // Get active servers formatted for API usage
  const getActiveServersForApi = (): MCPServerApi[] => {
    return selectedMcpServers
      .map(id => getServerById(id))
      .filter((server): server is MCPServer => !!server && server.status === 'connected')
      .map(server => ({
        type: 'sse',
        url: server.type === 'stdio' && server.sandboxUrl ? server.sandboxUrl : server.url,
        headers: server.headers
      }));
  };
  
  // Start a server
  const startServer = async (serverId: string): Promise<boolean> => {
    const server = getServerById(serverId);
    if (!server) return false;
    
    // Mark server as connecting
    updateServerStatus(serverId, 'connecting');
    
    try {
      // For SSE servers, just check if the endpoint is available
      if (server.type === 'sse') {
        const isReady = await waitForServerReady(server.url);
        updateServerStatus(serverId, isReady ? 'connected' : 'error', 
          isReady ? undefined : 'Could not connect to server');
        
        // Update active servers ref
        if (isReady) {
          activeServersRef.current[serverId] = true;
        }
        
        return isReady;
      }
      
      // For stdio servers, start a sandbox
      if (server.type === 'stdio' && server.command && server.args?.length) {
        // Check if we already have a valid sandbox URL
        if (server.sandboxUrl) {
          try {
            const isReady = await waitForServerReady(server.sandboxUrl);
            if (isReady) {
              updateServerStatus(serverId, 'connected');
              activeServersRef.current[serverId] = true;
              return true;
            }
          } catch {
            // If sandbox check fails, we'll create a new one
          }
        }
        
        // Create a new sandbox
        const { url } = await startSandbox({
          id: serverId,
          command: server.command,
          args: server.args,
          env: server.env,
        });
        
        // Wait for the server to become ready
        const isReady = await waitForServerReady(url);
        
        if (isReady) {
          // Store the sandbox URL and update status - do this first!
          console.log(`Server ${serverId} started successfully, storing sandbox URL: ${url}`);
          updateServerSandboxUrl(serverId, url);
          
          // Mark as active
          activeServersRef.current[serverId] = true;
          return true;
        } else {
          // Failed to start
          updateServerStatus(serverId, 'error', 'Server failed to start');
          
          // Clean up sandbox
          try {
            await stopSandbox(serverId);
          } catch (error) {
            console.error(`Failed to stop non-responsive sandbox ${serverId}:`, error);
          }
          
          return false;
        }
      }
      
      // If we get here, something is misconfigured
      updateServerStatus(serverId, 'error', 'Invalid server configuration');
      return false;
    } catch (error) {
      // Handle any unexpected errors
      console.error(`Error starting server ${serverId}:`, error);
      updateServerStatus(serverId, 'error', 
        `Error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };
  
  // Stop a server
  const stopServer = async (serverId: string): Promise<boolean> => {
    const server = getServerById(serverId);
    if (!server) return false;
    
    try {
      // For stdio servers with sandbox, stop the sandbox
      if (server.type === 'stdio' && server.sandboxUrl) {
        try {
          await stopSandbox(serverId);
          console.log(`Stopped sandbox for server ${serverId}`);
          
          // Mark as not active
          delete activeServersRef.current[serverId];
        } catch (error) {
          console.error(`Error stopping sandbox for server ${serverId}:`, error);
        }
      }
      
      // Update server status
      updateServerStatus(serverId, 'disconnected');
      return true;
    } catch (error) {
      console.error(`Error stopping server ${serverId}:`, error);
      return false;
    }
  };
  
  // Calculate mcpServersForApi based on current state
  const mcpServersForApi = getActiveServersForApi();
  
  // Initialize the default MCP server on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultServer = mcpServers.find(server => server.id === "default-heurist-mcp");
      if (defaultServer && defaultServer.status !== 'connected') {
        startServer("default-heurist-mcp").then(success => {
          console.log(`Default MCP server initialization ${success ? 'successful' : 'failed'}`);
        });
      }
    }
  }, [mcpServers, startServer]);

  return (
    <MCPContext.Provider 
      value={{ 
        mcpServers, 
        setMcpServers, 
        selectedMcpServers, 
        setSelectedMcpServers,
        mcpServersForApi,
        startServer,
        stopServer,
        updateServerStatus,
        getActiveServersForApi
      }}
    >
      {children}
    </MCPContext.Provider>
  );
}

export function useMCP() {
  const context = useContext(MCPContext);
  if (context === undefined) {
    throw new Error("useMCP must be used within an MCPProvider");
  }
  return context;
} 