# 04 — Product Backlog

Critères du jury servis : faisabilité, qualité d'exécution.
Version importable dans Jira/Trello/Notion : [`04-product-backlog.csv`](./04-product-backlog.csv).

**Priorisation** : MoSCoW (M = Must, S = Should, C = Could, W = Won't now) + score **RICE** = (Reach × Impact × Confidence) / Effort.
Reach = usagers/agents touchés par trimestre (en milliers), Impact 0,25–3, Confidence 50–100 %, Effort en semaines-personne.
**Estimation** en points (suite de Fibonacci). Vélocité cible : 20 points / sprint de 2 semaines (équipe de 3 développeurs).

## Épopées

| ID | Épopée | Objectif | Sprint |
|---|---|---|---|
| E1 | Identité & accès | Connexion sans mot de passe (OTP), rôles usager / agent / admin | S1 |
| E2 | Catalogue de procédures | Modéliser procédures, étapes, services, SLA | S1 |
| E3 | Dépôt & numéro de suivi | Créer une demande (en ligne ou au guichet) avec numéro unique et QR | S2 |
| E4 | Suivi usager | Timeline, suivi public par numéro, historique | S2 |
| E5 | Traitement agent | File de travail, avancer, pièce manquante, rejet | S3 |
| E6 | SLA & relances | Calcul d'échéance, alertes, relance usager, escalade | S3 |
| E7 | Notifications | SMS, WhatsApp, push, préférences | S4 |
| E8 | Pilotage | Tableau de bord délais, retards, classement | S4 |
| E9 | Inclusion | USSD, guichet assisté, langues locales, audio | S5–S6 |
| E10 | Monétisation | RDV, livraison, paiement Mobile Money, API B2B | Post-MVP |
| E11 | Sécurité & conformité | Journal d'audit, consentement, ARTCI, sauvegardes | Continu |

## User stories (MVP = Must)

| ID | Épopée | User story | Critères d'acceptation (Gherkin résumé) | MoSCoW | RICE | Pts |
|---|---|---|---|---|---|---|
| US-01 | E1 | En tant qu'**usager**, je veux me connecter avec mon numéro de téléphone et un code SMS, afin de ne pas retenir de mot de passe. | *Étant donné* un numéro valide, *quand* je demande un code, *alors* je reçois un code à 6 chiffres valable 5 min ; 5 essais max. | M | 180 | 5 |
| US-02 | E1 | En tant qu'**administrateur**, je veux créer des comptes agents rattachés à un service, afin de contrôler qui traite quoi. | Un agent ne voit que les dossiers de son service. | M | 90 | 3 |
| US-03 | E2 | En tant qu'**administrateur**, je veux définir une procédure (étapes ordonnées, service, SLA en jours, pièces requises), afin de modéliser le parcours réel. | Une procédure publiée n'est plus modifiable que par nouvelle version. | M | 120 | 5 |
| US-04 | E2 | En tant qu'**usager**, je veux voir la liste des procédures avec délai total et pièces, afin de bien préparer mon dossier. | Délai total = somme des SLA des étapes. | M | 150 | 2 |
| US-05 | E3 | En tant qu'**usager**, je veux déposer une demande en ligne et recevoir un numéro de suivi, afin de suivre mon dossier. | Format `SUI-AAAA-NNNNNN` ; échéance calculée ; SMS de confirmation. | M | 200 | 5 |
| US-06 | E3 | En tant qu'**agent de guichet**, je veux enregistrer une demande déposée physiquement et imprimer un reçu avec QR, afin que les usagers non connectés soient suivis aussi. | Reçu avec numéro + QR + lien court ; usager notifié par SMS. | M | 220 | 5 |
| US-07 | E4 | En tant qu'**usager**, je veux voir la timeline de mon dossier (étape actuelle, service responsable, délai restant), afin de savoir quand revenir. | Statut visible en < 3 s sur 3G ; étapes passées horodatées. | M | 300 | 5 |
| US-08 | E4 | En tant que **toute personne disposant du numéro**, je veux suivre un dossier sans compte, afin qu'un proche puisse m'aider. | Données personnelles masquées (nom → initiales). | M | 250 | 3 |
| US-09 | E5 | En tant qu'**agent**, je veux voir ma file de dossiers triée par urgence (retard d'abord), afin de traiter les bons dossiers en premier. | Code couleur : vert / orange (< 20 % du SLA restant) / rouge (dépassé). | M | 160 | 3 |
| US-10 | E5 | En tant qu'**agent**, je veux faire avancer un dossier à l'étape suivante en 1 clic, afin de mettre à jour sans effort. | Action < 10 s ; transfert automatique au service suivant ; usager notifié. | M | 280 | 3 |
| US-11 | E5 | En tant qu'**agent**, je veux signaler une pièce manquante avec un message, afin que l'usager la fournisse sans se déplacer pour rien. | Statut « En attente usager » ; le SLA est suspendu ; usager notifié. | M | 210 | 3 |
| US-12 | E5 | En tant qu'**usager**, je veux répondre à une demande de pièce (texte ou photo), afin de relancer le traitement. | Le dossier revient dans la file de l'agent ; SLA relancé. | M | 180 | 5 |
| US-13 | E5 | En tant qu'**agent**, je veux rejeter un dossier avec un motif obligatoire, afin que l'usager sache pourquoi. | Motif choisi dans une liste + commentaire. | M | 90 | 2 |
| US-14 | E6 | En tant qu'**usager**, je veux relancer un dossier en retard, afin que le service responsable soit alerté. | Relance possible seulement si SLA dépassé ; 1 relance / 48 h. | M | 170 | 3 |
| US-15 | E6 | En tant que **chef de service**, je veux être alerté des dossiers en retard, afin d'agir avant la plainte. | Alerte quotidienne ; escalade au N+1 à SLA + 50 %. | S | 120 | 5 |
| US-16 | E7 | En tant qu'**usager**, je veux recevoir un SMS/WhatsApp à chaque changement d'étape, afin de ne rien avoir à demander. | Message ≤ 160 caractères, lien court. Journal d'envoi conservé. | M | 300 | 5 |
| US-17 | E8 | En tant que **décideur**, je veux un tableau de bord (volumes, délais médians, retards par service), afin de piloter. | Rafraîchi en temps réel ; export CSV. | M | 140 | 5 |
| US-18 | E11 | En tant que **DPO**, je veux un journal d'audit de toutes les actions sur un dossier, afin de garantir la traçabilité. | Événements immuables (qui, quoi, quand). | M | 100 | 3 |
| US-19 | E9 | En tant qu'**usager sans smartphone**, je veux composer un code USSD et taper mon numéro de dossier, afin de connaître son statut. | `*XXX*numéro#` → statut en 1 écran. | S | 260 | 8 |
| US-20 | E9 | En tant qu'**usager**, je veux l'interface et les SMS en dioula/baoulé, ou un message vocal, afin de comprendre sans aide. | i18n ; messages vocaux pré-enregistrés. | S | 150 | 8 |
| US-21 | E7 | En tant qu'**usager**, je veux installer l'appli (PWA) et consulter mes dossiers hors connexion, afin d'y accéder partout. | Dernier état mis en cache. | S | 110 | 3 |
| US-22 | E10 | En tant qu'**usager**, je veux réserver un créneau de retrait quand mon document est prêt, afin de ne pas faire la queue. | Paiement optionnel Mobile Money. | C | 90 | 8 |
| US-23 | E10 | En tant qu'**usager**, je veux me faire livrer mon document, afin d'éviter le déplacement. | Partenaire logistique ; suivi de livraison. | C | 70 | 13 |
| US-24 | E10 | En tant qu'**entreprise partenaire**, je veux vérifier par API le statut d'un dossier avec le consentement de l'usager. | Clé API ; consentement horodaté ; facturation à l'appel. | C | 60 | 8 |
| US-25 | E6 | En tant que **système**, je veux estimer la date de fin réelle à partir des délais historiques, afin d'afficher une estimation fiable. | Médiane glissante sur 90 jours par étape. | C | 130 | 8 |
| US-26 | — | Chat IA « assistant démarches » | Reporté après validation du cœur. | W | — | — |

## Plan de sprints jusqu'au MVP (12 semaines)

| Sprint | Objectif de sprint | Stories | Points |
|---|---|---|---|
| S0 (1 sem.) | Mise en place (dépôt git, CI, maquettes validées, environnement) | — | — |
| S1 | « Un admin peut modéliser une procédure et un usager peut se connecter » | US-01, 02, 03, 04 | 15 |
| S2 | « Un usager dépose et suit son dossier » | US-05, 06, 07, 08 | 18 |
| S3 | « Un agent traite son dossier de bout en bout » | US-09, 10, 11, 12, 13, 14 | 19 |
| S4 | « Tout le monde est notifié, le chef pilote » | US-16, 17, 18 | 13 |
| S5 | « Personne n'est laissé de côté » | US-15, 21, 19 (partiel) | 16 |
| S6 | Durcissement, tests terrain, pilote | US-19, 20, correctifs | 16+ |

## Definition of Ready
Story au format standard • critères d'acceptation écrits • maquette liée si UI • dépendances identifiées • estimée par l'équipe • taille ≤ 8 points.

## Definition of Done
Code revu (1 relecteur) • tests automatisés verts (unitaires + API) • accessibilité vérifiée (contraste, lecteur d'écran) • fonctionne sur Android entrée de gamme en 3G simulée • documentation API à jour • déployé en préproduction • validé par le PO.
