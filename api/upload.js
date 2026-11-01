import { put } from '@vercel/blob';
import { isAuthed } from '../lib/auth.js';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
  const { name, type, data } = req.body || {};
  const ext = EXT[type];
  if (!ext || typeof data !== 'string') return res.status(400).json({ error: 'bad_file' });
  const buf = Buffer.from(data, 'base64');
  if (!buf.length || buf.length > 3_400_000) return res.status(413).json({ error: 'too_large' });
  const safe = String(name || 'file').replace(/\.[^.]*$/, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 40) || 'file';
  try {
    const out = await put('uploads/' + safe + '.' + ext, buf, { access: 'public', addRandomSuffix: true, contentType: type, cacheControlMaxAge: 31536000 });
    return res.status(200).json({ url: out.url });
  } catch (e) {
    return res.status(500).json({ error: 'upload_failed' });
  }
}
