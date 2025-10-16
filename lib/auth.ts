// /lib/auth.ts
import jwt from 'jsonwebtoken';

export type AuthedUser = { id: number; email: string };

// Extract user from a signed cookie "dp_auth" (JWT)
export async function getUserFromRequest(req: Request): Promise<AuthedUser | null> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookie = parseCookie(cookieHeader)['dp_auth'];
  if (!cookie) return null;

  try {
    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;
    if (!payload?.id || !payload?.email) return null;
    return { id: Number(payload.id), email: String(payload.email) };
  } catch {
    return null;
  }
}

// tiny cookie parser
function parseCookie(str: string): Record<string,string> {
  return str.split(';').reduce((acc, part) => {
    const [k, ...v] = part.trim().split('=');
    if (!k) return acc;
    acc[k] = decodeURIComponent(v.join('=') || '');
    return acc;
  }, {} as Record<string,string>);
}
