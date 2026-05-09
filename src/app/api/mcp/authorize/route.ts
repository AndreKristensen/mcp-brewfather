import { NextRequest } from 'next/server';
import { signToken } from '@/lib/auth';

const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const CODE_TTL_SECONDS = 5 * 60; // 5 minutes

// Redirect URIs we allow (prevent open-redirect attacks).
// Claude.ai uses https://claude.ai/api/mcp/auth_callback.
const ALLOWED_REDIRECT_PREFIXES = [
  'https://claude.ai/',
  'https://claude.com/',
  'http://localhost:', // for local testing
];

function isAllowedRedirectUri(uri: string): boolean {
  try {
    const url = new URL(uri);
    // Must be HTTPS in production (allow http only for localhost)
    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      return false;
    }
    return ALLOWED_REDIRECT_PREFIXES.some((prefix) => uri.startsWith(prefix));
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function authorizePage(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  error?: string;
}): Response {
  const errorHtml = params.error
    ? `<p class="error">${escapeHtml(params.error)}</p>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorize — Brewfather MCP</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f9fafb;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 4px; }
    .subtitle { color: #6b7280; font-size: 0.875rem; margin: 0 0 24px; }
    label { display: block; font-size: 0.8125rem; font-weight: 500; color: #374151; margin-bottom: 4px; }
    input[type=text], input[type=password] {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      outline: none;
      margin-bottom: 16px;
    }
    input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
    button {
      width: 100%;
      padding: 10px;
      background: #1d4ed8;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 4px;
    }
    button:hover { background: #1e40af; }
    .error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 0.8125rem;
      padding: 10px 12px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Authorize Brewfather MCP</h1>
    <p class="subtitle">Enter your credentials to grant access.</p>
    ${errorHtml}
    <form method="POST">
      <input type="hidden" name="client_id" value="${escapeHtml(params.clientId)}">
      <input type="hidden" name="redirect_uri" value="${escapeHtml(params.redirectUri)}">
      <input type="hidden" name="state" value="${escapeHtml(params.state)}">
      <input type="hidden" name="code_challenge" value="${escapeHtml(params.codeChallenge)}">
      <input type="hidden" name="code_challenge_method" value="${escapeHtml(params.codeChallengeMethod)}">

      <label for="server_token">Server Token</label>
      <input type="password" id="server_token" name="server_token" required autocomplete="off"
             placeholder="Your MCP_AUTH_TOKEN">

      <button type="submit">Authorize</button>
    </form>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// GET — show the authorization form
export function GET(request: NextRequest): Response {
  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri') ?? '';
  const codeChallenge = searchParams.get('code_challenge') ?? '';
  const codeChallengeMethod = searchParams.get('code_challenge_method') ?? '';

  if (!redirectUri || !isAllowedRedirectUri(redirectUri)) {
    return new Response('Bad Request: missing or disallowed redirect_uri', { status: 400 });
  }
  if (!codeChallenge || codeChallengeMethod !== 'S256') {
    return new Response('Bad Request: code_challenge (S256) is required', { status: 400 });
  }

  return authorizePage({
    clientId: searchParams.get('client_id') ?? '',
    redirectUri,
    state: searchParams.get('state') ?? '',
    codeChallenge,
    codeChallengeMethod,
  });
}

// POST — validate credentials and redirect with auth code
export async function POST(request: NextRequest): Promise<Response> {
  const form = await request.formData();
  const redirectUri = (form.get('redirect_uri') as string) ?? '';
  const state = (form.get('state') as string) ?? '';
  const codeChallenge = (form.get('code_challenge') as string) ?? '';
  const codeChallengeMethod = (form.get('code_challenge_method') as string) ?? '';
  const serverToken = (form.get('server_token') as string) ?? '';

  if (!redirectUri || !isAllowedRedirectUri(redirectUri)) {
    return new Response('Bad Request', { status: 400 });
  }

  const invalid = !MCP_AUTH_TOKEN || serverToken !== MCP_AUTH_TOKEN;

  if (invalid) {
    return authorizePage({
      clientId: (form.get('client_id') as string) ?? '',
      redirectUri,
      state,
      codeChallenge,
      codeChallengeMethod,
      error: 'Invalid credentials. Check your Server Token, User ID, and API Key.',
    });
  }

  const code = signToken(
    {
      type: 'code',
      exp: Math.floor(Date.now() / 1000) + CODE_TTL_SECONDS,
      codeChallenge,
    },
    MCP_AUTH_TOKEN,
  );

  const dest = new URL(redirectUri);
  dest.searchParams.set('code', code);
  if (state) dest.searchParams.set('state', state);

  return Response.redirect(dest.toString(), 302);
}
