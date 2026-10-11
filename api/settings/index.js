import { query } from '../_db.js';
import { getSessionFromCookie, verifySession } from '../_admin.js';

async function requireAdmin(req, res) {
  const token = getSessionFromCookie(req);
  const session = await verifySession(token, query);
  if (!session) {
    res.status(401).json({ error: 'Non authentifié' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT logo_url FROM company_settings WHERE id = 1');
      return res.status(200).json({ logo_url: result.rows[0]?.logo_url || '' });
    } catch (err) {
      console.error('GET settings error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    if (!(await requireAdmin(req, res))) return;
    const { logo_url } = req.body;
    try {
      await query(
        'INSERT INTO company_settings (id, logo_url, updated_at) VALUES (1, $1, NOW()) ON CONFLICT (id) DO UPDATE SET logo_url = $1, updated_at = NOW()',
        [logo_url || '']
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('PUT settings error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}