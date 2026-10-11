import { query } from '../_db.js';
import { getSessionFromCookie, verifySession } from '../_admin.js';

async function requireAdmin(req, res) {
  try {
    const token = getSessionFromCookie(req);
    const session = await verifySession(token, query);
    if (!session) {
      res.status(401).json({ error: 'Non authentifié' });
      return false;
    }
    return true;
  } catch (err) {
    console.error('requireAdmin error:', err);
    res.status(500).json({ error: 'Erreur vérification session', detail: err?.message });
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!(await requireAdmin(req, res))) return;
    try {
      const result = await query('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 200');
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error('GET quotes error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    const { full_name, business_name, email, phone, service_type, category, blends, estimated_quantity, message, language, status } = req.body;
    
    if (!full_name || !business_name || !email) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    try {
      const result = await query(
        `INSERT INTO quote_requests (full_name, business_name, email, phone, service_type, category, blends, estimated_quantity, message, language, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [full_name, business_name, email, phone || '', service_type || 'private_label_in_house', category || null, blends || [], estimated_quantity || '', message || '', language || 'fr', status || 'new']
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('POST quotes error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}