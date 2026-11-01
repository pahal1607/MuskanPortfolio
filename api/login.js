import { passwordOk, makeToken } from '../lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'not_configured' });
  const pw = req.body && req.body.password;
  if (!passwordOk(pw)) {
    await new Promise((r) => setTimeout(r, 900));
    return res.status(401).json({ error: 'wrong_password' });
  }
  return res.status(200).json(makeToken(7));
}
