import { query } from './_db.js';
import { getSessionFromCookie, verifySession } from './_admin.js';
import { Resend } from 'resend';
import { buildQuoteEmail } from '../../src/lib/quoteEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireAdmin(req, res))) return;

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID de la demande manquant' });
  }

  try {
    const quoteResult = await query('SELECT * FROM quote_requests WHERE id = $1', [id]);
    if (quoteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }
    const record = quoteResult.rows[0];

    const settingsResult = await query('SELECT logo_url FROM company_settings WHERE id = 1');
    const logoUrl = settingsResult.rows[0]?.logo_url || '';

    const { subject, html } = buildQuoteEmail(record, logoUrl);

    const { data, error } = await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL,
      to: record.email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Échec envoi email' });
    }

    await query(
      `UPDATE quote_requests SET status = 'validated', quote_sent_date = $1, updated_at = NOW() WHERE id = $2`,
      [new Date().toISOString(), id]
    );

    return res.status(200).json({ success: true, emailId: data?.id });
  } catch (err) {
    console.error('send-quote error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}