export async function getCompanySettings() {
  const res = await fetch('/api/settings', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return { logo_url: data.logo_url };
}

export async function saveLogoUrl(logo_url) {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ logo_url }),
  });
  if (!res.ok) throw new Error('Erreur sauvegarde logo');
  return res.json();
}