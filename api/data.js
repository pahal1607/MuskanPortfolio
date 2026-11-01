import { put, list } from '@vercel/blob';
import { isAuthed } from '../lib/auth.js';

const PATH = 'site/data.json';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: PATH });
      const b = blobs.find((x) => x.pathname === PATH);
      if (!b) return res.status(404).json({ error: 'no_data' });
      const r = await fetch(b.url + (b.url.includes('?') ? '&' : '?') + 'v=' + new Date(b.uploadedAt).getTime());
      if (!r.ok) return res.status(502).json({ error: 'fetch_failed' });
      res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30');
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: 'read_failed' });
    }
  }
  if (req.method === 'PUT') {
    res.setHeader('Cache-Control', 'no-store');
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const d = req.body;
    if (!d || typeof d !== 'object' || !d.profile || !Array.isArray(d.projects)) return res.status(400).json({ error: 'bad_data' });
    const body = JSON.stringify(d);
    if (body.length > 3_000_000) return res.status(413).json({ error: 'too_large' });
    try {
      await put(PATH, body, { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'write_failed' });
    }
  }
  return res.status(405).json({ error: 'method' });
}
