import { NextRequest } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { BrewfatherClient } from '@/src/mcp/client';
import { registerBatchTools } from '@/src/mcp/tools/batches';
import { registerRecipeTools } from '@/src/mcp/tools/recipes';
import { registerInventoryTools } from '@/src/mcp/tools/inventory';

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

function extractCredentials(request: NextRequest): { userId: string; apiKey: string } | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const decoded = Buffer.from(authHeader.slice(7), 'base64').toString('utf-8');

    // Format: staticKey:userId:apiKey
    const first = decoded.indexOf(':');
    const second = decoded.indexOf(':', first + 1);
    if (first <= 0 || second <= 0) return null;

    const staticKey = decoded.slice(0, first);
    const userId = decoded.slice(first + 1, second);
    const apiKey = decoded.slice(second + 1);

    if (!MCP_AUTH_TOKEN || staticKey !== MCP_AUTH_TOKEN) return null;
    if (!userId || !apiKey) return null;

    return { userId, apiKey };
  } catch {
    return null;
  }
}

async function handleRequest(request: NextRequest): Promise<Response> {
  const creds = extractCredentials(request);
  if (!creds) {
    return new Response('Unauthorized: provide Authorization: Bearer base64(staticKey:userId:apiKey)', { status: 401 });
  }

  const client = new BrewfatherClient(creds.userId, creds.apiKey);
  const server = new McpServer({ name: 'brewfather', version: '0.1.0' });
  registerBatchTools(server, client);
  registerRecipeTools(server, client);
  registerInventoryTools(server, client);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — required for Vercel serverless
  });

  await server.connect(transport);
  return transport.handleRequest(request);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
