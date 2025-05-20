<a href="https://openalpha.ai">
  <h1 align="center">OpenΑlpha MCP Chat</h1>
</a>

<p align="center">
  An open-source AI chatbot app powered by Model Context Protocol (MCP), built with Next.js and the AI SDK by Vercel.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> •
  <a href="#mcp-server-configuration"><strong>MCP Configuration</strong></a> •
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Features

- Streaming text responses powered by the [AI SDK by Vercel](https://sdk.vercel.ai/docs), allowing multiple AI providers to be used interchangeably with just a few lines of code.
- Full integration with [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers to expand available tools and capabilities.
- Multiple MCP transport types (SSE and stdio) for connecting to various tool providers.
- Built-in tool integration for extending AI capabilities.
- Reasoning model support.
- [shadcn/ui](https://ui.shadcn.com/) components for a modern, responsive UI powered by [Tailwind CSS](https://tailwindcss.com).
- Built with the latest [Next.js](https://nextjs.org) App Router.

## Database Configuration

This application uses Supabase for data storage. See [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) for detailed setup instructions.

## MCP Server Configuration

This application supports connecting to Model Context Protocol (MCP) servers to access their tools. You can add and manage MCP servers through the settings icon in the chat interface.

### Adding an MCP Server

1. Click the settings icon (⚙️) next to the model selector in the chat interface.
2. Enter a name for your MCP server.
3. Select the transport type:
   - **SSE (Server-Sent Events)**: For HTTP-based remote servers
   - **stdio (Standard I/O)**: For local servers running on the same machine

#### SSE Configuration

If you select SSE transport:
1. Enter the server URL (e.g., `https://mcp.example.com/token/sse`)
2. Click "Add Server"

#### stdio Configuration

If you select stdio transport:
1. Enter the command to execute (e.g., `npx`)
2. Enter the command arguments (e.g., `-y @modelcontextprotocol/server-google-maps`)
   - You can enter space-separated arguments or paste a JSON array
3. Click "Add Server"

4. Click "Use" to activate the server for the current chat session.

### Available MCP Servers

You can use any MCP-compatible server with this application. Here are some examples:

- [Composio](https://composio.dev/mcp) - Provides search, code interpreter, and other tools
- [Zapier MCP](https://zapier.com/mcp) - Provides access to Zapier tools
- Any MCP server using stdio transport with npx and python3

## Using DexPaprika MCP

OpenΑlpha includes built-in support for DexPaprika's cryptocurrency and DEX data API, providing comprehensive market data across multiple blockchains.

### What DexPaprika Offers
- Token Analysis: Track price movements, liquidity depth changes, and volume patterns
- DEX Comparisons: Analyze fee structures, volume, and available pools across different DEXes
- Liquidity Pool Analytics: Monitor TVL changes, impermanent loss, and price impact assessments
- Technical Analysis: Perform analysis using historical OHLCV data, including trend identification and indicators

### Deployment Setup
When deploying Openαlpha with DexPaprika MCP integration, follow these steps:

1. Deploy the DexPaprika MCP server:
   - Option 1: Use a hosted instance (recommended for production)
   - Option 2: Self-host using the DexPaprika Docker image:
     ```
     docker pull coinpaprika/dexpaprika-mcp:latest
     docker run -p 8010:8010 coinpaprika/dexpaprika-mcp:latest
     ```

2. Update the DexPaprika MCP server URL in your deployment:
   - Open `lib/context/mcp-context.tsx`
   - Replace the placeholder URL for DexPaprika with your actual deployment URL:
     ```typescript
     const DEXPAPRIKA_MCP_SERVER: MCPServer = {
       // ... other configuration ...
       url: "https://your-actual-dexpaprika-deployment.com/mcp",
       // ... rest of the configuration
     };
     ```

3. Enable the DexPaprika MCP server in the user interface settings.

### Example Prompts
When DexPaprika is enabled, you can ask:
- "Compare trading volume between Uniswap V3 and SushiSwap on Ethereum"
- "Get the 7-day price data for SOL/USDC on Raydium and analyze the trend"
- "Find the top 5 liquidity pools on Fantom network"
- "Which tokens have seen >10% price increases in the last 24h on Binance Smart Chain?"

### Resources
- [DexPaprika API Documentation](https://docs.dexpaprika.com)
- [DexPaprika MCP GitHub Repository](https://github.com/coinpaprika/dexpaprika-mcp)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.