import { NextRequest } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { BrewfatherClient } from '@/src/mcp/client';
import { registerBatchTools } from '@/src/mcp/tools/batches';
import { registerRecipeTools } from '@/src/mcp/tools/recipes';
import { registerInventoryTools } from '@/src/mcp/tools/inventory';
import { verifyToken } from '@/lib/auth';

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const BREWFATHER_USER_ID = process.env.BREWFATHER_USER_ID;
const BREWFATHER_API_KEY = process.env.BREWFATHER_API_KEY;

// Verifies the HMAC-signed OAuth access token issued by /api/mcp/token.
function isAuthorized(request: NextRequest): boolean {
  try {
    if (!MCP_AUTH_TOKEN) return false;
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return false;
    const payload = verifyToken(authHeader.slice(7), MCP_AUTH_TOKEN);
    return payload?.type === 'access';
  } catch {
    return false;
  }
}

async function handleRequest(request: NextRequest): Promise<Response> {
  if (!isAuthorized(request) || !BREWFATHER_USER_ID || !BREWFATHER_API_KEY) {
    // Return 401 with WWW-Authenticate so MCP clients initiate the OAuth flow.
    // Claude will discover the authorization server via /.well-known/oauth-authorization-server.
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Bearer' },
    });
  }

  const client = new BrewfatherClient(BREWFATHER_USER_ID, BREWFATHER_API_KEY);
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
