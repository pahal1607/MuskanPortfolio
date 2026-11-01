import crypto from 'node:crypto';

const key = () => 'portfolio-admin::' + (process.env.ADMIN_PASSWORD || '');
const mac = (exp) => crypto.createHmac('sha256', key()).update(String(exp)).digest('hex');
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

export function passwordOk(input) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real) return false;
  return crypto.timingSafeEqual(sha(input || ''), sha(real));
}

export function makeToken(days = 7) {
  const exp = Date.now() + days * 86400000;
  return { token: exp + '.' + mac(exp), exp };
}

export function isAuthed(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const raw = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [exp, sig] = raw.split('.');
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  const a = Buffer.from(sig), b = Buffer.from(mac(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
