// Exemple d'endpoint Vercel Serverless avec Resend.
// A placer dans /api/send-ticket-email.js si tu déploies sur Vercel.
// Variable Vercel requise: RESEND_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, bcc, subject, customerName, customerEmail, eventCity, eventVenue, eventDate, quantity, total, message } = req.body || {};
  if (!to || !customerEmail || !customerName) return res.status(400).json({ error: 'Missing required fields' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Billetterie <onboarding@resend.dev>',
      to,
      bcc: bcc ? [bcc] : undefined,
      subject: subject || 'Reservation Ninho - M.I.L.S 4',
      html: `
        <h1>Reservation confirmee</h1>
        <p>Bonjour ${customerName},</p>
        <p>Votre reservation pour <strong>Ninho - M.I.L.S 4</strong> a bien ete enregistree.</p>
        <ul>
          <li>Concert : ${eventCity} - ${eventVenue}</li>
          <li>Date : ${eventDate}</li>
          <li>Quantite : ${quantity}</li>
          <li>Total : ${total} EUR</li>
        </ul>
        <pre>${message || ''}</pre>
      `,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) return res.status(response.status).json(data);
  return res.status(200).json({ ok: true, data });
}
