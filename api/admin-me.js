import { query } from './_db.js';
import { getSessionFromCookie, verifySession } from './_admin.js';

export default async function handler(req, res) {
  try {
    const token = getSessionFromCookie(req);
    const session = await verifySession(token, query);

    if (!session) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    return res.status(200).json({ authenticated: true, role: 'admin' });
  } catch (err) {
    console.error('admin-me error:', err);
    return res.status(500).json({ error: 'Erreur serveur', detail: err?.message });
  }
}
