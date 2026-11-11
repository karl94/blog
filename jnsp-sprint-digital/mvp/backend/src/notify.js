// Adaptateur de notification. En production : agrégateur SMS / WhatsApp Business API.
// En démo, les messages sont journalisés en base (table notifications) et dans la console.
const { query } = require('./db');

const CANAL = process.env.NOTIF_CANAL || 'sms';
const BASE_URL = process.env.PUBLIC_URL || 'http://localhost:5173';

async function notifier(client, { demandeId, telephone, message }) {
  const suffixe = ` ${BASE_URL}/suivi`;
  const texte = message.slice(0, 160 - suffixe.length) + suffixe; // 1 SMS = 160 caractères
  await (client || { query }).query(
    'INSERT INTO notifications (demande_id, telephone, canal, message) VALUES ($1, $2, $3, $4)',
    [demandeId, telephone, CANAL, texte],
  );
  if (process.env.NODE_ENV !== 'test' && !process.env.SUIVO_SILENCE) console.log(`[${CANAL.toUpperCase()} → ${telephone}] ${texte}`);
}

module.exports = { notifier };
