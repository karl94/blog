# 08 — Pitch deck et support de présentation

- **Deck interactif** : [`pitch-deck.html`](./pitch-deck.html). Ouvrez-le dans un navigateur ; les flèches ← → (ou un balayage sur mobile) changent de diapositive, et le bouton « Plein écran » sert à la projection. Le fichier utilise les captures du dossier `../assets/captures`, il faut donc garder l'arborescence telle quelle.
- **Version illustrée (10 diapositives, avec un cas pratique de bout en bout)** : [`SUIVO-pitch-illustre.pptx`](./SUIVO-pitch-illustre.pptx) et [PDF](./SUIVO-pitch-illustre.pdf), produite avec le prompt 00c ; sources et rapport dans [`illustre/`](./illustre).
- **Version PowerPoint** : [`pitch-deck-suivo.pptx`](./pitch-deck-suivo.pptx), 12 diapositives 16:9 entièrement modifiables (thème, mises en page, graphiques natifs). Le **script oral est dans les notes du présentateur**. Regénération : `node generer-pptx.js`.
- **PDF de la version PowerPoint** : [`pitch-deck-suivo.pdf`](./pitch-deck-suivo.pdf), polices intégrées, identique sur tous les ordinateurs : la version à projeter le jour J ou à envoyer au jury.
- **Version PDF** (à envoyer ou imprimer) : [`pitch-deck.pdf`](./pitch-deck.pdf), 12 diapositives au format 16:9.

| # | Diapositive | Critère du jury |
|---|---|---|
| 1 | Couverture : SUIVO, « suivi comme un colis » | — |
| 2 | Problème | Pertinence |
| 3 | Solution | Innovation |
| 4 | Parcours | Impact citoyen |
| 5 | Démo (captures du MVP réel) | Faisabilité |
| 6 | Marché | Viabilité |
| 7 | Modèle économique | Viabilité |
| 8 | Positionnement / concurrence | Innovation |
| 9 | Mise sur le marché | Passage à l'échelle |
| 10 | Projections financières | Viabilité |
| 11 | Équipe et organisation | Équipe |
| 12 | Notre demande | — |

## Script oral (3 minutes)

**[0:00 – Diapo 2]** « Levez la main si vous êtes déjà retourné à un guichet seulement pour demander où en était votre dossier. *(pause)* Nous aussi. En Côte d'Ivoire, obtenir un certificat de nationalité peut demander quatre ou cinq déplacements, et la plupart ne servent qu'à s'entendre dire "ce n'est pas encore prêt". Cela coûte environ 7 000 francs CFA à l'usager à chaque démarche. Et l'administration elle-même ne sait pas où le dossier est bloqué. »

**[0:30 – Diapo 3-4]** « SUIVO donne à chaque demande un numéro de suivi, comme pour un colis. Que le dossier soit déposé en ligne ou au guichet, l'usager voit l'étape en cours, le service qui le traite et le délai restant. Il est prévenu par SMS ou WhatsApp à chaque étape. S'il manque une pièce, il la transmet sans se déplacer. Il ne vient plus qu'une fois : pour retirer son document. »

**[1:00 – Diapo 5 : démo en direct]** « Ce n'est pas une maquette, c'est un MVP qui fonctionne. Voici le dossier d'Awa : en retard de 5 jours au service de la nationalité. Elle clique sur "Relancer". Côté agent, le dossier passe en tête de file, en rouge. L'agent valide l'étape en un clic, et Awa reçoit un SMS. Côté décideur, ce tableau de bord montre pour la première fois le délai réel de chaque étape, comparé au délai prévu. »

**[1:45 – Diapos 6-7-10]** « Le suivi reste gratuit pour le citoyen. Ce sont les administrations qui paient une licence SaaS, à partir de 3 millions par an pour une commune, c'est-à-dire moins que le salaire d'un agent pour désengorger tout un guichet. À 36 mois, nous visons 25 communes et 2 organismes nationaux, 256 millions de chiffre d'affaires et l'équilibre. »

**[2:15 – Diapos 8-9-11]** « Nous ne remplaçons aucun portail : nous les relions. Nous démarrons petit, avec une commune et un tribunal pendant 6 mois, et nous mesurons avant et après. Notre équipe réunit produit, technique et terrain, parce que le vrai défi est l'adoption par les agents, et nous l'avons pensée dès le premier jour. »

**[2:40 – Diapo 12]** « Nous vous demandons un pilote : un sponsor, une commune, un tribunal, trois procédures. Notre objectif est de 10 000 déplacements évités par mois à la fin du pilote. Pour qu'aucun Ivoirien n'ait plus à demander "où en est mon dossier ?". Merci. »

## Les 15 questions les plus probables du jury

| # | Question | Réponse courte |
|---|---|---|
| 1 | Et si les agents ne mettent pas à jour les statuts ? | C'est notre risque n° 1. Nous y répondons ainsi : une action en 1 clic ou par scan du QR, une note de service du sponsor, des agents « champions », un classement valorisant et moins de passages « pour info » au guichet. Indicateur suivi : 90 % des étapes mises à jour sous 24 h. |
| 2 | En quoi êtes-vous différents des portails existants ? | Ils servent au dépôt, pour une démarche. SUIVO est une couche de suivi transversale qui couvre aussi les dépôts papier et qui se branche sur ces portails par API. |
| 3 | Et les citoyens sans smartphone ? | Dépôt assisté au guichet, SMS sur téléphone basique, USSD et messages vocaux en langues locales (feuille de route S5-S6). |
| 4 | Données personnelles ? | Loi 2013-450, déclaration à l'ARTCI, DPO, données minimales (pas de pièces sensibles dans le MVP), suivi public anonymisé, journal d'audit immuable. |
| 5 | Pourquoi l'État paierait-il ? | Moins d'affluence, des délais mesurés, de la redevabilité et un levier contre la corruption. Le prix d'une licence communale est inférieur au coût annuel d'un agent. |
| 6 | Délais de paiement publics ? | Ils sont modélisés (3 à 6 mois). Le financement par les bailleurs et les revenus B2B2C/API, encaissés immédiatement, couvrent l'écart. |
| 7 | Intégration aux SI existants ? | Quatre niveaux : autonome, saisie assistée, connecteur, webhooks/API (livrable 06, §7). |
| 8 | Que se passe-t-il si l'État développe sa propre solution ? | Nous pouvons devenir son opérateur ou lui céder une licence. Notre valeur réside dans la bibliothèque de procédures, les données de délais et l'expertise d'adoption. |
| 9 | Pourquoi une PWA plutôt qu'une application native ? | Un seul code pour le web et le mobile, pas de passage par un store, une application légère pour Android d'entrée de gamme et une consultation hors ligne. |
| 10 | Sécurité ? | OTP haché, JWT, droits par service, journal immuable, TLS ; audit de sécurité avant la production. |
| 11 | Qu'avez-vous déjà validé ? | MVP fonctionnel et testé. Prochaine étape : 30 entretiens, 200 questionnaires et une lettre d'intention d'une mairie (livrable 01, §5). |
| 12 | Comment estimez-vous les délais réels ? | Chaque validation est horodatée. Nous calculons la médiane par étape sur 90 jours, puis une estimation de date de fin (US-25). |
| 13 | Coût des SMS ? | 3 SMS par demande à 15 FCFA, puis bascule vers WhatsApp et les notifications push, qui coûtent environ 3 fois moins. |
| 14 | Comment passer à l'échelle ? | Une procédure modélisée une fois est réutilisable dans les 201 communes. Les conventions-cadres ministérielles évitent de négocier commune par commune. |
| 15 | Que ferez-vous du prix ? | Financer le pilote : terrain, formation des agents, passerelle SMS, hébergement local. |

## Risques & hypothèses critiques
1. **Chiffres non encore sourcés** : le jury peut demander d'où viennent les « 4 à 5 déplacements » et les « 7 000 FCFA ». *Parade* : présenter ces chiffres comme des hypothèses et montrer le plan de validation (livrable 01), ou mieux, les avoir validés avant le jury.
2. **Démo en direct** : risque de panne réseau ou d'ordinateur. *Parade* : vidéo de secours de 60 s et captures intégrées au deck.
3. **Diapositive Équipe** : elle doit montrer les vraies personnes, avec leur photo et une ligne de crédibilité chacune.

## Prochaine action en 48 h
Compléter la diapositive 11 avec l'équipe réelle et chronométrer une première répétition complète du pitch, démo comprise.
