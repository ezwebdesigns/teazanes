import { query } from '../../_db.js';
import { getSessionFromCookie, verifySession } from '../../_admin.js';

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
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID manquant' });
  }

  if (req.method === 'PATCH') {
    if (!(await requireAdmin(req, res))) return;
    const allowedFields = ['status', 'category', 'blends', 'estimated_quantity', 'message', 'language', 'phone'];
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date().toISOString());
    values.push(id);

    try {
      const result = await query(
        `UPDATE quote_requests SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Non trouvé' });
      }
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('PATCH quote error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'DELETE') {
    if (!(await requireAdmin(req, res))) return;
    try {
      const result = await query('DELETE FROM quote_requests WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Non trouvé' });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('DELETE quote error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}