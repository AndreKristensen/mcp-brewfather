import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

// OAuth 2.0 Dynamic Client Registration (RFC 7591)
// Required by the MCP Inspector and other OAuth clients that self-register.
// Since this is a single-user server we don't store anything — just echo back
// the requested metadata with a generated client_id.
export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // ignore — all fields are optional per RFC 7591
  }

  return Response.json(
    {
      client_id: randomUUID(),
      client_id_issued_at: Math.floor(Date.now() / 1000),
      // Echo back whatever the client sent
      ...body,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
