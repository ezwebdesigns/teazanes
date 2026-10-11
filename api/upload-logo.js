import { getSessionFromCookie, verifySession } from './_admin.js';
import { query } from './_db.js';
import { put } from '@vercel/blob';

async function requireAdmin(req, res) {
  const token = getSessionFromCookie(req);
  const session = await verifySession(token, query);
  if (!session) {
    res.status(401).json({ error: 'Non authentifié' });
    return false;
  }
  return true;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireAdmin(req, res))) return;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return res.status(400).json({ error: 'Fichier manquant' });
    }

    if (!file.type.startsWith('image/')) {
      return res.status(400).json({ error: 'Type de fichier non supporté' });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { url } = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    });

    return res.status(200).json({ file_url: url });
  } catch (err) {
    console.error('upload-logo error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}