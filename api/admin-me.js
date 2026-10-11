import { query } from './_db.js';
import { getSessionFromCookie, verifySession } from './_admin.js';

export default async function handler(req, res) {
  const token = getSessionFromCookie(req);
  const session = await verifySession(token, query);
  
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  return res.status(200).json({ authenticated: true, role: 'admin' });
}