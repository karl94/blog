-- Données de démonstration (fictives). Les intitulés de services sont génériques :
-- à remplacer par les intitulés officiels des administrations pilotes.
INSERT INTO services (id, nom, organisme) VALUES
  (1,  'Guichet état civil',                 'Mairie de Yopougon'),
  (2,  'Cabinet du maire (signature)',       'Mairie de Yopougon'),
  (3,  'Guichet de la Fonction publique',    'Ministère de la Fonction Publique'),
  (4,  'Service de liquidation des droits',  'Ministère de la Fonction Publique'),
  (5,  'Service des paiements',              'Trésor public'),
  (6,  'Guichet urbanisme',                  'Mairie de Yopougon'),
  (7,  'Direction de l''urbanisme',          'Ministère de la Construction'),
  (8,  'Guichet unique du foncier',          'Administration foncière'),
  (9,  'Service du cadastre',                'Administration foncière'),
  (10, 'Conservation foncière',              'Administration foncière');
SELECT setval('services_id_seq', 10);

INSERT INTO procedures (id, code, nom, description, pieces, frais_fcfa) VALUES
  (1, 'ACTE_NAISSANCE', 'Extrait d''acte de naissance',
      'Copie intégrale ou extrait d''acte de naissance enregistré dans la commune.',
      ARRAY['Numéro et année de l''acte (ou date et lieu de naissance)', 'Pièce d''identité du demandeur'], 0),
  (2, 'CAPITAL_DECES', 'Capital décès (orphelins d''un fonctionnaire)',
      'Versement du capital décès aux orphelins d''un fonctionnaire décédé, par l''intermédiaire de leur représentant légal.',
      ARRAY['Acte de décès du fonctionnaire', 'Extraits d''acte de naissance des orphelins', 'Document de tutelle (si les orphelins sont mineurs)', 'Dernier bulletin de salaire du défunt', 'Pièce d''identité du représentant légal'], 0),
  (3, 'PERMIS_CONSTRUIRE', 'Permis de construire',
      'Autorisation de construire délivrée après instruction technique.',
      ARRAY['Document d''attribution du terrain', 'Plans de l''architecte', 'Pièce d''identité'], 0),
  (4, 'TITRE_FONCIER', 'Création de titre foncier',
      'Immatriculation d''un terrain et établissement de son titre foncier.',
      ARRAY['Document d''attribution du terrain (lettre d''attribution, ACD…)', 'Plan du terrain établi par un géomètre expert', 'Pièce d''identité', 'Justificatif de paiement des frais'], 0),
  (5, 'ETAT_FONCIER', 'Demande d''état foncier',
      'Document qui indique la situation juridique d''un terrain (propriétaire, charges, hypothèques).',
      ARRAY['Numéro du titre foncier ou références du lot', 'Pièce d''identité'], 0);
SELECT setval('procedures_id_seq', 5);

INSERT INTO etapes (procedure_id, ordre, nom, service_id, sla_jours) VALUES
  (1, 1, 'Recherche dans le registre',                   1, 1),
  (1, 2, 'Signature de l''officier d''état civil',       2, 1),
  (2, 1, 'Réception et contrôle des pièces',             3, 3),
  (2, 2, 'Liquidation des droits',                       4, 10),
  (2, 3, 'Mise en paiement',                             5, 5),
  (3, 1, 'Recevabilité',                                 6, 5),
  (3, 2, 'Instruction technique',                        7, 20),
  (3, 3, 'Signature',                                    7, 5),
  (4, 1, 'Réception et contrôle des pièces',             8, 3),
  (4, 2, 'Contrôle technique et cadastral',              9, 10),
  (4, 3, 'Immatriculation et établissement du titre',   10, 7),
  (5, 1, 'Réception de la demande',                      8, 1),
  (5, 2, 'Recherche et établissement de l''état foncier', 10, 3);

-- Comptes de démonstration (connexion par OTP ; en mode démo le code est renvoyé par l'API)
INSERT INTO utilisateurs (telephone, nom, role, service_id) VALUES
  ('0700000001', 'Awa Koné',                              'usager', NULL),
  ('0700000010', 'Mme Bamba (état civil)',                'agent',  1),
  ('0700000011', 'M. Yao (cabinet maire)',                'agent',  2),
  ('0700000020', 'Mme Traoré (guichet Fonction publique)', 'agent', 3),
  ('0700000021', 'M. Diallo (liquidation des droits)',    'agent',  4),
  ('0700000022', 'M. N''Guessan (service des paiements)', 'agent',  5),
  ('0700000030', 'M. Koffi (urbanisme)',                  'agent',  6),
  ('0700000031', 'Mme Aka (direction de l''urbanisme)',   'agent',  7),
  ('0700000040', 'Mme Kouassi (guichet foncier)',         'agent',  8),
  ('0700000041', 'M. Touré (cadastre)',                   'agent',  9),
  ('0700000042', 'Mme Yéo (conservation foncière)',       'agent',  10),
  ('0700000099', 'M. Kouadio (pilotage)',                 'admin',  NULL);
