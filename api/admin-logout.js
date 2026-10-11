import { query } from './_db.js';
import { getSessionFromCookie, clearSessionCookie } from './_admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getSessionFromCookie(req);
  if (token) {
    await query('DELETE FROM admin_sessions WHERE token = $1', [token]);
  }
  clearSessionCookie(res);
  return res.status(200).json({ success: true });
}