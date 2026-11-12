// Pitch deck illustré SUIVO (.pptx) — exécution du prompt 00c-PROMPT-PITCH-ILLUSTRE.md
// Usage : npm install pptxgenjs@3.12.0 sharp@0.33.5 react@18.3.1 react-dom@18.3.1 react-icons@5.4.0
//         node generer.js            (APPLY_THEME=/chemin/apply_theme.js pour inscrire la palette dans le thème)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fa = require('react-icons/fa6');
const pptxgen = require('pptxgenjs');

const ICI = __dirname;
const SVG_DIR = path.join(ICI, 'svg');
const PNG_DIR = path.join(ICI, 'png');
const CAP = path.join(ICI, '..', '..', 'assets', 'captures');
const OUT = path.join(ICI, '..', 'SUIVO-pitch-illustre.pptx');
const FIN = JSON.parse(fs.readFileSync(path.join(ICI, '..', '..', 'dossier-pdf', 'finances.json'), 'utf8')).central.synthese;
[SVG_DIR, PNG_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const V = '#17603C', VF = '#0C3320', VC = '#EEF6F1', VM = '#D4EADC', O = '#F28C28', OC = '#FFE3C7', ENC = '#0F172A';
const PEAU = ['#8D5524', '#6B3F1D', '#A0673A'];

// ------------------------------------------------------------------ Illustrations SVG
function personne({ x, y, s = 1, peau = PEAU[0], haut = V, tete = null, humeur = 'neutre' }) {
  const coiffe = {
    foulard: `<path d="M-23,12 Q-22,-14 0,-12 Q24,-14 23,12 Q0,2 -23,12Z" fill="${O}"/><circle cx="20" cy="-6" r="7" fill="${O}"/>`,
    chapeau: `<path d="M-15,-1 Q-13,-19 0,-19 Q13,-19 15,-1Z" fill="#7C5A2E"/><rect x="-27" y="-3" width="54" height="6" rx="3" fill="#7C5A2E"/>`,
    cheveux: `<path d="M-21,14 Q-25,-8 0,-6 Q25,-8 21,14 Q17,1 0,1 Q-17,1 -21,14Z" fill="#1F1F1F"/>`,
    court: `<path d="M-20,8 Q-19,-6 0,-6 Q19,-6 20,8 Q10,0 0,0 Q-10,0 -20,8Z" fill="#1F1F1F"/>`,
  }[tete] || '';
  const bouche = { content: 'M-7,26 Q0,32 7,26', triste: 'M-7,30 Q0,24 7,30', neutre: 'M-6,28 L6,28' }[humeur];
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-32,95 Q-32,44 0,44 Q32,44 32,95Z" fill="${haut}"/>
    <rect x="-7" y="34" width="14" height="12" fill="${peau}"/>
    <circle cx="0" cy="18" r="21" fill="${peau}"/>${coiffe}
    <circle cx="-7" cy="16" r="2.6" fill="${ENC}"/><circle cx="7" cy="16" r="2.6" fill="${ENC}"/>
    <path d="${bouche}" stroke="${ENC}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
}
const cadre = (contenu, w = 320, h = 240, fond = VC) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="22" fill="${fond}"/>${contenu}</svg>`;
const bulle = (x, y, w, h, texte, taille = 15, queueX = null) =>
  `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${V}" stroke-width="2.5"/>`
  + (queueX != null ? `<path d="M${queueX},${y + h - 1} l12,16 l6,-17Z" fill="#fff" stroke="${V}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${queueX + 1}" y="${y + h - 4}" width="16" height="5" fill="#fff"/>` : '')
  + `<text x="${x + w / 2}" y="${y + h / 2 + taille / 3}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${taille}" fill="${ENC}">${texte}</text></g>`;

const SVGS = {
  // Vignettes du contexte
  'scene-1-guichet': cadre(`
    <rect x="150" y="40" width="150" height="112" rx="10" fill="#fff" stroke="${V}" stroke-width="6"/>
    ${personne({ x: 225, y: 66, s: 0.85, peau: PEAU[1], haut: V, tete: 'cheveux' })}
    <rect x="135" y="148" width="180" height="76" rx="8" fill="${V}"/>
    <rect x="160" y="168" width="54" height="8" rx="4" fill="${VM}"/>
    ${personne({ x: 78, y: 112, s: 1.15, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'neutre' })}
    ${bulle(14, 14, 128, 46, 'Revenez…', 17, 110)}`),
  'scene-2-transport': cadre(`
    <rect x="0" y="182" width="320" height="58" fill="#CBD5E1"/>
    <rect x="20" y="206" width="40" height="7" rx="3" fill="#fff"/><rect x="140" y="206" width="40" height="7" rx="3" fill="#fff"/><rect x="260" y="206" width="40" height="7" rx="3" fill="#fff"/>
    <rect x="44" y="84" width="230" height="102" rx="22" fill="${O}"/>
    <rect x="62" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="116" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="170" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="224" y="100" width="34" height="36" rx="7" fill="#fff"/>
    <rect x="44" y="150" width="230" height="10" fill="${V}"/>
    <circle cx="96" cy="188" r="20" fill="${ENC}"/><circle cx="96" cy="188" r="8" fill="#CBD5E1"/>
    <circle cx="226" cy="188" r="20" fill="${ENC}"/><circle cx="226" cy="188" r="8" fill="#CBD5E1"/>
    <circle cx="268" cy="44" r="30" fill="#fff" stroke="${V}" stroke-width="5"/>
    <text x="268" y="52" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="${V}">F</text>
    <text x="200" y="52" text-anchor="end" font-family="Inter" font-weight="800" font-size="22" fill="${ENC}">– 1 000</text>`),
  'scene-3-attente': cadre(`
    <rect x="30" y="178" width="260" height="14" rx="7" fill="${V}"/><rect x="50" y="190" width="10" height="34" fill="${V}"/><rect x="260" y="190" width="10" height="34" fill="${V}"/>
    ${personne({ x: 110, y: 96, s: 1.05, peau: PEAU[2], haut: '#64748B', tete: 'chapeau', humeur: 'triste' })}
    ${personne({ x: 205, y: 96, s: 1.05, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'triste' })}
    <circle cx="160" cy="50" r="34" fill="#fff" stroke="${V}" stroke-width="6"/>
    <path d="M160,50 L160,28 M160,50 L176,58" stroke="${ENC}" stroke-width="5" stroke-linecap="round"/>
    ${bulle(232, 14, 70, 46, '?', 30)}`),
  'scene-4-retour': cadre(`
    <rect x="160" y="40" width="130" height="120" rx="14" fill="#fff" stroke="${V}" stroke-width="6"/>
    <rect x="160" y="40" width="130" height="34" rx="12" fill="${V}"/><rect x="160" y="62" width="130" height="12" fill="${V}"/>
    <rect x="186" y="28" width="10" height="26" rx="5" fill="${ENC}"/><rect x="254" y="28" width="10" height="26" rx="5" fill="${ENC}"/>
    <text x="225" y="138" text-anchor="middle" font-family="Inter" font-weight="800" font-size="50" fill="${O}">×3</text>
    ${personne({ x: 80, y: 112, s: 1.15, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'triste' })}`),
  // Avatars des personas
  'avatar-awa': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${OC}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[0], haut: V, tete: 'foulard', humeur: 'content' })}<rect x="128" y="148" width="26" height="44" rx="5" fill="${ENC}"/><rect x="132" y="153" width="18" height="30" rx="2" fill="#7DD3A8"/></g></svg>`,
  'avatar-konan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${VM}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[1], haut: '#64748B', tete: 'chapeau', humeur: 'neutre' })}<rect x="130" y="152" width="22" height="36" rx="4" fill="${ENC}"/><rect x="134" y="157" width="14" height="12" rx="1" fill="#CBD5E1"/></g></svg>`,
  'avatar-bamba': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${VC}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[2], haut: V, tete: 'cheveux', humeur: 'neutre' })}<circle cx="86" cy="93" r="10" fill="none" stroke="${ENC}" stroke-width="3"/><circle cx="114" cy="93" r="10" fill="none" stroke="${ENC}" stroke-width="3"/><path d="M96,93 L104,93" stroke="${ENC}" stroke-width="3"/><rect x="118" y="160" width="26" height="18" rx="3" fill="#fff"/><rect x="122" y="165" width="18" height="3" fill="${V}"/></g></svg>`,
  // Colis suivi (page de garde)
  'colis-suivi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260" width="300" height="260">
    <path d="M40,230 C90,230 90,170 150,170 S220,120 250,90" fill="none" stroke="${VM}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
    <circle cx="40" cy="230" r="14" fill="${V}" stroke="#fff" stroke-width="4"/><circle cx="150" cy="170" r="14" fill="${V}" stroke="#fff" stroke-width="4"/>
    <path d="M70,96 L150,60 L230,96 L150,132Z" fill="#D9A15B"/><path d="M70,96 L150,132 L150,226 L70,190Z" fill="#B97F3C"/><path d="M230,96 L150,132 L150,226 L230,190Z" fill="#C98E48"/>
    <path d="M110,78 L190,114 L190,140 L176,134 L176,120 L96,84Z" fill="#EBD3A6"/>
    <rect x="160" y="150" width="56" height="34" rx="4" fill="#fff" transform="skewY(-24) translate(0,86)"/>
    <path d="M250,20 C228,20 214,36 214,56 C214,82 250,112 250,112 C250,112 286,82 286,56 C286,36 272,20 250,20Z" fill="${O}"/><circle cx="250" cy="56" r="13" fill="#fff"/></svg>`,
};

// Carte stylisée de la Côte d'Ivoire (contour simplifié, approximatif)
(function carte() {
  const k = 44, px = (lon) => (lon + 8.8) * k + 10, py = (lat) => (10.9 - lat) * k + 10;
  const contour = [[-7.6, 10.4], [-6.2, 10.5], [-5.5, 10.4], [-4.7, 9.9], [-3.6, 9.9], [-2.7, 9.4], [-2.5, 8.2], [-2.9, 7.0], [-3.2, 6.2], [-2.9, 5.1], [-3.9, 5.2], [-5.5, 5.1], [-7.5, 4.4], [-7.6, 5.2], [-8.3, 6.3], [-8.0, 7.5], [-8.4, 7.7], [-8.2, 8.5], [-7.8, 8.4], [-8.1, 9.4]];
  const pts = contour.map(([lo, la]) => `${px(lo).toFixed(0)},${py(la).toFixed(0)}`).join(' ');
  const villes = [['Abidjan', -4.0, 5.35, true], ['Bouaké', -5.03, 7.69, false, 0, -12], ['Yamoussoukro', -5.28, 6.82, false, 6, 24], ['Daloa', -6.45, 6.88, false, -4, -12], ['Korhogo', -5.63, 9.46, false, 0, -12], ['San-Pédro', -6.64, 4.75, false, 0, -12]];
  const v = villes.map(([n, lo, la, pilote, dx = 0, dy = -12]) => pilote
    ? `<circle cx="${px(lo)}" cy="${py(la)}" r="20" fill="${O}" opacity=".25"/><circle cx="${px(lo)}" cy="${py(la)}" r="10" fill="${O}" stroke="#fff" stroke-width="3"/><text x="${px(lo) + 4}" y="${py(la) + 38}" font-family="Inter" font-weight="800" font-size="17" fill="${ENC}" text-anchor="middle">${n} · pilote</text>`
    : `<circle cx="${px(lo)}" cy="${py(la)}" r="7" fill="${V}" stroke="#fff" stroke-width="2.5"/><text x="${px(lo) + dx}" y="${py(la) + dy}" font-family="Inter" font-weight="600" font-size="14" fill="${ENC}" text-anchor="middle">${n}</text>`).join('');
  SVGS['carte-ci'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320" width="300" height="320"><polygon points="${pts}" fill="${VM}" stroke="${V}" stroke-width="3" stroke-linejoin="round"/>${v}</svg>`;
}());

// ------------------------------------------------------------------ Rendu des images
async function rasteriser(nom, largeur) {
  const svg = SVGS[nom];
  fs.writeFileSync(path.join(SVG_DIR, `${nom}.svg`), svg);
  const sortie = path.join(PNG_DIR, `${nom}.png`);
  await sharp(Buffer.from(svg), { density: 300 }).resize({ width: largeur }).png().toFile(sortie);
  return sortie;
}

async function icone(Composant, couleur = '#FFFFFF', taille = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Composant, { color: couleur, size: taille }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

// Capture dans un cadre de téléphone (coins arrondis, bord sombre)
async function telephone(fichier, sortieNom) {
  const W = 780, H = 1688, b = 26, r = 70;
  const img = await sharp(path.join(CAP, fichier)).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();
  const masque = Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${r}" fill="#fff"/></svg>`);
  const arrondie = await sharp(img).composite([{ input: masque, blend: 'dest-in' }]).png().toBuffer();
  const fond = Buffer.from(`<svg width="${W + 2 * b}" height="${H + 2 * b}"><rect width="${W + 2 * b}" height="${H + 2 * b}" rx="${r + b}" fill="#111827"/></svg>`);
  const sortie = path.join(PNG_DIR, `${sortieNom}.png`);
  await sharp(fond).composite([{ input: arrondie, left: b, top: b }]).png().toFile(sortie);
  return { chemin: sortie, ratio: (W + 2 * b) / (H + 2 * b), b: b / (W + 2 * b), bh: b / (H + 2 * b) };
}

// ------------------------------------------------------------------ Deck
(async () => {
  const img = {};
  for (const [n, w] of [['scene-1-guichet', 960], ['scene-2-transport', 960], ['scene-3-attente', 960], ['scene-4-retour', 960],
    ['avatar-awa', 400], ['avatar-konan', 400], ['avatar-bamba', 400], ['colis-suivi', 900], ['carte-ci', 900]]) img[n] = await rasteriser(n, w);
  const telAccueil = await telephone('01-accueil-mobile.png', 'tel-accueil');
  const telSuivi = await telephone('02-suivi-public-mobile.png', 'tel-suivi');
  const telDossiers = await telephone('03-mes-dossiers-mobile.png', 'tel-dossiers');
  const ic = {};
  for (const [k, C] of Object.entries({ suivre: fa.FaMobileScreenButton, notif: fa.FaBell, piece: fa.FaFileArrowUp, relance: fa.FaBullhorn,
    depot: fa.FaInbox, routage: fa.FaRoute, suivi: fa.FaLocationDot, retrait: fa.FaBoxOpen, etat: fa.FaBuildingColumns,
    qr: fa.FaQrcode, sms: fa.FaCommentSms, citoyen: fa.FaUser, entreprise: fa.FaBriefcase, premium: fa.FaStar })) ic[k] = await icone(C);

  const THEME = {
    name: 'SUIVO illustré', headFontFace: 'Calibri', bodyFontFace: 'Calibri',
    colors: { dk1: '0F172A', lt1: 'FFFFFF', dk2: '17603C', lt2: 'EEF6F1', accent1: '17603C', accent2: 'F28C28', accent3: 'B91C1C', accent4: '0C3320', accent5: '64748B', accent6: 'D4EADC', hlink: '17603C', folHlink: '0C3320' },
  };
  const H = THEME.colors;
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: 'Calibri', bodyFontFace: 'Calibri' };
  pres.title = 'SUIVO — Pitch illustré JNSP 2026';
  pres.author = 'SUIVO';
  const C = pres.SchemeColor;
  const M = 0.6, CW = 13.333 - 2 * M;

  pres.defineSlideMaster({
    title: 'SUIVO_GARDE', background: { color: H.accent4 },
    objects: [{ text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: 0.8, y: 6.95, w: 6, h: 0.3, fontSize: 11, color: C.accent6, margin: 0 } } }],
  });
  pres.defineSlideMaster({
    title: 'SUIVO_CONTENU', background: { color: H.lt1 },
    objects: [
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.38, w: 8, h: 0.35, fontSize: 13, bold: true, color: C.accent2, charSpacing: 2, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: 9.6, h: 0.75, fontSize: 32, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      { text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: M, y: 7.02, w: 6, h: 0.3, fontSize: 11, color: C.accent5, margin: 0 } } },
    ],
    slideNumber: { x: 12.2, y: 7.02, w: 0.55, h: 0.3, fontSize: 11, color: C.accent5, align: 'right' },
  });

  const TOTAL = 8;
  // Motif récurrent : le « suivi de colis » du deck (points d'étape en haut à droite)
  function motif(s, n, sombre = false) {
    const x0 = 10.55, x1 = 12.65, y = 0.62;
    s.addShape(pres.shapes.LINE, { objectName: 'Motif ligne', x: x0, y, w: x1 - x0, h: 0, line: { color: sombre ? C.accent1 : C.accent6, width: 2.5 } });
    for (let i = 1; i <= TOTAL; i += 1) {
      const x = x0 + ((i - 1) * (x1 - x0)) / (TOTAL - 1);
      const d = i === n ? 0.24 : 0.14;
      const col = i === n ? C.accent2 : i < n ? (sombre ? C.accent6 : C.accent1) : (sombre ? C.accent4 : C.accent6);
      s.addShape(pres.shapes.OVAL, { objectName: `Motif étape ${i}`, x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color: col }, line: { color: sombre ? C.accent6 : C.background1, width: 1.5 } });
    }
  }
  function contenu(n, kicker, titre) {
    const s = pres.addSlide({ masterName: 'SUIVO_CONTENU' });
    s.addText(kicker.toUpperCase(), { placeholder: 'kicker' });
    s.addText(titre, { placeholder: 'title' });
    motif(s, n);
    return s;
  }
  const txt = (s, nom, t, o) => s.addText(t, { objectName: nom, margin: 0, isTextBox: true, color: C.text1, fontSize: 16, valign: 'top', ...o });
  const rond = (s, nom, x, y, d, icon, fill = C.accent1) => {
    s.addShape(pres.shapes.OVAL, { objectName: nom, x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
    s.addImage({ objectName: `${nom} icône`, data: icon, x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, altText: nom });
  };
  const carte = (s, nom, x, y, w, h, fill = C.background2) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: nom, x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill } });
  // Trait de (x1, y1) à (x2, y2) avec flèches
  const ligne = (s, nom, x1, y1, x2, y2, line) => s.addShape(pres.shapes.LINE, {
    objectName: nom, x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (y2 - y1) * (x2 - x1) < 0, line,
  });
  const ombre = () => ({ type: 'outer', color: '000000', opacity: 0.22, blur: 10, offset: 3, angle: 90 });

  // ============================================================ 1. Page de garde
  {
    const s = pres.addSlide({ masterName: 'SUIVO_GARDE' });
    motif(s, 1, true);
    txt(s, 'Surtitre', 'JNSP 2026 · SPRINT DIGITAL', { x: 0.8, y: 1.45, w: 7, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2 });
    txt(s, 'Nom', 'SUIVO', { x: 0.8, y: 1.9, w: 7, h: 1.4, fontSize: 88, bold: true, color: C.background1 });
    txt(s, 'Promesse', 'Votre dossier administratif, suivi comme un colis', { x: 0.8, y: 3.35, w: 6.4, h: 1.1, fontSize: 28, bold: true, color: C.background1 });
    txt(s, 'Problématique', 'Problématique : suivi des demandes administratives\nPlateforme web et mobile · SMS · WhatsApp · USSD', { x: 0.8, y: 4.75, w: 6.4, h: 0.8, fontSize: 16, color: C.accent6, paraSpaceAfter: 4 });
    s.addImage({ objectName: 'Illustration colis suivi', path: img['colis-suivi'], x: 6.75, y: 3.65, w: 2.9, h: 2.51, altText: 'Colis avec un repère de position et un trajet en pointillés : le dossier suivi comme un colis' });
    s.addImage({ objectName: 'Capture écran d\'accueil', path: telAccueil.chemin, x: 9.75, y: 0.95, w: 5.7 * telAccueil.ratio, h: 5.7, altText: "Écran d'accueil de l'application SUIVO", shadow: ombre() });
    s.addNotes("Bonjour. Nous sommes SUIVO, et notre promesse tient en une phrase : suivre son dossier administratif comme on suit un colis.");
  }

  // ============================================================ 2. Contexte — le problème
  {
    const s = contenu(2, 'Contexte', '« Revenez la semaine prochaine »');
    const scenes = [['scene-1-guichet', 'Dépôt au guichet'], ['scene-2-transport', 'Retour en woro-woro'], ['scene-3-attente', '« Pas encore prêt »'], ['scene-4-retour', '« Il manque une pièce »']];
    const w = 2.85, g = (CW - 4 * w) / 3;
    scenes.forEach(([n, l], i) => {
      const x = M + i * (w + g);
      s.addImage({ objectName: `Vignette ${i + 1}`, path: img[n], x, y: 1.75, w, h: w * 0.75, altText: l });
      const yl = 1.88 + w * 0.75;
      s.addShape(pres.shapes.OVAL, { objectName: `Numéro vignette ${i + 1}`, x, y: yl, w: 0.38, h: 0.38, fill: { color: C.accent2 }, line: { color: C.accent2 } });
      txt(s, `Numéro ${i + 1} texte`, String(i + 1), { x, y: yl, w: 0.38, h: 0.38, fontSize: 13, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Légende vignette ${i + 1}`, l, { x: x + 0.5, y: yl, w: w - 0.5, h: 0.38, fontSize: 15, bold: true, valign: 'middle' });
    });
    const stats = [['4–5', 'déplacements pour un seul document*', C.accent3], ['≈ 7 000', 'FCFA perdus par démarche*', C.accent2], ['0', "visibilité sur l'étape et le délai", C.accent1]];
    stats.forEach(([n, l, col], i) => {
      const x = M + i * 4.1;
      txt(s, `Chiffre ${i + 1}`, n, { x, y: 4.65, w: 2.25, h: 0.9, fontSize: 40, bold: true, color: col, valign: 'middle' });
      txt(s, `Libellé chiffre ${i + 1}`, l, { x: x + 2.3, y: 4.65, w: 1.7, h: 0.9, fontSize: 14, valign: 'middle' });
    });
    txt(s, 'Constat', "Personne, pas même l'administration, ne sait où est le dossier, qui le traite ni quand il sera prêt.", { x: M, y: 5.8, w: CW, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
    txt(s, 'Note hypothèses', '* Hypothèses à valider par 30 entretiens et 200 questionnaires.', { x: M, y: 6.45, w: CW, h: 0.3, fontSize: 12, italic: true, color: C.accent5 });
    s.addNotes("Obtenir un document peut demander quatre ou cinq déplacements : on dépose, on revient en woro-woro, on s'entend dire que ce n'est pas prêt, puis qu'il manque une pièce. Cela coûte environ 7 000 francs CFA par démarche. Et l'administration elle-même ne sait pas où est le dossier.");
  }

  // ============================================================ 3. Contexte — personas
  {
    const s = contenu(3, 'Contexte', 'Trois personnes, une même attente');
    const p = [
      ['avatar-awa', 'Awa, 29 ans', 'Commerciale à Yopougon · smartphone, WhatsApp', '« Obtenir mon certificat de nationalité pour un concours sans perdre de jours de travail. »', 'Aucune date, des démarcheurs, des allers-retours.'],
      ['avatar-konan', 'Konan, 52 ans', 'Planteur à Daloa · téléphone basique, lit peu le français', '« Obtenir l\'acte de naissance de mon fils sans aller trois fois en ville. »', 'Le coût du transport ; il dépend de ses enfants pour lire.'],
      ['avatar-bamba', 'Mme Bamba, 41 ans', 'Agente de guichet en mairie · 80 usagers par jour', '« Répondre vite aux usagers et avoir moins de monde devant mon guichet. »', 'Questions répétitives, outils lents.'],
    ];
    const w = (CW - 2 * 0.35) / 3;
    p.forEach(([a, nom, profil, citation, douleur], i) => {
      const x = M + i * (w + 0.35);
      carte(s, `Carte ${nom}`, x, 1.75, w, 4.95);
      s.addImage({ objectName: `Avatar ${nom}`, path: img[a], x: x + 0.25, y: 2.0, w: 1.25, h: 1.25, altText: `Portrait illustré : ${nom}` });
      txt(s, `Nom ${nom}`, nom, { x: x + 1.65, y: 2.05, w: w - 1.8, h: 0.4, fontSize: 16, bold: true });
      txt(s, `Profil ${nom}`, profil, { x: x + 1.65, y: 2.48, w: w - 1.8, h: 0.85, fontSize: 13, color: C.accent5 });
      txt(s, `Citation ${nom}`, citation, { x: x + 0.3, y: 3.6, w: w - 0.6, h: 1.65, fontSize: 17, italic: true, color: C.accent1 });
      txt(s, `Douleur ${nom}`, [{ text: 'Sa douleur : ', options: { bold: true, color: C.accent2 } }, { text: douleur }], { x: x + 0.3, y: 5.15, w: w - 0.6, h: 1.1, fontSize: 14 });
    });
    s.addNotes("Le problème touche trois personnes. Awa, en ville, perd des journées de travail. Konan, à Daloa, n'a qu'un téléphone basique et paie cher chaque trajet. Et Mme Bamba, au guichet, passe ses journées à répondre « pas encore » au lieu de traiter les dossiers.");
  }

  // ============================================================ 4. Solution
  {
    const s = contenu(4, 'La solution', 'Un numéro de suivi, une timeline, des notifications');
    const h = 5.05, w1 = h * telSuivi.ratio;
    s.addImage({ objectName: 'Capture suivi public', path: telSuivi.chemin, x: M + 0.1, y: 1.65, w: w1, h, altText: 'Suivi public du dossier : étape 2 sur 3, service responsable, retard de 5 jours', shadow: ombre() });
    s.addImage({ objectName: 'Capture mes dossiers', path: telDossiers.chemin, x: M + w1 + 0.45, y: 1.65, w: w1, h, altText: 'Liste des dossiers de l\'usager avec leur progression', shadow: ombre() });
    // Repères numérotés sur la capture (positions relatives à l'image)
    const reperes = [[0.27, 'N° de suivi unique'], [0.355, 'Étape et service responsable'], [0.45, 'Délai restant ou retard']];
    const ix = M + 0.1, iy = 1.65;
    reperes.forEach(([fy], k) => {
      const y = iy + h * (telSuivi.bh + fy * (1 - 2 * telSuivi.bh)) - 0.16;
      s.addShape(pres.shapes.OVAL, { objectName: `Repère ${k + 1}`, x: ix + w1 - 0.17, y, w: 0.34, h: 0.34, fill: { color: C.accent2 }, line: { color: C.background1, width: 1.5 } });
      txt(s, `Repère ${k + 1} texte`, String(k + 1), { x: ix + w1 - 0.17, y, w: 0.34, h: 0.34, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    });
    const xd = M + 2 * w1 + 0.85;
    txt(s, 'Légende repères', reperes.map(([, l], k) => ({ text: `${k + 1}  ${l}`, options: { breakLine: k < 2 } })), { x: xd, y: 1.7, w: 12.73 - xd, h: 1.1, fontSize: 15, bold: true, color: C.accent2, paraSpaceAfter: 4 });
    const benef = [[ic.suivre, 'Suivre à distance', 'sans compte, avec le numéro'], [ic.notif, 'Être notifié', 'par SMS ou WhatsApp à chaque étape'], [ic.piece, 'Répondre à distance', "quand une pièce manque"], [ic.relance, 'Relancer', 'si le délai prévu est dépassé']];
    benef.forEach(([icn, t, d], k) => {
      const y = 3.0 + k * 0.82;
      rond(s, `Bénéfice ${t}`, xd, y, 0.62, icn);
      txt(s, `Texte ${t}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { color: C.accent5, fontSize: 14 } }], { x: xd + 0.8, y: y - 0.02, w: 12.73 - xd - 0.8, h: 0.7, fontSize: 16, valign: 'middle' });
    });
    carte(s, 'Bandeau État', xd, 6.35, 12.73 - xd, 0.55, C.accent6);
    s.addImage({ objectName: 'Icône État', data: await icone(fa.FaBuildingColumns, H.accent4), x: xd + 0.18, y: 6.47, w: 0.3, h: 0.3, altText: 'Administration' });
    txt(s, 'Texte État', [{ text: "Pour l'État : ", options: { bold: true } }, { text: 'file de travail en 1 clic + tableau de bord des délais' }], { x: xd + 0.6, y: 6.35, w: 12.73 - xd - 0.7, h: 0.55, fontSize: 14, color: C.accent4, valign: 'middle' });
    s.addNotes("SUIVO donne à chaque demande un numéro de suivi, comme un colis. L'usager voit l'étape en cours, le service qui détient son dossier et le délai restant. Il est prévenu à chaque étape, peut répondre à une pièce manquante et relancer si le délai est dépassé. Côté État, l'agent valide en un clic et le chef de service voit enfin les délais réels.");
  }

  // ============================================================ 5. Comment ça marche
  {
    const s = contenu(5, 'Comment ça marche', 'De 4–5 déplacements à un seul');
    const etapes = [[ic.depot, 'Dépôt', 'En ligne ou au guichet → n° + QR'], [ic.routage, 'Routage', 'De service en service, chaque étape a son délai'], [ic.suivi, 'Suivi', 'Notification à chaque étape'], [ic.retrait, 'Retrait', '« Votre document est prêt »']];
    const w = 2.55, g = (CW - 1.3 - 4 * w) / 3, x0 = M + 1.3;
    const usager = ['Dépose sa demande', 'Reçoit un SMS par étape', 'Répond ou relance à distance', 'Se déplace une seule fois'];
    const admin = ['Enregistre ou scanne le QR', "Valide l'étape en 1 clic", 'Voit les retards et alertes', 'Remet le document'];
    etapes.forEach(([icn, t, d], i) => {
      const x = x0 + i * (w + g);
      carte(s, `Étape ${t}`, x, 1.7, w, 1.85);
      rond(s, `Icône ${t}`, x + 0.25, 1.92, 0.62, icn, i === 3 ? C.accent2 : C.accent1);
      txt(s, `Titre ${t}`, `${i + 1}. ${t}`, { x: x + 1.0, y: 1.98, w: w - 1.1, h: 0.5, fontSize: 19, bold: true, valign: 'middle' });
      txt(s, `Texte ${t}`, d, { x: x + 0.25, y: 2.7, w: w - 0.45, h: 0.75, fontSize: 14 });
      if (i < 3) s.addShape(pres.shapes.CHEVRON, { objectName: `Flèche ${i + 1}`, x: x + w + (g - 0.2) / 2, y: 2.45, w: 0.2, h: 0.36, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    });
    [['Usager', 3.82, C.background2], ['Administration', 4.52, C.accent6]].forEach(([l, y, f]) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Couloir ${l}`, x: M, y, w: CW, h: 0.6, rectRadius: 0.08, fill: { color: f, transparency: 40 }, line: { color: f } });
      txt(s, `Libellé couloir ${l}`, l, { x: M + 0.12, y, w: 1.2, h: 0.6, fontSize: 13, bold: true, color: C.accent4, valign: 'middle' });
    });
    // textes posés sur les couloirs
    etapes.forEach((_, i) => {
      const x = x0 + i * (w + g);
      txt(s, `Usager ${i + 1} (couloir)`, usager[i], { x, y: 3.82, w, h: 0.6, fontSize: 14, valign: 'middle' });
      txt(s, `Administration ${i + 1} (couloir)`, admin[i], { x, y: 4.52, w, h: 0.6, fontSize: 14, valign: 'middle' });
    });
    carte(s, 'Encadré sans smartphone', M, 5.45, 7.3, 1.3, C.background2);
    rond(s, 'Icône sans smartphone', M + 0.25, 5.77, 0.66, ic.sms, C.accent2);
    txt(s, 'Texte sans smartphone', [{ text: 'Sans smartphone ? ', options: { bold: true, color: C.accent4 } }, { text: 'reçu avec QR au guichet, notifications par SMS, statut par code USSD *XXX#.' }], { x: M + 1.15, y: 5.45, w: 6.0, h: 1.3, fontSize: 15, valign: 'middle' });
    txt(s, 'Avant', '4–5', { x: 8.35, y: 5.45, w: 1.4, h: 0.9, fontSize: 44, bold: true, color: C.accent5, align: 'right', valign: 'middle' });
    s.addShape(pres.shapes.RIGHT_ARROW, { objectName: 'Flèche avant après', x: 9.95, y: 5.72, w: 0.9, h: 0.38, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    txt(s, 'Après', '1', { x: 11.05, y: 5.45, w: 0.8, h: 0.9, fontSize: 44, bold: true, color: C.accent1, valign: 'middle' });
    txt(s, 'Légende avant après', 'déplacements par démarche*', { x: 8.35, y: 6.3, w: 4.38, h: 0.35, fontSize: 13, color: C.accent5, align: 'center' });
    s.addNotes("Concrètement : on dépose en ligne ou au guichet et on reçoit un numéro. Le dossier passe de service en service, chacun avec son délai. L'usager est notifié à chaque étape, et l'agent n'a qu'un clic à faire. À la fin, un seul déplacement : pour retirer le document. Sans smartphone, le reçu QR, les SMS et l'USSD prennent le relais.");
  }

  // ============================================================ 6. Le marché
  {
    const s = contenu(6, 'Le marché', 'Des millions de démarches, aucun suivi commun');
    const cx = 2.55, base = 6.45;
    [[4.0, C.background2], [2.8, C.accent6], [1.6, C.accent1]].forEach(([d, col], i) => {
      s.addShape(pres.shapes.OVAL, { objectName: `Cercle ${['TAM', 'SAM', 'SOM'][i]}`, x: cx - d / 2, y: base - d, w: d, h: d, fill: { color: col }, line: { color: C.background1, width: 2 } });
    });
    txt(s, 'TAM', 'TAM', { x: cx - 0.8, y: base - 3.85, w: 1.6, h: 0.4, fontSize: 16, bold: true, color: C.accent1, align: 'center' });
    txt(s, 'SAM', 'SAM', { x: cx - 0.8, y: base - 2.65, w: 1.6, h: 0.4, fontSize: 16, bold: true, color: C.accent4, align: 'center' });
    txt(s, 'SOM', 'SOM', { x: cx - 0.7, y: base - 1.05, w: 1.4, h: 0.4, fontSize: 16, bold: true, color: C.background1, align: 'center' });
    const v = [['≈ 30 M', 'démarches par an en Côte d\'Ivoire*', C.accent1], ['≈ 12 M', 'à plusieurs étapes, usagers joignables par mobile*', C.accent1], ['≈ 1,2 M', 'demandes suivies à 36 mois (≈ 25 communes + 2 organismes)*', C.accent2]];
    v.forEach(([n, l, col], i) => {
      const y = 1.85 + i * 1.3;
      txt(s, `Valeur ${i + 1}`, n, { x: 4.85, y, w: 2.1, h: 0.75, fontSize: 34, bold: true, color: col, valign: 'middle' });
      txt(s, `Libellé ${i + 1}`, l, { x: 4.85, y: y + 0.7, w: 3.6, h: 0.55, fontSize: 13 });
    });
    s.addImage({ objectName: 'Carte de la Côte d\'Ivoire', path: img['carte-ci'], x: 8.85, y: 1.55, w: 3.5, h: 3.73, altText: "Carte stylisée de la Côte d'Ivoire : pilote à Abidjan, extension vers Bouaké, Yamoussoukro, Daloa, Korhogo et San-Pédro" });
    s.addShape(pres.shapes.RIGHT_ARROW, { objectName: 'Flèche UEMOA', x: 8.95, y: 5.5, w: 0.55, h: 0.32, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    txt(s, 'Ensuite UEMOA', [{ text: 'Ensuite : ', options: { bold: true } }, { text: "les 8 pays de l'UEMOA" }], { x: 9.6, y: 5.42, w: 3.13, h: 0.5, fontSize: 15, valign: 'middle' });
    txt(s, 'Facteurs favorables', [{ text: 'Favorable : ', options: { bold: true, color: C.accent1 } }, { text: 'mobile partout, WhatsApp, Mobile Money, volonté de moderniser l\'administration.' }], { x: 4.85, y: 5.95, w: 7.88, h: 0.45, fontSize: 14 });
    txt(s, 'Note hypothèses', '* Hypothèses de marché à valider (livrable 01 — Études). Carte stylisée, non à l\'échelle.', { x: M, y: 6.6, w: CW, h: 0.3, fontSize: 12, italic: true, color: C.accent5 });
    s.addNotes("Le marché : environ 30 millions de démarches par an, dont 12 millions à plusieurs étapes. Nous commençons par un pilote à Abidjan, puis l'intérieur du pays, pour viser 1,2 million de demandes suivies à 36 mois, et ensuite l'UEMOA. Ces volumes sont des hypothèses que nous validons sur le terrain.");
  }

  // ============================================================ 7. Modèle économique
  {
    const s = contenu(7, 'Le modèle économique', 'Gratuit pour le citoyen, payé par les bénéficiaires');
    // Schéma des flux de valeur
    const boite = (nom, x, y, w, h, icn, t, d, fill = C.background2, col = C.text1) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: nom, x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
      rond(s, `${nom} icône`, x + 0.15, y + (h - 0.5) / 2, 0.5, icn, fill === C.accent1 ? C.accent4 : C.accent1);
      txt(s, `${nom} texte`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { x: x + 0.75, y, w: w - 0.85, h, fontSize: 15, color: col, valign: 'middle' });
    };
    boite('Citoyen', M, 3.3, 2.3, 1.0, ic.citoyen, 'Citoyen', 'suivi gratuit');
    boite('SUIVO', 3.55, 3.2, 1.9, 1.2, ic.suivi, 'SUIVO', 'plateforme', C.accent1, C.background1);
    const payeurs = [['Administrations', ic.etat, 'licence 3 à 60 M FCFA/an'], ['Usagers volontaires', ic.premium, 'premium 500 à 2 000 FCFA'], ['Entreprises', ic.entreprise, 'API 100 FCFA/appel']];
    payeurs.forEach(([t, icn, d], i) => {
      const y = 1.75 + i * 1.55;
      boite(t, 6.1, y, 2.6, 1.05, icn, t, d);
      ligne(s, `Valeur vers ${t}`, 5.45, 3.62, 6.1, y + 0.35, { color: C.accent1, width: 2, endArrowType: 'triangle' });
      ligne(s, `Paiement de ${t}`, 5.45, 3.98, 6.1, y + 0.72, { color: C.accent2, width: 2, dashType: 'dash', beginArrowType: 'triangle' });
    });
    s.addShape(pres.shapes.LINE, { objectName: 'Service vers citoyen', x: 2.9, y: 3.8, w: 0.65, h: 0, line: { color: C.accent1, width: 2, beginArrowType: 'triangle' } });
    txt(s, 'Légende flux', [{ text: '━ valeur   ', options: { color: C.accent1, bold: true } }, { text: '┅ paiement', options: { color: C.accent2, bold: true } }], { x: M, y: 6.2, w: 4, h: 0.35, fontSize: 13 });
    // Graphique natif : CA année 3 par source
    const src = [['Licences communes', 'CA licences communes'], ['Licences organismes', 'CA licences organismes'], ['Mise en place', 'CA mise en place / intégration'], ['Premium usagers', 'CA premium usagers'], ['API B2B', 'CA API B2B']];
    s.addChart(pres.charts.BAR, [{ name: 'CA année 3 (M FCFA)', labels: src.map((x) => x[0]).reverse(), values: src.map((x) => +(FIN[x[1]][2] / 1e6).toFixed(1)).reverse() }], {
      objectName: 'Graphique revenus par source', x: 9.0, y: 1.6, w: 3.73, h: 3.55, barDir: 'bar',
      showTitle: true, title: 'CA année 3 par source (M FCFA)', titleFontSize: 13, titleColor: H.dk1, titleFontFace: '+mn-lt',
      chartColors: [H.accent1], showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 11, dataLabelColor: H.dk1, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
      catAxisLabelColor: H.dk1, catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, barGapWidthPct: 50,
    });
    const ca3 = FIN["CHIFFRE D'AFFAIRES"][2], mb3 = FIN['Taux de marge brute'][2];
    [[`${Math.round(ca3 / 1e6)} M`, 'FCFA de CA en année 3'], [`${Math.round(mb3 * 100)} %`, 'de marge brute en année 3']].forEach(([n, l], i) => {
      txt(s, `Chiffre modèle ${i + 1}`, n, { x: 9.0 + i * 1.9, y: 5.25, w: 1.85, h: 0.6, fontSize: 28, bold: true, color: i ? C.accent2 : C.accent1 });
      txt(s, `Libellé modèle ${i + 1}`, l, { x: 9.0 + i * 1.9, y: 5.82, w: 1.85, h: 0.5, fontSize: 12 });
    });
    carte(s, 'Mention gratuité', 4.6, 6.15, 4.1, 0.55, C.accent6);
    txt(s, 'Texte gratuité', 'Le suivi de base reste toujours gratuit.', { x: 4.75, y: 6.15, w: 3.9, h: 0.55, fontSize: 14, bold: true, color: C.accent4, valign: 'middle' });
    txt(s, 'Note scénario', 'Projections du modèle financier, scénario central.', { x: 9.0, y: 6.4, w: 3.73, h: 0.3, fontSize: 11, italic: true, color: C.accent5 });
    s.addNotes(`Le citoyen ne paie jamais pour suivre son dossier. Ce sont les administrations qui paient une licence, à partir de 3 millions par an pour une commune. S'y ajoutent des services premium optionnels et une API pour les entreprises. En année 3, cela représente environ ${Math.round(ca3 / 1e6)} millions de francs CFA de chiffre d'affaires, avec ${Math.round(mb3 * 100)} % de marge brute.`);
  }

  // ============================================================ 8. Clôture
  {
    const s = pres.addSlide({ masterName: 'SUIVO_GARDE' });
    motif(s, 8, true);
    txt(s, 'Surtitre demande', 'NOTRE DEMANDE', { x: 0.8, y: 1.0, w: 7, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2 });
    txt(s, 'Titre demande', 'Un pilote : 6 mois, une commune, un tribunal', { x: 0.8, y: 1.45, w: 11.7, h: 0.9, fontSize: 38, bold: true, color: C.background1 });
    const d = [['Un sponsor', 'au ministère de tutelle'], ['Une commune et un tribunal pilotes', 'pour 3 procédures'], ['85 M FCFA de pré-amorçage', 'pour livrer le pilote']];
    d.forEach(([b, t], i) => {
      const y = 2.85 + i * 0.95;
      s.addShape(pres.shapes.OVAL, { objectName: `Demande ${i + 1}`, x: 0.8, y: y + 0.12, w: 0.55, h: 0.55, fill: { color: C.accent2 }, line: { color: C.accent2 } });
      txt(s, `Numéro demande ${i + 1}`, String(i + 1), { x: 0.8, y: y + 0.12, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Texte demande ${i + 1}`, [{ text: `${b} `, options: { bold: true, color: C.background1 } }, { text: t, options: { color: C.accent6 } }], { x: 1.6, y, w: 6.5, h: 0.8, fontSize: 19, valign: 'middle' });
    });
    txt(s, 'Objectif chiffre', '10 000', { x: 8.6, y: 2.75, w: 4, h: 1.2, fontSize: 66, bold: true, color: C.accent2 });
    txt(s, 'Objectif libellé', 'déplacements évités par mois dès la fin du pilote', { x: 8.6, y: 3.95, w: 3.9, h: 0.9, fontSize: 18, color: C.background1 });
    txt(s, 'Vision', "Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? »", { x: 0.8, y: 6.0, w: 11.7, h: 0.6, fontSize: 20, italic: true, color: C.background1 });
    s.addNotes("Nous vous demandons un pilote : un sponsor, une commune, un tribunal, trois procédures. Objectif : 10 000 déplacements évités par mois à la fin du pilote. Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? ». Merci.");
  }

  await pres.writeFile({ fileName: OUT });
  if (process.env.APPLY_THEME) await require(process.env.APPLY_THEME).applyTheme(OUT, THEME);
  console.log('OK', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
