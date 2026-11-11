const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { query } = require('./db');

const SECRET = process.env.JWT_SECRET || 'dev-secret-a-changer';
const DEMO = process.env.DEMO_MODE !== 'false';
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ESSAIS = 5;

const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
const normaliserTel = (t) => String(t || '').replace(/[^\d+]/g, '');
const telValide = (t) => /^(\+?225)?0?\d{8,10}$/.test(t);

async function demanderOtp(telephone) {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await query(
    `INSERT INTO otp (telephone, code_hash, expire_le, tentatives) VALUES ($1, $2, $3, 0)
     ON CONFLICT (telephone) DO UPDATE SET code_hash = $2, expire_le = $3, tentatives = 0`,
    [telephone, hash(code), new Date(Date.now() + OTP_TTL_MS)],
  );
  if (process.env.NODE_ENV !== 'test') console.log(`[OTP → ${telephone}] ${code}`);
  return code;
}

async function verifierOtp(telephone, code) {
  const { rows } = await query('SELECT * FROM otp WHERE telephone = $1', [telephone]);
  const otp = rows[0];
  if (!otp || otp.expire_le < new Date()) return { ok: false, erreur: 'Code expiré, demandez-en un nouveau.' };
  if (otp.tentatives >= OTP_MAX_ESSAIS) return { ok: false, erreur: 'Trop de tentatives, demandez un nouveau code.' };
  if (otp.code_hash !== hash(String(code))) {
    await query('UPDATE otp SET tentatives = tentatives + 1 WHERE telephone = $1', [telephone]);
    return { ok: false, erreur: 'Code incorrect.' };
  }
  await query('DELETE FROM otp WHERE telephone = $1', [telephone]);
  return { ok: true };
}

const signer = (u) => jwt.sign({ id: u.id, role: u.role, service_id: u.service_id }, SECRET, { expiresIn: '7d' });

function authentifie(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ erreur: 'Connexion requise' });
  try {
    req.user = jwt.verify(token, SECRET);
    return next();
  } catch {
    return res.status(401).json({ erreur: 'Session expirée' });
  }
}

const exigeRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ erreur: 'Accès refusé' });

module.exports = { DEMO, demanderOtp, verifierOtp, signer, authentifie, exigeRole, normaliserTel, telValide };
