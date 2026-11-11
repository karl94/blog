const express = require('express');
const cors = require('cors');
const { query, tx } = require('./db');
const auth = require('./auth');
const D = require('./demandes');
const { niveau } = require('./sla');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/sante', (req, res) => res.json({ ok: true, service: 'suivo-api' }));

// ---------------------------------------------------------------- Authentification OTP
app.post('/api/auth/otp', wrap(async (req, res) => {
  const telephone = auth.normaliserTel(req.body.telephone);
  if (!auth.telValide(telephone)) return res.status(400).json({ erreur: 'Numéro de téléphone invalide' });
  const code = await auth.demanderOtp(telephone);
  // En mode démo, le code est renvoyé pour permettre de tester sans passerelle SMS.
  return res.json({ envoye: true, ...(auth.DEMO ? { code_demo: code } : {}) });
}));

app.post('/api/auth/verifier', wrap(async (req, res) => {
  const telephone = auth.normaliserTel(req.body.telephone);
  const r = await auth.verifierOtp(telephone, req.body.code);
  if (!r.ok) return res.status(401).json({ erreur: r.erreur });
  const { rows } = await query(
    `INSERT INTO utilisateurs (telephone, nom) VALUES ($1, $2)
     ON CONFLICT (telephone) DO UPDATE SET nom = CASE WHEN utilisateurs.nom = '' THEN EXCLUDED.nom ELSE utilisateurs.nom END
     RETURNING id, telephone, nom, role, service_id`,
    [telephone, (req.body.nom || '').trim()],
  );
  const user = rows[0];
  return res.json({ token: auth.signer(user), utilisateur: user });
}));

app.get('/api/moi', auth.authentifie, wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.telephone, u.nom, u.role, u.service_id, s.nom AS service
       FROM utilisateurs u LEFT JOIN services s ON s.id = u.service_id WHERE u.id = $1`, [req.user.id]);
  res.json(rows[0]);
}));

// ---------------------------------------------------------------- Catalogue
app.get('/api/procedures', wrap(async (req, res) => {
  const { rows: procs } = await query('SELECT * FROM procedures ORDER BY id');
  const result = await Promise.all(procs.map(async (p) => {
    const etapes = await D.etapesDe({ query }, p.id);
    return { ...p, etapes, delai_total_jours: etapes.reduce((s, e) => s + e.sla_jours, 0) };
  }));
  res.json(result);
}));

// ---------------------------------------------------------------- Suivi public (sans compte)
app.get('/api/suivi/:numero', wrap(async (req, res) => {
  const numero = req.params.numero.trim().toUpperCase();
  const d = await D.charger({ query }, numero);
  res.json(await D.vue({ query }, d, { public: true }));
}));

// ---------------------------------------------------------------- Espace usager
app.get('/api/demandes', auth.authentifie, wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT d.numero FROM demandes d WHERE d.usager_id = $1 ORDER BY d.cree_le DESC`, [req.user.id]);
  const vues = await Promise.all(rows.map(async (r) => D.vue({ query }, await D.charger({ query }, r.numero))));
  res.json(vues);
}));

app.post('/api/demandes', auth.authentifie, wrap(async (req, res) => {
  const numero = await tx((c) => D.creer(c, { usagerId: req.user.id, procedureId: Number(req.body.procedure_id) }));
  res.status(201).json({ numero });
}));

app.get('/api/demandes/:numero', auth.authentifie, wrap(async (req, res) => {
  const d = await D.charger({ query }, req.params.numero);
  const proprietaire = d.usager_id === req.user.id;
  if (!proprietaire && req.user.role === 'usager') return res.status(403).json({ erreur: 'Accès refusé' });
  const v = await D.vue({ query }, d);
  if (!proprietaire) v.usager_telephone = d.usager_telephone;
  res.json(v);
}));

app.post('/api/demandes/:numero/repondre', auth.authentifie, wrap(async (req, res) => {
  await tx((c) => D.repondre(c, req.params.numero, req.user, req.body.commentaire));
  res.json({ ok: true });
}));

app.post('/api/demandes/:numero/relancer', auth.authentifie, wrap(async (req, res) => {
  await tx((c) => D.relancer(c, req.params.numero, req.user));
  res.json({ ok: true, message: 'Le service responsable a été alerté.' });
}));

// ---------------------------------------------------------------- Espace agent
const agent = [auth.authentifie, auth.exigeRole('agent', 'admin')];

app.get('/api/agent/file', ...agent, wrap(async (req, res) => {
  const tous = req.user.role === 'admin';
  const { rows } = await query(
    `SELECT d.numero, d.statut, d.etape_ordre, d.etape_debut, d.etape_echeance, d.canal, d.cree_le,
            d.message_attente, d.derniere_relance,
            p.nom AS procedure, u.nom AS usager, e.nom AS etape, s.nom AS service,
            (SELECT count(*) FROM etapes x WHERE x.procedure_id = d.procedure_id) AS nb_etapes
       FROM demandes d
       JOIN procedures p ON p.id = d.procedure_id
       JOIN utilisateurs u ON u.id = d.usager_id
       JOIN etapes e ON e.procedure_id = d.procedure_id AND e.ordre = d.etape_ordre
       JOIN services s ON s.id = e.service_id
       JOIN etapes e1 ON e1.procedure_id = d.procedure_id AND e1.ordre = 1
      WHERE ($1 OR (d.statut IN ('SOUMIS','EN_COURS','ATTENTE_USAGER') AND e.service_id = $2)
                 OR (d.statut = 'PRET' AND e1.service_id = $2))
        AND d.statut NOT IN ('RETIRE','REJETE')
      ORDER BY (d.statut = 'ATTENTE_USAGER'), (d.statut = 'PRET'), d.etape_echeance`,
    [tous, req.user.service_id],
  );
  res.json(rows.map((r) => ({
    ...r,
    nb_etapes: Number(r.nb_etapes),
    niveau: ['SOUMIS', 'EN_COURS'].includes(r.statut) ? niveau(new Date(r.etape_debut), new Date(r.etape_echeance)) : null,
  })));
}));

const actionAgent = (fn) => wrap(async (req, res) => {
  await tx((c) => fn(c, req.params.numero, req.user, req.body));
  res.json({ ok: true });
});
app.post('/api/agent/demandes/:numero/valider', ...agent, actionAgent((c, n, u) => D.valider(c, n, u)));
app.post('/api/agent/demandes/:numero/piece-manquante', ...agent,
  actionAgent((c, n, u, b) => D.pieceManquante(c, n, u, b.message)));
app.post('/api/agent/demandes/:numero/rejeter', ...agent, actionAgent((c, n, u, b) => D.rejeter(c, n, u, b.motif)));
app.post('/api/agent/demandes/:numero/remettre', ...agent, actionAgent((c, n, u) => D.remettre(c, n, u)));

// Dépôt au guichet pour un usager (éventuellement sans smartphone)
app.post('/api/agent/guichet', ...agent, wrap(async (req, res) => {
  const telephone = auth.normaliserTel(req.body.telephone);
  if (!auth.telValide(telephone)) return res.status(400).json({ erreur: 'Numéro de téléphone invalide' });
  const numero = await tx(async (c) => {
    const { rows: [u] } = await c.query(
      `INSERT INTO utilisateurs (telephone, nom) VALUES ($1, $2)
       ON CONFLICT (telephone) DO UPDATE SET nom = CASE WHEN utilisateurs.nom = '' THEN EXCLUDED.nom ELSE utilisateurs.nom END
       RETURNING id`,
      [telephone, (req.body.nom || '').trim()],
    );
    return D.creer(c, { usagerId: u.id, procedureId: Number(req.body.procedure_id), canal: 'guichet', acteurId: req.user.id });
  });
  res.status(201).json({ numero });
}));

// ---------------------------------------------------------------- Pilotage
app.get('/api/stats', ...agent, wrap(async (req, res) => {
  const [statuts, services, delais, conformite, notifs, procs] = await Promise.all([
    query(`SELECT statut, count(*)::int AS n FROM demandes GROUP BY statut`),
    query(`SELECT s.id, s.nom, s.organisme,
                  count(d.id) FILTER (WHERE d.statut IN ('SOUMIS','EN_COURS'))::int AS en_cours,
                  count(d.id) FILTER (WHERE d.statut IN ('SOUMIS','EN_COURS') AND d.etape_echeance < now())::int AS en_retard,
                  count(d.id) FILTER (WHERE d.statut = 'ATTENTE_USAGER')::int AS attente_usager
             FROM services s
             LEFT JOIN etapes e ON e.service_id = s.id
             LEFT JOIN demandes d ON d.procedure_id = e.procedure_id AND d.etape_ordre = e.ordre
            GROUP BY s.id ORDER BY en_retard DESC, en_cours DESC`),
    // Durée réelle de chaque étape = temps entre le jalon précédent et la validation
    query(`WITH j AS (
             SELECT ev.demande_id, ev.etape_ordre, ev.type, ev.cree_le,
                    lag(ev.cree_le) OVER (PARTITION BY ev.demande_id ORDER BY ev.cree_le, ev.id) AS precedent
               FROM evenements ev WHERE ev.type IN ('DEPOT','ETAPE_VALIDEE'))
           SELECT p.nom AS procedure, e.ordre, e.nom AS etape, e.sla_jours,
                  round((percentile_cont(0.5) WITHIN GROUP (ORDER BY extract(epoch FROM j.cree_le - j.precedent)) / 86400)::numeric, 1) AS mediane_jours,
                  count(*)::int AS n
             FROM j JOIN demandes d ON d.id = j.demande_id
             JOIN procedures p ON p.id = d.procedure_id
             JOIN etapes e ON e.procedure_id = d.procedure_id AND e.ordre = j.etape_ordre
            WHERE j.type = 'ETAPE_VALIDEE'
            GROUP BY p.nom, p.id, e.ordre, e.nom, e.sla_jours ORDER BY p.id, e.ordre`),
    query(`SELECT count(*) FILTER (WHERE dans_les_delais)::int AS ok, count(*)::int AS total
             FROM evenements WHERE type = 'ETAPE_VALIDEE'`),
    query(`SELECT count(*)::int AS n FROM notifications`),
    query(`SELECT p.nom, count(d.id)::int AS n FROM procedures p LEFT JOIN demandes d ON d.procedure_id = p.id
            GROUP BY p.id ORDER BY p.id`),
  ]);
  const parStatut = Object.fromEntries(statuts.rows.map((r) => [r.statut, r.n]));
  const c = conformite.rows[0];
  res.json({
    total: statuts.rows.reduce((s, r) => s + r.n, 0),
    par_statut: parStatut,
    en_retard: services.rows.reduce((s, r) => s + r.en_retard, 0),
    taux_respect_sla: c.total ? Math.round((100 * c.ok) / c.total) : null,
    // North Star (estimation) : chaque notification d'avancement remplace un passage « pour information »
    deplacements_evites: notifs.rows[0].n,
    services: services.rows,
    delais_par_etape: delais.rows.map((r) => ({ ...r, mediane_jours: Number(r.mediane_jours) })),
    par_procedure: procs.rows,
  });
}));

// ---------------------------------------------------------------- Erreurs
app.use((req, res) => res.status(404).json({ erreur: 'Route inconnue' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof D.ErreurMetier) return res.status(err.status).json({ erreur: err.message });
  console.error(err);
  return res.status(500).json({ erreur: 'Erreur interne' });
});

module.exports = app;
