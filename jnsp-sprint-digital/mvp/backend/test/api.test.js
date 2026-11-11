// Tests de bout en bout de l'API (base PostgreSQL dédiée : suivo_test)
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgres://suivo:suivo@localhost:5432/suivo_test';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/db');

const api = request(app);

async function connexion(telephone, nom = '') {
  const otp = await api.post('/api/auth/otp').send({ telephone }).expect(200);
  const r = await api.post('/api/auth/verifier').send({ telephone, code: otp.body.code_demo, nom }).expect(200);
  return { token: r.body.token, user: r.body.utilisateur, h: { Authorization: `Bearer ${r.body.token}` } };
}

before(async () => {
  for (const f of ['schema.sql', 'seed.sql']) {
    await pool.query(fs.readFileSync(path.join(__dirname, '..', 'db', f), 'utf8'));
  }
});
after(() => pool.end());

test('OTP : mauvais code refusé, bon code accepté', async () => {
  await api.post('/api/auth/otp').send({ telephone: 'abc' }).expect(400);
  await api.post('/api/auth/otp').send({ telephone: '0701020304' }).expect(200);
  const bad = await api.post('/api/auth/verifier').send({ telephone: '0701020304', code: '000000x' });
  assert.equal(bad.status, 401);
  const { user } = await connexion('0701020304', 'Test Usager');
  assert.equal(user.role, 'usager');
  assert.equal(user.nom, 'Test Usager');
});

test('catalogue : délai total = somme des SLA', async () => {
  const r = await api.get('/api/procedures').expect(200);
  const nat = r.body.find((p) => p.code === 'CERT_NATIONALITE');
  assert.equal(nat.etapes.length, 3);
  assert.equal(nat.delai_total_jours, 10);
});

test('parcours complet : dépôt → étapes → pièce manquante → réponse → prêt → retiré', async () => {
  const awa = await connexion('0700000001');
  const greffe = await connexion('0700000020');
  const nationalite = await connexion('0700000021');
  const juge = await connexion('0700000022');
  const etatCivil = await connexion('0700000010');

  const { body: { numero } } = await api.post('/api/demandes').set(awa.h).send({ procedure_id: 2 }).expect(201);
  assert.match(numero, /^SUI-\d{4}-\d{6}$/);

  // Suivi public : nom masqué, étape 1
  let pub = await api.get(`/api/suivi/${numero}`).expect(200);
  assert.equal(pub.body.statut, 'SOUMIS');
  assert.equal(pub.body.usager, 'A. K.');
  assert.equal(pub.body.etape_courante.service, 'Greffe — accueil');

  // Un usager ne peut pas agir comme agent ; un agent d'un autre service non plus
  await api.post(`/api/agent/demandes/${numero}/valider`).set(awa.h).expect(403);
  await api.post(`/api/agent/demandes/${numero}/valider`).set(nationalite.h).expect(403);

  // La file du greffe contient le dossier
  const file = await api.get('/api/agent/file').set(greffe.h).expect(200);
  assert.ok(file.body.some((d) => d.numero === numero && d.niveau === 'vert'));

  await api.post(`/api/agent/demandes/${numero}/valider`).set(greffe.h).expect(200);
  pub = await api.get(`/api/suivi/${numero}`).expect(200);
  assert.equal(pub.body.statut, 'EN_COURS');
  assert.equal(pub.body.etape_ordre, 2);

  // Pièce manquante : message obligatoire, SLA suspendu
  await api.post(`/api/agent/demandes/${numero}/piece-manquante`).set(nationalite.h).send({ message: '' }).expect(400);
  await api.post(`/api/agent/demandes/${numero}/piece-manquante`).set(nationalite.h)
    .send({ message: 'Copie CNI du père' }).expect(200);
  let mine = await api.get(`/api/demandes/${numero}`).set(awa.h).expect(200);
  assert.equal(mine.body.statut, 'ATTENTE_USAGER');
  assert.equal(mine.body.message_attente, 'Copie CNI du père');
  assert.equal(mine.body.etape_courante.echeance, null);
  // Pendant l'attente, l'agent ne peut pas valider
  await api.post(`/api/agent/demandes/${numero}/valider`).set(nationalite.h).expect(409);

  // Un autre usager ne peut pas répondre à la place d'Awa
  const autre = await connexion('0709999999');
  await api.post(`/api/demandes/${numero}/repondre`).set(autre.h).send({ commentaire: 'x' }).expect(403);
  await api.get(`/api/demandes/${numero}`).set(autre.h).expect(403);
  await api.post(`/api/demandes/${numero}/repondre`).set(awa.h).send({ commentaire: 'CNI déposée au greffe' }).expect(200);

  await api.post(`/api/agent/demandes/${numero}/valider`).set(nationalite.h).expect(200);
  await api.post(`/api/agent/demandes/${numero}/valider`).set(juge.h).expect(200);
  mine = await api.get(`/api/demandes/${numero}`).set(awa.h).expect(200);
  assert.equal(mine.body.statut, 'PRET');
  assert.ok(mine.body.etapes.every((e) => e.etat === 'fait'));

  // Retrait au guichet de dépôt (greffe), pas par l'état civil
  await api.post(`/api/agent/demandes/${numero}/remettre`).set(etatCivil.h).expect(403);
  await api.post(`/api/agent/demandes/${numero}/remettre`).set(greffe.h).expect(200);
  mine = await api.get(`/api/demandes/${numero}`).set(awa.h).expect(200);
  assert.equal(mine.body.statut, 'RETIRE');

  const types = mine.body.historique.map((e) => e.type);
  assert.deepEqual(types, ['DEPOT', 'ETAPE_VALIDEE', 'PIECE_MANQUANTE', 'REPONSE_USAGER', 'ETAPE_VALIDEE',
    'ETAPE_VALIDEE', 'PRET', 'RETIRE']);

  // Notifications envoyées : dépôt, étape 2, pièce, étape 3, prêt
  const { rows } = await pool.query(
    'SELECT count(*)::int AS n FROM notifications n JOIN demandes d ON d.id = n.demande_id WHERE d.numero = $1', [numero]);
  assert.equal(rows[0].n, 5);
});

test('relance : refusée avant échéance, acceptée après, puis limitée à 1 / 48 h', async () => {
  const u = await connexion('0702030405', 'Konan Yao');
  const { body: { numero } } = await api.post('/api/demandes').set(u.h).send({ procedure_id: 1 }).expect(201);
  await api.post(`/api/demandes/${numero}/relancer`).set(u.h).expect(409);
  await pool.query("UPDATE demandes SET etape_echeance = now() - interval '1 day' WHERE numero = $1", [numero]);
  const v = await api.get(`/api/demandes/${numero}`).set(u.h).expect(200);
  assert.equal(v.body.peut_relancer, true);
  assert.equal(v.body.etape_courante.niveau, 'rouge');
  await api.post(`/api/demandes/${numero}/relancer`).set(u.h).expect(200);
  await api.post(`/api/demandes/${numero}/relancer`).set(u.h).expect(429);
});

test('rejet : motif obligatoire', async () => {
  const u = await connexion('0703040506');
  const agent = await connexion('0700000010');
  const { body: { numero } } = await api.post('/api/demandes').set(u.h).send({ procedure_id: 1 }).expect(201);
  await api.post(`/api/agent/demandes/${numero}/rejeter`).set(agent.h).send({}).expect(400);
  await api.post(`/api/agent/demandes/${numero}/rejeter`).set(agent.h).send({ motif: 'Acte introuvable' }).expect(200);
  const pub = await api.get(`/api/suivi/${numero}`).expect(200);
  assert.equal(pub.body.statut, 'REJETE');
  assert.equal(pub.body.motif_rejet, 'Acte introuvable');
});

test('guichet : dépôt pour un usager sans compte + journal immuable + statistiques', async () => {
  const agent = await connexion('0700000010');
  const r = await api.post('/api/agent/guichet').set(agent.h)
    .send({ telephone: '0505050505', nom: 'Konan Kouassi', procedure_id: 1 }).expect(201);
  const pub = await api.get(`/api/suivi/${r.body.numero}`).expect(200);
  assert.equal(pub.body.canal, 'guichet');
  assert.equal(pub.body.usager, 'K. K.');

  await assert.rejects(pool.query("UPDATE evenements SET commentaire = 'falsifié'"), /immuable/);

  const admin = await connexion('0700000099');
  const s = await api.get('/api/stats').set(admin.h).expect(200);
  assert.ok(s.body.total >= 4);
  assert.ok(Array.isArray(s.body.services));
  assert.ok(s.body.deplacements_evites > 0);
  const usager = await connexion('0701020304');
  await api.get('/api/stats').set(usager.h).expect(403);
});

test('dossier inconnu → 404', async () => {
  await api.get('/api/suivi/SUI-2026-999999').expect(404);
});
