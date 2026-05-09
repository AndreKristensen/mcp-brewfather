import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { signToken, verifyToken } from '@/lib/auth';

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const ACCESS_TOKEN_TTL = 60 * 60; // 1 hour
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60; // 30 days

function errorJson(error: string, description?: string, status = 400): Response {
  return Response.json(
    { error, ...(description ? { error_description: description } : {}) },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

async function parseBody(request: NextRequest): Promise<Record<string, string>> {
  try {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries(new URLSearchParams(await request.text()));
    }
    return (await request.json()) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!MCP_AUTH_TOKEN) {
    return errorJson('server_error', 'Server not configured', 500);
  }

  const body = await parseBody(request);
  const { grant_type } = body;

  // ── Authorization code exchange ───────────────────────────────────────────
  if (grant_type === 'authorization_code') {
    const { code, code_verifier } = body;
    if (!code || !code_verifier) {
      return errorJson('invalid_request', 'Missing code or code_verifier');
    }

    const payload = verifyToken(code, MCP_AUTH_TOKEN);
    if (!payload || payload.type !== 'code' || !payload.codeChallenge) {
      return errorJson('invalid_grant', 'Invalid or expired authorization code');
    }

    // PKCE S256 verification
    const challenge = createHash('sha256').update(code_verifier).digest('base64url');
    if (challenge !== payload.codeChallenge) {
      return errorJson('invalid_grant', 'code_verifier mismatch');
    }

    const now = Math.floor(Date.now() / 1000);
    const access = signToken(
      { type: 'access', exp: now + ACCESS_TOKEN_TTL },
      MCP_AUTH_TOKEN,
    );
    const refresh = signToken(
      { type: 'refresh', exp: now + REFRESH_TOKEN_TTL },
      MCP_AUTH_TOKEN,
    );

    return Response.json(
      { access_token: access, token_type: 'Bearer', expires_in: ACCESS_TOKEN_TTL, refresh_token: refresh },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // ── Refresh token exchange ────────────────────────────────────────────────
  if (grant_type === 'refresh_token') {
    const { refresh_token } = body;
    if (!refresh_token) {
      return errorJson('invalid_request', 'Missing refresh_token');
    }

    const payload = verifyToken(refresh_token, MCP_AUTH_TOKEN);
    if (!payload || payload.type !== 'refresh') {
      return errorJson('invalid_grant', 'Invalid or expired refresh token');
    }

    const now = Math.floor(Date.now() / 1000);
    const access = signToken(
      { type: 'access', exp: now + ACCESS_TOKEN_TTL },
      MCP_AUTH_TOKEN,
    );
    const newRefresh = signToken(
      { type: 'refresh', exp: now + REFRESH_TOKEN_TTL },
      MCP_AUTH_TOKEN,
    );

    return Response.json(
      { access_token: access, token_type: 'Bearer', expires_in: ACCESS_TOKEN_TTL, refresh_token: newRefresh },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return errorJson('unsupported_grant_type');
}
