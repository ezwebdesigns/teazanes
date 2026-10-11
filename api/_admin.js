const SESSION_COOKIE = 'admin_session';

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof password !== 'string') return false;
  if (password.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

export function createSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSessionFromCookie(req) {
  const cookie = req.headers?.cookie || '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function setSessionCookie(res, token, maxAgeSeconds) {
  const ttlMs = Number(process.env.ADMIN_SESSION_TTL) || 86400000;
  const maxAge = maxAgeSeconds ?? Math.floor(ttlMs / 1000);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

export async function verifySession(token, queryFn) {
  if (!token) return null;
  const result = await queryFn('SELECT token, expires_at FROM admin_sessions WHERE token = $1', [
    token,
  ]);
  if (result.rows.length === 0) return null;
  const session = result.rows[0];
  if (new Date(session.expires_at) < new Date()) {
    await queryFn('DELETE FROM admin_sessions WHERE token = $1', [token]);
    return null;
  }
  return session;
}
