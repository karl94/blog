-- SUIVO — schéma PostgreSQL du MVP
DROP TABLE IF EXISTS notifications, evenements, demandes, otp, utilisateurs, etapes, procedures, services CASCADE;
DROP SEQUENCE IF EXISTS demande_numero_seq;
DROP TYPE IF EXISTS statut_demande, role_utilisateur CASCADE;

CREATE TYPE role_utilisateur AS ENUM ('usager', 'agent', 'admin');
CREATE TYPE statut_demande AS ENUM ('SOUMIS', 'EN_COURS', 'ATTENTE_USAGER', 'PRET', 'RETIRE', 'REJETE');

-- Service administratif qui porte une étape (guichet, greffe, cabinet du maire…)
CREATE TABLE services (
  id          SERIAL PRIMARY KEY,
  nom         TEXT NOT NULL,
  organisme   TEXT NOT NULL
);

-- Type de démarche (acte de naissance, certificat de nationalité…)
CREATE TABLE procedures (
  id          SERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  nom         TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  pieces      TEXT[] NOT NULL DEFAULT '{}',
  frais_fcfa  INTEGER NOT NULL DEFAULT 0
);

-- Étapes ordonnées d'une procédure, chacune avec son service responsable et son SLA
CREATE TABLE etapes (
  id           SERIAL PRIMARY KEY,
  procedure_id INTEGER NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  ordre        INTEGER NOT NULL,
  nom          TEXT NOT NULL,
  service_id   INTEGER NOT NULL REFERENCES services(id),
  sla_jours    INTEGER NOT NULL CHECK (sla_jours > 0),
  UNIQUE (procedure_id, ordre)
);

CREATE TABLE utilisateurs (
  id          SERIAL PRIMARY KEY,
  telephone   TEXT UNIQUE NOT NULL,
  nom         TEXT NOT NULL DEFAULT '',
  role        role_utilisateur NOT NULL DEFAULT 'usager',
  service_id  INTEGER REFERENCES services(id),
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE otp (
  telephone   TEXT PRIMARY KEY,
  code_hash   TEXT NOT NULL,
  expire_le   TIMESTAMPTZ NOT NULL,
  tentatives  INTEGER NOT NULL DEFAULT 0
);

CREATE SEQUENCE demande_numero_seq;

CREATE TABLE demandes (
  id               SERIAL PRIMARY KEY,
  numero           TEXT UNIQUE NOT NULL,
  usager_id        INTEGER NOT NULL REFERENCES utilisateurs(id),
  procedure_id     INTEGER NOT NULL REFERENCES procedures(id),
  etape_ordre      INTEGER NOT NULL DEFAULT 1,
  statut           statut_demande NOT NULL DEFAULT 'SOUMIS',
  canal            TEXT NOT NULL DEFAULT 'en_ligne',     -- en_ligne | guichet | ussd
  etape_debut      TIMESTAMPTZ NOT NULL DEFAULT now(),
  etape_echeance   TIMESTAMPTZ NOT NULL,                 -- échéance SLA de l'étape en cours
  sla_restant_ms   BIGINT,                               -- conservé pendant la suspension (ATTENTE_USAGER)
  message_attente  TEXT,
  motif_rejet      TEXT,
  derniere_relance TIMESTAMPTZ,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  mis_a_jour_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX demandes_usager_idx ON demandes (usager_id);
CREATE INDEX demandes_file_idx ON demandes (procedure_id, etape_ordre, statut);

-- Journal d'audit immuable : chaque action sur un dossier
CREATE TABLE evenements (
  id           SERIAL PRIMARY KEY,
  demande_id   INTEGER NOT NULL REFERENCES demandes(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,   -- DEPOT | ETAPE_VALIDEE | PIECE_MANQUANTE | REPONSE_USAGER | RELANCE | PRET | RETIRE | REJET
  etape_ordre  INTEGER,
  acteur_id    INTEGER REFERENCES utilisateurs(id),
  commentaire  TEXT,
  dans_les_delais BOOLEAN,      -- pour les validations d'étape : SLA respecté ?
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX evenements_demande_idx ON evenements (demande_id, cree_le);

CREATE OR REPLACE FUNCTION evenements_immuables() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Le journal des événements est immuable';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER evenements_no_update BEFORE UPDATE ON evenements
  FOR EACH ROW EXECUTE FUNCTION evenements_immuables();

-- Journal des messages envoyés (SMS / WhatsApp / push)
CREATE TABLE notifications (
  id          SERIAL PRIMARY KEY,
  demande_id  INTEGER REFERENCES demandes(id) ON DELETE CASCADE,
  telephone   TEXT NOT NULL,
  canal       TEXT NOT NULL,
  message     TEXT NOT NULL,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);
