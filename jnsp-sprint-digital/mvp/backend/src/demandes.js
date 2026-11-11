// Logique métier : cycle de vie d'une demande (machine à états + SLA + audit + notifications)
const { ajouterJoursOuvres, niveau, DAY } = require('./sla');
const { notifier } = require('./notify');

const ACTIFS = ['SOUMIS', 'EN_COURS', 'ATTENTE_USAGER'];
const RELANCE_DELAI_MS = 2 * DAY;

class ErreurMetier extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function etapesDe(client, procedureId) {
  const { rows } = await client.query(
    `SELECT e.ordre, e.nom, e.sla_jours, e.service_id, s.nom AS service, s.organisme
       FROM etapes e JOIN services s ON s.id = e.service_id
      WHERE e.procedure_id = $1 ORDER BY e.ordre`,
    [procedureId],
  );
  return rows;
}

async function charger(client, numero, { verrou = false } = {}) {
  const { rows } = await client.query(
    `SELECT d.*, p.nom AS procedure_nom, p.code AS procedure_code,
            u.telephone AS usager_telephone, u.nom AS usager_nom
       FROM demandes d
       JOIN procedures p ON p.id = d.procedure_id
       JOIN utilisateurs u ON u.id = d.usager_id
      WHERE d.numero = $1 ${verrou ? 'FOR UPDATE OF d' : ''}`,
    [numero],
  );
  if (!rows[0]) throw new ErreurMetier(404, 'Dossier introuvable');
  const d = rows[0];
  d.etapes = await etapesDe(client, d.procedure_id);
  d.etape = d.etapes.find((e) => e.ordre === d.etape_ordre);
  return d;
}

async function journal(client, d, type, acteurId, commentaire = null, dansLesDelais = null) {
  await client.query(
    `INSERT INTO evenements (demande_id, type, etape_ordre, acteur_id, commentaire, dans_les_delais)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [d.id, type, d.etape_ordre, acteurId, commentaire, dansLesDelais],
  );
}

async function creer(client, { usagerId, procedureId, canal = 'en_ligne', acteurId }) {
  const etapes = await etapesDe(client, procedureId);
  if (!etapes.length) throw new ErreurMetier(400, 'Procédure inconnue');
  const { rows: [{ n }] } = await client.query("SELECT nextval('demande_numero_seq') AS n");
  const numero = `SUI-${new Date().getFullYear()}-${String(n).padStart(6, '0')}`;
  const maintenant = new Date();
  const { rows: [d] } = await client.query(
    `INSERT INTO demandes (numero, usager_id, procedure_id, canal, etape_debut, etape_echeance)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [numero, usagerId, procedureId, canal, maintenant, ajouterJoursOuvres(maintenant, etapes[0].sla_jours)],
  );
  await journal(client, d, 'DEPOT', acteurId ?? usagerId, canal === 'guichet' ? 'Dépôt au guichet' : 'Dépôt en ligne');
  const { rows: [u] } = await client.query('SELECT telephone FROM utilisateurs WHERE id = $1', [usagerId]);
  const delai = etapes.reduce((s, e) => s + e.sla_jours, 0);
  await notifier(client, {
    demandeId: d.id,
    telephone: u.telephone,
    message: `SUIVO: dossier ${numero} enregistré. Délai prévu: ${delai} j ouvrés.`,
  });
  return numero;
}

function verifierAgent(d, user, { pourRetrait = false } = {}) {
  if (user.role === 'admin') return;
  const serviceAttendu = pourRetrait ? d.etapes[0].service_id : d.etape?.service_id;
  if (user.role !== 'agent' || user.service_id !== serviceAttendu) {
    throw new ErreurMetier(403, "Ce dossier n'est pas dans la file de votre service");
  }
}

async function valider(client, numero, user) {
  const d = await charger(client, numero, { verrou: true });
  if (!['SOUMIS', 'EN_COURS'].includes(d.statut)) throw new ErreurMetier(409, `Action impossible au statut ${d.statut}`);
  verifierAgent(d, user);
  const maintenant = new Date();
  await journal(client, d, 'ETAPE_VALIDEE', user.id, d.etape.nom, maintenant <= d.etape_echeance);
  const suivante = d.etapes.find((e) => e.ordre === d.etape_ordre + 1);
  if (suivante) {
    await client.query(
      `UPDATE demandes SET statut = 'EN_COURS', etape_ordre = $2, etape_debut = $3, etape_echeance = $4,
              mis_a_jour_le = $3 WHERE id = $1`,
      [d.id, suivante.ordre, maintenant, ajouterJoursOuvres(maintenant, suivante.sla_jours)],
    );
    await notifier(client, {
      demandeId: d.id,
      telephone: d.usager_telephone,
      message: `SUIVO ${d.numero}: étape ${suivante.ordre}/${d.etapes.length} « ${suivante.nom} » (${suivante.service}).`,
    });
  } else {
    await client.query(`UPDATE demandes SET statut = 'PRET', mis_a_jour_le = $2 WHERE id = $1`, [d.id, maintenant]);
    await journal(client, { ...d }, 'PRET', user.id, `Retrait : ${d.etapes[0].service}`);
    await notifier(client, {
      demandeId: d.id,
      telephone: d.usager_telephone,
      message: `SUIVO ${d.numero}: votre document est PRÊT. Retrait: ${d.etapes[0].service}, ${d.etapes[0].organisme}.`,
    });
  }
}

async function pieceManquante(client, numero, user, message) {
  if (!message || !message.trim()) throw new ErreurMetier(400, 'Précisez la pièce manquante');
  const d = await charger(client, numero, { verrou: true });
  if (!['SOUMIS', 'EN_COURS'].includes(d.statut)) throw new ErreurMetier(409, `Action impossible au statut ${d.statut}`);
  verifierAgent(d, user);
  // Le SLA est suspendu : on mémorise le temps restant
  const restant = Math.max(0, new Date(d.etape_echeance) - new Date());
  await client.query(
    `UPDATE demandes SET statut = 'ATTENTE_USAGER', sla_restant_ms = $2, message_attente = $3, mis_a_jour_le = now()
      WHERE id = $1`,
    [d.id, restant, message.trim()],
  );
  await journal(client, d, 'PIECE_MANQUANTE', user.id, message.trim());
  await notifier(client, {
    demandeId: d.id,
    telephone: d.usager_telephone,
    message: `SUIVO ${d.numero}: action requise - ${message.trim()}`,
  });
}

async function repondre(client, numero, user, commentaire) {
  const d = await charger(client, numero, { verrou: true });
  if (d.usager_id !== user.id) throw new ErreurMetier(403, "Ce dossier ne vous appartient pas");
  if (d.statut !== 'ATTENTE_USAGER') throw new ErreurMetier(409, "Aucune pièce n'est demandée sur ce dossier");
  if (!commentaire || !commentaire.trim()) throw new ErreurMetier(400, 'Votre réponse est vide');
  const maintenant = new Date();
  await client.query(
    `UPDATE demandes SET statut = 'EN_COURS', etape_echeance = $2, sla_restant_ms = NULL, message_attente = NULL,
            mis_a_jour_le = $3 WHERE id = $1`,
    [d.id, new Date(maintenant.getTime() + Number(d.sla_restant_ms || 0)), maintenant],
  );
  await journal(client, d, 'REPONSE_USAGER', user.id, commentaire.trim());
}

async function rejeter(client, numero, user, motif) {
  if (!motif || !motif.trim()) throw new ErreurMetier(400, 'Le motif de rejet est obligatoire');
  const d = await charger(client, numero, { verrou: true });
  if (!ACTIFS.includes(d.statut)) throw new ErreurMetier(409, `Action impossible au statut ${d.statut}`);
  verifierAgent(d, user);
  await client.query(`UPDATE demandes SET statut = 'REJETE', motif_rejet = $2, mis_a_jour_le = now() WHERE id = $1`,
    [d.id, motif.trim()]);
  await journal(client, d, 'REJET', user.id, motif.trim());
  await notifier(client, {
    demandeId: d.id,
    telephone: d.usager_telephone,
    message: `SUIVO ${d.numero}: dossier rejeté. Motif: ${motif.trim()}`,
  });
}

async function remettre(client, numero, user) {
  const d = await charger(client, numero, { verrou: true });
  if (d.statut !== 'PRET') throw new ErreurMetier(409, "Le document n'est pas prêt");
  verifierAgent(d, user, { pourRetrait: true });
  await client.query(`UPDATE demandes SET statut = 'RETIRE', mis_a_jour_le = now() WHERE id = $1`, [d.id]);
  await journal(client, d, 'RETIRE', user.id, 'Document remis à l\'usager');
}

async function relancer(client, numero, user) {
  const d = await charger(client, numero, { verrou: true });
  if (d.usager_id !== user.id) throw new ErreurMetier(403, "Ce dossier ne vous appartient pas");
  if (!['SOUMIS', 'EN_COURS'].includes(d.statut)) throw new ErreurMetier(409, 'Ce dossier ne peut pas être relancé');
  if (new Date(d.etape_echeance) > new Date()) {
    throw new ErreurMetier(409, 'Le délai prévu pour cette étape n\'est pas encore dépassé');
  }
  if (d.derniere_relance && Date.now() - new Date(d.derniere_relance) < RELANCE_DELAI_MS) {
    throw new ErreurMetier(429, 'Une relance a déjà été envoyée il y a moins de 48 h');
  }
  await client.query('UPDATE demandes SET derniere_relance = now() WHERE id = $1', [d.id]);
  await journal(client, d, 'RELANCE', user.id, `Relance usager — ${d.etape.service}`);
}

// Représentation renvoyée au client. `public` masque les données personnelles.
async function vue(client, d, { public: estPublic = false } = {}) {
  const { rows: evts } = await client.query(
    `SELECT ev.type, ev.etape_ordre, ev.commentaire, ev.cree_le, ev.dans_les_delais, u.nom AS acteur
       FROM evenements ev LEFT JOIN utilisateurs u ON u.id = ev.acteur_id
      WHERE ev.demande_id = $1 ORDER BY ev.cree_le, ev.id`,
    [d.id],
  );
  const actif = ['SOUMIS', 'EN_COURS'].includes(d.statut);
  const initiales = (d.usager_nom || '').split(/\s+/).filter(Boolean).map((m) => `${m[0]}.`).join(' ');
  return {
    numero: d.numero,
    procedure: { code: d.procedure_code, nom: d.procedure_nom },
    statut: d.statut,
    canal: d.canal,
    usager: estPublic ? initiales : d.usager_nom,
    cree_le: d.cree_le,
    etape_ordre: d.etape_ordre,
    etape_courante: d.etape
      ? {
          ...d.etape,
          debut: d.etape_debut,
          echeance: d.statut === 'ATTENTE_USAGER' ? null : d.etape_echeance,
          niveau: actif ? niveau(new Date(d.etape_debut), new Date(d.etape_echeance)) : null,
        }
      : null,
    message_attente: d.message_attente,
    motif_rejet: d.motif_rejet,
    peut_relancer: actif && new Date(d.etape_echeance) < new Date()
      && (!d.derniere_relance || Date.now() - new Date(d.derniere_relance) >= RELANCE_DELAI_MS),
    etapes: d.etapes.map((e) => ({
      ordre: e.ordre,
      nom: e.nom,
      service: e.service,
      organisme: e.organisme,
      sla_jours: e.sla_jours,
      etat: ['PRET', 'RETIRE'].includes(d.statut) || e.ordre < d.etape_ordre ? 'fait'
        : e.ordre === d.etape_ordre && d.statut !== 'REJETE' ? 'en_cours' : 'a_venir',
      validee_le: evts.find((v) => v.type === 'ETAPE_VALIDEE' && v.etape_ordre === e.ordre)?.cree_le || null,
    })),
    historique: evts.map((v) => ({ ...v, acteur: estPublic ? undefined : v.acteur })),
  };
}

module.exports = {
  ErreurMetier, ACTIFS, etapesDe, charger, creer, valider, pieceManquante, repondre, rejeter, remettre, relancer, vue,
};
