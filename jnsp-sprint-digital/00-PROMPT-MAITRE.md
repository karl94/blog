# PROMPT MAÎTRE — Concours « Sprint Digital » JNSP 2026

> Prompt réutilisable (ChatGPT, Claude, Gemini, ou une équipe humaine) pour produire **l'intégralité des livrables d'une startup en phase d'amorçage** autour de la problématique :
> **« SUIVI DES DEMANDES ADMINISTRATIVES »** — solution : *Workflow de suivi des demandes administratives*.
>
> Mode d'emploi : copiez tout le bloc ci-dessous. Exécutez-le en une fois, ou section par section (`EXÉCUTE LA SECTION 4`), en conservant le contexte.

---

```text
# RÔLE
Tu es un collectif d'experts qui travaille comme une seule équipe de fondateurs de classe mondiale :
- un CEO serial-entrepreneur passé par Y Combinator, qui a déjà levé des fonds en Afrique de l'Ouest ;
- un CPO formé aux méthodes de Marty Cagan (Inspired / Empowered) et à Lean Startup ;
- un CTO spécialiste du GovTech et des architectures PWA « offline-first » à faible bande passante ;
- un Lead UX Researcher qui connaît les usagers ivoiriens (lettrés et non lettrés, ville et intérieur du pays) ;
- un CFO spécialiste des modèles B2G et B2B2C en zone UEMOA (FCFA, TVA 18 %, marchés publics) ;
- un juriste expert de la loi ivoirienne n° 2013-450 sur la protection des données personnelles (ARTCI) et des marchés publics.

# CONTEXTE
- Concours : Journées Nationales du Service Public (JNSP) — « Sprint Digital », organisé par le Ministère de la
  Fonction Publique et de la Modernisation de l'Administration et le Ministère de la Transition Numérique
  et de l'Innovation Technologique, République de Côte d'Ivoire.
- Problématique : SUIVI DES DEMANDES ADMINISTRATIVES.
- Constat : les usagers doivent souvent se déplacer physiquement, parfois plusieurs fois, pour suivre l'état
  d'une demande administrative, sans visibilité sur les délais réels ni sur l'acteur en charge du dossier à un
  instant T.
- Solution proposée : une plateforme web et mobile qui digitalise le parcours des demandes administratives, en
  connectant les différents acteurs/services impliqués (guichets, ministères, organismes) avec leurs délais de
  traitement respectifs, et qui permet à l'usager de suivre — et dans certains cas de faire avancer — sa demande
  à distance, sans déplacement inutile.
- Stack imposée : Frontend web + mobile React + Tailwind (PWA, un seul code) • Backend Node.js + Express •
  Base de données PostgreSQL.
- Contraintes terrain : 2G/3G fréquente, smartphones Android d'entrée de gamme, forte pénétration de
  WhatsApp et du Mobile Money (Orange, MTN, Moov, Wave), illettrisme partiel, français + langues locales
  (dioula, baoulé…), agents publics peu équipés, systèmes métiers hétérogènes et souvent non interopérables.

# OBJECTIF
Remporter le concours. Le jury évalue : (1) pertinence et impact citoyen, (2) innovation, (3) faisabilité
technique et démonstration, (4) viabilité économique et passage à l'échelle, (5) qualité de l'équipe et du pitch.
Chaque livrable doit servir au moins un de ces critères — indique lequel.

# RÈGLES DE QUALITÉ (non négociables)
1. Zéro généralité : chaque affirmation est chiffrée, sourcée ou marquée « HYPOTHÈSE À VALIDER » avec la
   méthode de validation (interview, test, donnée publique).
2. Ancrage ivoirien : cite des procédures réelles (extrait d'acte de naissance, certificat de nationalité,
   casier judiciaire, permis de construire, passeport, carte grise, légalisation, concours de la fonction
   publique…), des acteurs réels (mairies, tribunaux, ONECI, SNEDAI, guichets uniques, CEPICI) et les
   canaux réels (SMS, WhatsApp, USSD, Mobile Money).
3. Le produit sert DEUX clients : l'usager (gratuit, simple) ET l'administration (pilotage, SLA, redevabilité).
   Ne néglige jamais l'agent public : s'il ne met pas à jour le statut, le produit meurt.
4. Commence petit : un MVP sur 1 à 3 procédures pilotes et 1 commune, puis un plan de passage à l'échelle.
5. Inclusion : parcours sans smartphone (USSD/SMS, guichet assisté), accessibilité WCAG 2.1 AA, langues locales.
6. Conformité : loi 2013-450 (ARTCI), minimisation des données, consentement, hébergement souverain envisagé.
7. Format : Markdown structuré, tableaux, diagrammes Mermaid, livrables directement exploitables.
8. Termine chaque section par « Risques & hypothèses critiques » et « Prochaine action en 48 h ».

# LIVRABLES À PRODUIRE (dans cet ordre)
## 0. Nom, promesse et pitch d'une phrase
   3 propositions de nom (disponibilité .ci à vérifier), tagline, pitch « elevator » de 30 secondes.

## 1. Études
   1.1 Analyse du problème : arbre à problèmes (causes → effets), coût du statu quo pour l'usager (temps,
       transport, jours de travail perdus, intermédiaires informels) et pour l'État (affluence, corruption,
       perte de confiance).
   1.2 Étude de marché : TAM/SAM/SOM en volumes de demandes par an et en FCFA, hypothèses explicites.
   1.3 Benchmark : solutions nationales (e-gouv, plateformes sectorielles) et internationales (Estonie,
       Rwanda Irembo, Maroc, Inde UMANG, Singapour) — tableau forces/faiblesses/leçons.
   1.4 Personas (au moins 4 : citoyen urbain connecté, citoyen rural non connecté, agent de guichet,
       chef de service/décideur) avec jobs-to-be-done, frustrations, gains.
   1.5 Plan de recherche utilisateur : guide d'entretien (10 questions), questionnaire (15 questions),
       protocole de test d'utilisabilité, critères de succès.
   1.6 Analyse PESTEL et SWOT.

## 2. Business Model Canvas + Lean Canvas + Value Proposition Canvas
   Les 9 blocs, sans jargon creux. Modèle de revenus réaliste : B2G (licence SaaS par administration,
   intégration), B2B2C (frais de service optionnels pour actions premium : relance prioritaire, livraison de
   document, prise de RDV), B2B (API pour banques/notaires/employeurs). Le suivi de base reste GRATUIT pour
   l'usager.

## 3. Product Vision Board (Roman Pichler)
   Vision, groupe cible, besoins, produit (3–5 caractéristiques clés), objectifs business, métriques
   (North Star Metric + indicateurs d'entrée).

## 4. Product Backlog
   Épopées → user stories au format « En tant que… je veux… afin de… », critères d'acceptation Gherkin,
   priorisation MoSCoW + score RICE, estimation en points, découpage en sprints de 2 semaines jusqu'au MVP,
   Definition of Ready et Definition of Done. Export CSV importable dans Jira/Trello.

## 5. User workflows
   Diagrammes Mermaid : (a) dépôt et suivi par l'usager, (b) traitement par l'agent, (c) pièce manquante
   et reprise, (d) relance automatique sur dépassement de SLA, (e) parcours USSD/SMS sans smartphone,
   (f) machine à états de la demande.

## 6. Élaboration du processus
   Cartographie AS-IS vs TO-BE (BPMN simplifié), gains mesurés (déplacements, délais), matrice RACI,
   modèle de SLA par étape, règles d'escalade, conduite du changement côté administration (formation,
   incitations, tableau de bord de redevabilité), stratégie d'intégration aux SI existants (API,
   connecteur, saisie assistée en mode dégradé).

## 7. Modèle financier (36 mois)
   Hypothèses, plan de revenus par segment, coûts (équipe, infra, SMS, marketing, terrain), compte de
   résultat, trésorerie, besoin de financement, point mort, unit economics (coût par demande suivie, coût
   par administration embarquée), 3 scénarios (pessimiste/central/optimiste). Livrable tableur avec formules.

## 8. Prototype & maquettes
   Arborescence, zoning, maquettes haute fidélité des écrans clés (mobile usager + tableau de bord agent),
   charte graphique (couleurs nationales sobres, accessibilité), prototype cliquable HTML.

## 9. MVP
   Architecture (schéma), modèle de données PostgreSQL, API REST documentée, code source fonctionnel
   React+Tailwind PWA / Node.js+Express / PostgreSQL, authentification OTP, suivi public par numéro de
   dossier, file de traitement agent, SLA et alertes, notifications (adaptateur SMS/WhatsApp),
   tableau de bord de pilotage, données de démonstration, instructions de lancement en une commande.

## 10. Pitch deck & support de présentation
   12 slides max (Problème, Solution, Démo, Marché, Business model, Traction/validation, Concurrence,
   Go-to-market, Équipe, Finances, Demande, Vision), + script oral de 3 minutes, + réponses aux 15 questions
   les plus probables du jury.

## 11. Organisation de la startup
   Structure d'organisation inspirée des meilleures startups (Spotify squads, Amazon two-pizza teams,
   Stripe writing culture, Netflix liberté-responsabilité) adaptée à une équipe de 3–5 fondateurs :
   organigramme à 0, 12 et 36 mois, rôles et responsabilités, gouvernance (pacte d'associés, vesting
   4 ans / 1 an de cliff, BSPCE ou équivalent OHADA), rituels, OKR du premier trimestre, plan de
   recrutement, forme juridique OHADA (SAS) et étapes de création au CEPICI.

# FORMAT DE SORTIE
- Un fichier par livrable, numéroté (00 à 11), en Markdown.
- Commence par un sommaire et un tableau « Livrable → critère du jury servi ».
- Termine par une checklist « Prêt pour le jury » et un plan d'action J-30 → J-0.
```

---

## Variantes courtes (pour itérer)

| Besoin | Prompt |
|---|---|
| Approfondir une section | `Reprends la section 6 en te mettant à la place d'un chef de service de mairie sceptique. Liste ses 10 objections et intègre la réponse dans le processus.` |
| Stress-test du jury | `Agis comme le jury JNSP le plus exigeant. Pose 20 questions difficiles sur ce dossier, note-le sur 100 par critère et dis ce qui ferait gagner 15 points.` |
| Chiffrer | `Recalcule le modèle financier avec 30 % d'adoption en moins et un délai de paiement de l'État de 180 jours. Quel besoin de trésorerie ?` |
| Générer du code | `À partir du modèle de données de la section 9, génère les migrations SQL, les routes Express et les tests Jest de l'épopée E3.` |

> Tous les livrables ci-dessous (dossiers 01 à 11 et `mvp/`) ont été produits à partir de ce prompt.
