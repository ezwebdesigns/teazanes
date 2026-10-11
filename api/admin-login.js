import { query } from './_db.js';
import { verifyPassword, createSessionToken, setSessionCookie } from './_admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + (parseInt(process.env.ADMIN_SESSION_TTL) || 86400000));

  try {
    await query(
      'INSERT INTO admin_sessions (token, expires_at) VALUES ($1, $2)',
      [token, expiresAt.toISOString()]
    );
  } catch (err) {
    console.error('admin-login db error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }

  setSessionCookie(res, token);
  return res.status(200).json({ success: true });
}