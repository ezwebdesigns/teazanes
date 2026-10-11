import { getSessionFromCookie, verifySession } from './_admin.js';
import { query } from './_db.js';
import { put } from '@vercel/blob';

const MAX_SIZE = 5 * 1024 * 1024;

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireAdmin(req, res))) return;

  try {
    const { filename, contentType, data } = req.body || {};

    if (!filename || !contentType || !data) {
      return res.status(400).json({ error: 'Données du fichier manquantes' });
    }

    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Type de fichier non supporté' });
    }

    const buffer = Buffer.from(data, 'base64');
    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Fichier vide' });
    }
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }

    const safe = `logo-${Date.now()}-${String(filename).replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { url } = await put(safe, buffer, {
      access: 'public',
      contentType,
    });

    return res.status(200).json({ file_url: url });
  } catch (err) {
    console.error('upload-logo error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
