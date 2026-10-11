const SESSION_COOKIE = 'admin_session';

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
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
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export function setSessionCookie(res, token, maxAge = 86400) {
  res.headers.set('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`);
}

export function clearSessionCookie(res) {
  res.headers.set('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

export async function verifySession(token, sql) {
  if (!token) return null;
  const result = await sql`
    SELECT token, expires_at FROM admin_sessions WHERE token = ${token}
  `;
  if (result.rows.length === 0) return null;
  const session = result.rows[0];
  if (new Date(session.expires_at) < new Date()) {
    await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
    return null;
  }
  return session;
}