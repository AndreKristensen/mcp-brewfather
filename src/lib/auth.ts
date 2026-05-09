import { createHmac, timingSafeEqual } from 'crypto';

// ---------------------------------------------------------------------------
// Minimal stateless JWT-like token signing using HMAC-SHA256.
// Format: base64url(payload_json) + "." + base64url(hmac_signature)
// No external dependencies — uses Node.js built-in crypto.
// ---------------------------------------------------------------------------

export interface TokenPayload {
  type: 'code' | 'access' | 'refresh';
  exp: number; // Unix timestamp (seconds)
  codeChallenge?: string; // only present on auth codes
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export function signToken(payload: TokenPayload, secret: string): string {
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(createHmac('sha256', secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyToken(token: string, secret: string): TokenPayload | null {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 1) return null;

    const body = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    const expectedSig = b64url(createHmac('sha256', secret).update(body).digest());

    // Constant-time comparison to prevent timing attacks
    const sigBuf = fromB64url(sig);
    const expBuf = fromB64url(expectedSig);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(fromB64url(body).toString('utf-8')) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
