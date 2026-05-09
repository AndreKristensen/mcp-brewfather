import { NextRequest } from 'next/server';

// OAuth 2.0 Authorization Server Metadata (RFC 8414)
// Served at /.well-known/oauth-authorization-server via next.config.ts rewrite.
export function GET(request: NextRequest) {
  const base = new URL(request.url);
  const issuer = `${base.protocol}//${base.host}`;

  return Response.json({
    issuer,
    authorization_endpoint: `${issuer}/api/mcp/authorize`,
    token_endpoint: `${issuer}/api/mcp/token`,
    registration_endpoint: `${issuer}/api/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
  });
}
