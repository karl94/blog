# 05 — User workflows

Critères du jury servis : pertinence, faisabilité. Les diagrammes Mermaid s'affichent directement sur GitHub.

## (a) Dépôt et suivi par l'usager

```mermaid
flowchart LR
  A([Usager]) --> B{A un smartphone ?}
  B -- Oui --> C[Ouvre la PWA / lien WhatsApp]
  B -- Non --> G[Se présente au guichet]
  C --> D[Connexion n° de téléphone + code SMS]
  D --> E[Choisit la procédure<br/>voit pièces + délai total]
  E --> F[Dépose la demande]
  G --> H[L'agent enregistre la demande<br/>et imprime le reçu QR]
  F --> I[Numéro SUI-2026-000123<br/>+ SMS de confirmation]
  H --> I
  I --> J[Timeline : étape, service, délai restant]
  J --> K{Notification reçue}
  K -- Étape suivante --> J
  K -- Pièce manquante --> L[Répond à distance]
  L --> J
  K -- Prêt --> M[Se déplace UNE seule fois<br/>pour retirer]
  M --> N([Dossier clôturé])
```

## (b) Traitement par l'agent

```mermaid
flowchart TB
  A([Agent connecté]) --> B[File de travail de son service<br/>triée : rouge → orange → vert]
  B --> C[Ouvre un dossier<br/>ou scanne le QR du dossier papier]
  C --> D{Décision}
  D -- Conforme --> E[« Valider l'étape »<br/>1 clic]
  E --> F{Dernière étape ?}
  F -- Non --> G[Transfert automatique<br/>au service suivant + nouveau SLA]
  F -- Oui --> H[Statut « Prêt à retirer »]
  D -- Incomplet --> I[« Pièce manquante » + message<br/>SLA suspendu]
  D -- Non recevable --> J[« Rejeter » + motif obligatoire]
  G --> K[Usager notifié]
  H --> K
  I --> K
  J --> K
```

## (c) Pièce manquante et reprise

```mermaid
sequenceDiagram
  participant U as Usager
  participant S as SUIVO
  participant A as Agent
  A->>S: Pièce manquante (« copie CNI du père »)
  S->>S: Statut ATTENTE_USAGER, SLA suspendu
  S-->>U: SMS / WhatsApp + lien
  U->>S: Envoie la pièce (photo) ou commentaire
  S->>S: Statut EN_COURS, SLA relancé
  S-->>A: Dossier remonte dans la file
  A->>S: Valide l'étape
  S-->>U: « Votre dossier passe à l'étape Signature »
```

## (d) Relance automatique et escalade sur dépassement de SLA

```mermaid
flowchart LR
  T[Tâche planifiée<br/>toutes les heures] --> C{Échéance de l'étape dépassée ?}
  C -- Non --> T
  C -- Oui --> A1[Alerte à l'agent<br/>dossier passe en rouge]
  A1 --> C2{SLA + 50 % dépassé ?}
  C2 -- Oui --> E[Escalade au chef de service]
  C2 -- Non --> T
  U[Usager] -- « Relancer » --> R{Retard ET pas de relance < 48 h ?}
  R -- Oui --> A1
  R -- Non --> M[Message : relance déjà en cours]
```

## (e) Parcours sans smartphone (USSD / SMS)

```mermaid
sequenceDiagram
  participant K as Konan (téléphone basique)
  participant O as Opérateur USSD
  participant S as SUIVO
  K->>O: Compose *XXX#
  O->>S: Session USSD
  S-->>K: 1. Suivre un dossier  2. Mes dossiers  3. Aide
  K->>S: 1 puis 000123
  S-->>K: SUI-2026-000123 : Étape 2/3 « Vérification » — Service État civil — prêt estimé le 14/11
  Note over K,S: Option : message vocal en baoulé / dioula
```

## (f) Machine à états d'une demande

```mermaid
stateDiagram-v2
  [*] --> SOUMIS: dépôt
  SOUMIS --> EN_COURS: prise en charge étape 1
  EN_COURS --> EN_COURS: étape validée → étape suivante
  EN_COURS --> ATTENTE_USAGER: pièce manquante
  ATTENTE_USAGER --> EN_COURS: réponse de l'usager
  EN_COURS --> PRET: dernière étape validée
  PRET --> RETIRE: document remis
  SOUMIS --> REJETE
  EN_COURS --> REJETE: motif obligatoire
  RETIRE --> [*]
  REJETE --> [*]
```

## Arborescence de l'application

```mermaid
flowchart TB
  R[SUIVO] --> P[Public]
  R --> U[Espace usager]
  R --> AG[Espace agent]
  R --> AD[Pilotage]
  P --> P1[Accueil + suivi par numéro]
  P --> P2[Catalogue des procédures]
  U --> U1[Connexion OTP]
  U --> U2[Mes dossiers]
  U --> U3[Nouvelle demande]
  U --> U4[Détail / timeline / répondre / relancer]
  AG --> A1[File de travail]
  AG --> A2[Détail dossier + actions]
  AG --> A3[Enregistrer un dépôt guichet]
  AD --> D1[Tableau de bord SLA]
  AD --> D2[Procédures & services]
```

## Risques & hypothèses critiques
1. **Parcours réel ≠ parcours modélisé** : les étapes et services des procédures ont été reconstitués et doivent être confirmés par chaque administration. *Validation* : suivre physiquement 5 dossiers de bout en bout (« shadowing »).
2. **Pièce manquante à distance** : certaines pièces doivent être présentées en original. Le parcours doit alors proposer un rendez-vous plutôt qu'un envoi en ligne.
3. **USSD** : la session est limitée à environ 180 secondes et 182 caractères par écran ; chaque écran doit tenir dans cette limite.

## Prochaine action en 48 h
Dérouler le parcours (a) avec 3 usagers sur papier (maquettes imprimées) et noter chaque hésitation.
