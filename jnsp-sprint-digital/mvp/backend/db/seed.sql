-- Données de démonstration (fictives)
INSERT INTO services (id, nom, organisme) VALUES
  (1, 'Guichet état civil',         'Mairie de Yopougon'),
  (2, 'Cabinet du maire (signature)','Mairie de Yopougon'),
  (3, 'Greffe — accueil',           'Tribunal de première instance'),
  (4, 'Service de la nationalité',   'Tribunal de première instance'),
  (5, 'Cabinet du président',        'Tribunal de première instance'),
  (6, 'Guichet urbanisme',           'Mairie de Yopougon'),
  (7, 'Direction de l''urbanisme',   'Ministère de la Construction');
SELECT setval('services_id_seq', 7);

INSERT INTO procedures (id, code, nom, description, pieces, frais_fcfa) VALUES
  (1, 'ACTE_NAISSANCE', 'Extrait d''acte de naissance',
      'Copie intégrale ou extrait d''acte de naissance enregistré dans la commune.',
      ARRAY['Numéro et année de l''acte (ou date et lieu de naissance)', 'Pièce d''identité du demandeur'], 500),
  (2, 'CERT_NATIONALITE', 'Certificat de nationalité',
      'Certificat délivré par le tribunal attestant la nationalité ivoirienne.',
      ARRAY['Extrait d''acte de naissance', 'Pièce d''identité d''un parent ivoirien', 'Extrait d''acte de naissance du parent', 'Timbre fiscal'], 1500),
  (3, 'PERMIS_CONSTRUIRE', 'Permis de construire',
      'Autorisation de construire délivrée après instruction technique.',
      ARRAY['Titre foncier ou ACD', 'Plans de l''architecte', 'Pièce d''identité', 'Quittance des frais'], 0);
SELECT setval('procedures_id_seq', 3);

INSERT INTO etapes (procedure_id, ordre, nom, service_id, sla_jours) VALUES
  (1, 1, 'Recherche dans le registre',        1, 1),
  (1, 2, 'Signature de l''officier d''état civil', 2, 1),
  (2, 1, 'Réception et contrôle des pièces',  3, 2),
  (2, 2, 'Instruction du dossier',            4, 5),
  (2, 3, 'Signature du président',            5, 3),
  (3, 1, 'Recevabilité',                      6, 5),
  (3, 2, 'Instruction technique',             7, 20),
  (3, 3, 'Signature',                         7, 5);

-- Comptes de démonstration (connexion par OTP ; en mode démo le code est renvoyé par l'API)
INSERT INTO utilisateurs (telephone, nom, role, service_id) VALUES
  ('0700000001', 'Awa Koné',                'usager', NULL),
  ('0700000010', 'Mme Bamba (état civil)',  'agent',  1),
  ('0700000011', 'M. Yao (cabinet maire)',  'agent',  2),
  ('0700000020', 'Mme Traoré (greffe)',     'agent',  3),
  ('0700000021', 'M. Diallo (nationalité)', 'agent',  4),
  ('0700000022', 'Juge N''Guessan',         'agent',  5),
  ('0700000030', 'M. Koffi (urbanisme)',    'agent',  6),
  ('0700000031', 'Mme Aka (DGU)',           'agent',  7),
  ('0700000099', 'M. Kouadio (pilotage)',   'admin',  NULL);
