# 02 — Business Model Canvas, Lean Canvas, Value Proposition Canvas

Critères du jury servis : viabilité économique, passage à l'échelle.

## 1. Business Model Canvas — SUIVO

| Partenaires clés | Activités clés | Proposition de valeur | Relation client | Segments de clientèle |
|---|---|---|---|---|
| • Ministère de la Fonction Publique (sponsor)<br>• Ministère de la Transition Numérique<br>• Communes pilotes (état civil)<br>• Tribunaux / organismes (casier, nationalité)<br>• Opérateurs télécoms et agrégateurs SMS/WhatsApp<br>• Opérateurs Mobile Money (Orange, MTN, Moov, Wave)<br>• Hébergeur souverain / datacenter local<br>• Bailleurs (BAD, Banque mondiale, UE, GIZ)<br>• Incubateurs, universités (stagiaires dév.) | • Développement et exploitation de la plateforme<br>• Paramétrage des procédures (étapes, SLA) par administration<br>• Formation et accompagnement des agents<br>• Intégrations API avec SI existants<br>• Support usager multicanal<br>• Production de rapports de performance | **Usager** : savoir à tout moment où est son dossier, qui le traite, quand il sera prêt — sans se déplacer. Relancer, répondre à une pièce manquante, prendre RDV à distance.<br><br>**Administration** : désengorger les guichets, mesurer et améliorer les délais réels, détecter les goulots, rendre compte (redevabilité), réduire la corruption. | • Self-service (PWA, WhatsApp, USSD)<br>• Notifications proactives<br>• Guichet assisté / agents relais<br>• Account management dédié pour chaque administration<br>• Communauté d'agents « champions » | **Payants**<br>• Communes (201)<br>• Ministères et organismes publics<br>• Entreprises consommatrices de statuts (banques, notaires, RH, cabinets)<br><br>**Utilisateurs (gratuit)**<br>• Citoyens et résidents<br>• Diaspora<br>• Entreprises (formalités) |
| | **Ressources clés** | | **Canaux** | |
| | • Plateforme (moteur de workflow, SLA, notifications)<br>• Bibliothèque de procédures modélisées<br>• Équipe produit/tech + équipe terrain<br>• Données de performance (anonymisées)<br>• Conventions avec l'État | | • JNSP et sponsor ministériel<br>• Affiches + QR code dans les halls d'attente<br>• Reçu de dépôt avec numéro de suivi SUIVO<br>• Réseaux sociaux, radios de proximité<br>• Réseau AMCI / UVICOCI (communes) | |
| **Structure de coûts** | | | **Sources de revenus** | |
| • Salaires (produit, tech, terrain) ≈ 60 %<br>• Hébergement, sécurité ≈ 8 %<br>• SMS/WhatsApp ≈ 12 % (refacturés en partie)<br>• Déploiement terrain, formation ≈ 12 %<br>• Marketing, juridique, divers ≈ 8 % | | | 1. **Licence SaaS B2G** par administration (3 à 60 M FCFA/an selon la taille)<br>2. **Frais de mise en place / intégration** (one-shot)<br>3. **Services premium usager** (RDV garanti, livraison du document, relance prioritaire) — 500 à 2 000 FCFA via Mobile Money<br>4. **API B2B** de vérification de statut (avec consentement) — 100 FCFA/appel<br>5. **Subventions / programmes bailleurs** pour le déploiement rural | |

> Principe : le **suivi de base est gratuit et le restera** pour l'usager. On ne fait jamais payer l'information sur l'avancement de sa propre demande.

## 2. Lean Canvas

| Bloc | Contenu |
|---|---|
| Problème | 1. Déplacements répétés pour connaître l'état d'un dossier. 2. Aucune visibilité sur l'acteur responsable et les délais. 3. Administration incapable de mesurer ses délais réels. |
| Alternatives actuelles | Revenir au guichet, appeler une connaissance, payer un démarcheur, groupes WhatsApp informels. |
| Segments | Early adopters : jeunes actifs urbains qui préparent un concours ou une embauche (certificat de nationalité, casier, acte de naissance) ; mairie pilote volontaire. |
| Proposition unique | « Votre dossier administratif, suivi comme un colis. » |
| Solution | Numéro de suivi unique, timeline par étape avec service responsable et SLA, notifications SMS/WhatsApp, file de traitement agent en 1 clic, tableau de bord des délais. |
| Canaux | Reçu de dépôt + QR ; sponsor ministériel ; JNSP ; réseaux sociaux. |
| Revenus | SaaS B2G, intégration, premium usager, API B2B, subventions. |
| Coûts | Équipe, SMS, hébergement, terrain. |
| Métriques clés | **North Star : nombre de déplacements évités / mois.** Entrées : % de dossiers mis à jour dans le SLA, délai médian, nb de demandes suivies, NPS usager, taux d'activité agents. |
| Avantage déloyal | Bibliothèque de procédures modélisées + données de délais réels inter-services + conventions avec l'État (difficilement copiables rapidement). |

## 3. Value Proposition Canvas

### Usager (Awa / Konan)
| Profil client | Carte de valeur |
|---|---|
| **Jobs** : obtenir un document à temps pour un concours, une inscription scolaire, un emploi, un voyage | **Produits & services** : PWA, suivi par numéro, WhatsApp/SMS, USSD, guichet assisté |
| **Douleurs** : allers-retours, coût, incertitude, démarcheurs, langue | **Anti-douleurs** : notification « prêt à retirer », délai restant affiché, nom du service responsable, relance en 1 clic, messages simples et vocaux |
| **Gains** : prévisibilité, dignité, gain de temps, preuve en cas de litige | **Créateurs de gains** : historique horodaté (preuve), RDV de retrait, livraison, estimation fiable fondée sur les délais réels |

### Administration (Mme Bamba / M. Kouadio)
| Profil client | Carte de valeur |
|---|---|
| **Jobs** : traiter les dossiers, informer les usagers, rendre compte à la tutelle | **Produits & services** : file de traitement, mise à jour en 1 clic ou par scan de QR, tableau de bord SLA, rapports mensuels |
| **Douleurs** : files d'attente, questions répétitives, absence de données, plaintes | **Anti-douleurs** : moins de passages « pour info », réponses automatiques, alertes avant dépassement |
| **Gains** : reconnaissance, image moderne, arbitrages budgétaires fondés sur des données | **Créateurs de gains** : classement des services, indicateurs pour les JNSP, export pour la tutelle |
