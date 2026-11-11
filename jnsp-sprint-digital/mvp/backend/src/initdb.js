// Initialise la base : schéma + référentiel + dossiers de démonstration (horodatages simulés).
// Usage : npm run db:init   (option --sans-demo pour une base vide)
process.env.SUIVO_SILENCE = '1';
const fs = require('fs');
const path = require('path');
const { pool, tx } = require('./db');
const D = require('./demandes');
const { ajouterJoursOuvres, DAY } = require('./sla');

const sql = (f) => fs.readFileSync(path.join(__dirname, '..', 'db', f), 'utf8');

// Générateur pseudo-aléatoire déterministe (démo reproductible)
let graine = 20261111;
const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);

const PRENOMS = ['Awa', 'Konan', 'Fatou', 'Yao', 'Aminata', 'Kouassi', 'Mariam', 'Ibrahim', 'Adjoua', 'Moussa', 'Affoué', 'Seydou'];
const NOMS = ['Koné', 'Kouamé', 'Traoré', 'Ouattara', 'Yao', 'Coulibaly', 'Bamba', 'Diabaté', 'Kouadio', 'Touré'];

async function agentDuService(c, serviceId) {
  const { rows } = await c.query("SELECT id, role, service_id FROM utilisateurs WHERE role = 'agent' AND service_id = $1 LIMIT 1", [serviceId]);
  return rows[0];
}

/**
 * Crée un dossier puis le fait avancer.
 * etapesValidees : nb d'étapes validées ; fin : 'piece' | 'rejet' | 'retire' | null
 * durees : durée (jours) de chaque étape validée ; ilYa : âge du dossier (jours)
 */
async function scenario(c, { telephone, nom, procedureId, canal = 'en_ligne', etapesValidees = 0, fin = null, durees = [], ilYa }) {
  const { rows: [u] } = await c.query(
    `INSERT INTO utilisateurs (telephone, nom) VALUES ($1, $2) ON CONFLICT (telephone) DO UPDATE SET nom = utilisateurs.nom RETURNING id`,
    [telephone, nom]);
  const numero = await D.creer(c, { usagerId: u.id, procedureId, canal });
  for (let i = 0; i < etapesValidees; i += 1) {
    const d = await D.charger(c, numero);
    await D.valider(c, numero, await agentDuService(c, d.etape.service_id));
  }
  const d = await D.charger(c, numero);
  if (fin === 'piece') await D.pieceManquante(c, numero, await agentDuService(c, d.etape.service_id), 'Merci de fournir la copie de la pièce d\'identité du parent.');
  if (fin === 'rejet') await D.rejeter(c, numero, await agentDuService(c, d.etape.service_id), 'Acte introuvable dans le registre de la commune.');
  if (fin === 'retire') await D.remettre(c, numero, await agentDuService(c, d.etapes[0].service_id));

  // Réécriture des horodatages pour simuler l'historique
  const t0 = Date.now() - ilYa * DAY;
  const { rows: evts } = await c.query('SELECT id, type FROM evenements WHERE demande_id = $1 ORDER BY id', [d.id]);
  let t = t0;
  let iv = 0;
  let debutEtape = t0;
  for (const ev of evts) {
    let dansLesDelais = null;
    if (ev.type === 'ETAPE_VALIDEE') {
      const duree = durees[iv] ?? 1;
      dansLesDelais = duree <= d.etapes[iv].sla_jours;
      t += duree * DAY; iv += 1; debutEtape = t;
    } else if (ev.type !== 'DEPOT' && ev.type !== 'PRET') t += 0.5 * DAY;
    await c.query('UPDATE evenements SET cree_le = $2, dans_les_delais = COALESCE($3, dans_les_delais) WHERE id = $1',
      [ev.id, new Date(t), dansLesDelais]);
  }
  const etapeCourante = d.etapes.find((e) => e.ordre === d.etape_ordre);
  const echeance = ajouterJoursOuvres(new Date(debutEtape), etapeCourante.sla_jours);
  await c.query(
    `UPDATE demandes SET cree_le = $2, etape_debut = $3, etape_echeance = $4, mis_a_jour_le = $5,
            sla_restant_ms = CASE WHEN statut = 'ATTENTE_USAGER' THEN $6::bigint ELSE NULL END WHERE id = $1`,
    [d.id, new Date(t0), new Date(debutEtape), echeance, new Date(t), Math.max(0, echeance - t)]);
  await c.query('UPDATE notifications SET cree_le = $2 WHERE demande_id = $1', [d.id, new Date(t)]);
  return numero;
}

async function main() {
  await pool.query(sql('schema.sql'));
  await pool.query(sql('seed.sql'));
  if (process.argv.includes('--sans-demo')) return;

  await tx(async (c) => {
    await c.query('ALTER TABLE evenements DISABLE TRIGGER evenements_no_update');
    // Dossiers d'Awa (compte démo usager 0700000001)
    const awa = { telephone: '0700000001', nom: 'Awa Koné' };
    const n1 = await scenario(c, { ...awa, procedureId: 2, etapesValidees: 1, durees: [2], ilYa: 12 }); // instruction en retard
    const n2 = await scenario(c, { ...awa, procedureId: 1, etapesValidees: 2, durees: [1, 1], ilYa: 3 });  // prêt
    const n3 = await scenario(c, { ...awa, procedureId: 2, fin: 'piece', ilYa: 1 });                      // pièce manquante

    // Volume de démonstration pour le tableau de bord
    for (let i = 0; i < 60; i += 1) {
      const procedureId = alea() < 0.55 ? 1 : alea() < 0.75 ? 2 : 3;
      const nbEtapes = procedureId === 1 ? 2 : 3;
      const sla = { 1: [1, 1], 2: [2, 5, 3], 3: [5, 20, 5] }[procedureId];
      const etapesValidees = Math.floor(alea() * (nbEtapes + 1));
      const durees = sla.map((s) => Math.max(0.2, +(s * (0.4 + alea() * 1.4)).toFixed(1)));
      // Temps passé sur l'étape en cours : 0 à 1,15 × son SLA (une minorité de dossiers en retard)
      const slaCourant = sla[Math.min(etapesValidees, nbEtapes - 1)];
      const age = durees.slice(0, etapesValidees).reduce((a, b) => a + b, 0) + alea() * 1.15 * slaCourant + 0.05;
      const r = alea();
      const fin = etapesValidees === nbEtapes ? (r < 0.6 ? 'retire' : null)
        : r < 0.08 ? 'piece' : r < 0.12 ? 'rejet' : null;
      await scenario(c, {
        telephone: `07${String(10000000 + i * 7919).slice(-8)}`,
        nom: `${PRENOMS[i % PRENOMS.length]} ${NOMS[(i * 3) % NOMS.length]}`,
        procedureId, canal: alea() < 0.5 ? 'guichet' : 'en_ligne', etapesValidees, fin, durees, ilYa: +age.toFixed(1),
      });
    }
    await c.query('ALTER TABLE evenements ENABLE TRIGGER evenements_no_update');
    console.log(`Dossiers démo d'Awa : ${n1} (en retard), ${n2} (prêt), ${n3} (pièce manquante)`);
  });
}

main()
  .then(() => console.log('Base SUIVO initialisée.'))
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => pool.end());
