"""Construit le dossier de candidature SUIVO (HTML d'impression) à partir des livrables.

Usage : python3 build.py [--pages pages.json]   -> dossier.html
Le rendu PDF est fait par render.js (Chromium). Aucun chiffre n'est saisi ici à la main pour
les finances : ils sont lus dans finances.json (extrait des valeurs calculées du modèle Excel).
"""
import html
import json
import re
import sys
from pathlib import Path

import markdown

ICI = Path(__file__).resolve().parent
RACINE = ICI.parent
CAP = '../assets/captures'

PAGES = {}
if '--pages' in sys.argv:
    PAGES = json.loads(Path(sys.argv[sys.argv.index('--pages') + 1]).read_text())
MARQUEURS = '--sans-marqueurs' not in sys.argv

FIN = json.loads((ICI / 'finances.json').read_text())

# ------------------------------------------------------------------ Markdown
MD = markdown.Markdown(extensions=['tables', 'fenced_code', 'sane_lists'])
LIENS = {
    '00-PROMPT-MAITRE.md': '#annexe-prompt', '01-etudes.md': '#partie-a', '02-business-model-canvas.md': '#partie-b',
    '03-product-vision-board.md': '#partie-b', '04-product-backlog.md': '#partie-c', '04-product-backlog.csv': '#annexe-backlog',
    '05-user-workflows.md': '#partie-c', '06-processus.md': '#partie-c', '07-modele-financier': '#partie-e',
    '08-pitch-deck': '#annexe-jury', '09-maquettes-prototype.md': '#partie-c', '10-organisation.md': '#partie-f',
    'mvp': '#partie-d',
}


def lien(m):
    cible = m.group(1)
    for cle, ancre in LIENS.items():
        if cle in cible:
            return f'<a href="{ancre}">'
    return '<a>'


def rendu(texte):
    MD.reset()
    h = MD.convert(texte)
    def orienter(m):
        code = m.group(1)
        if any(k in code for k in ('Agent connecté', 'Comité consultatif')):  # déjà bien proportionnés
            return f'<div class="diagramme"><pre class="mermaid">{code}</pre></div>'
        code = re.sub(r'flowchart (LR|TB)', lambda d: 'flowchart ' + ('TB' if d.group(1) == 'LR' else 'LR'), code)
        return f'<div class="diagramme"><pre class="mermaid">{code}</pre></div>'
    h = re.sub(r'<pre><code class="language-mermaid">(.*?)</code></pre>', orienter, h, flags=re.S)
    h = re.sub(r'<a href="([^"#][^"]*)">', lien, h)
    return h


def lire(rel):
    return (RACINE / rel).read_text(encoding='utf-8')


def sections(rel):
    """Découpe un fichier Markdown en {titre de niveau 2: corps}. Ignore le titre de niveau 1."""
    res = {}
    courant, lignes, code = '_intro', [], False
    for ligne in lire(rel).splitlines():
        if ligne.startswith('```'):
            code = not code
        if not code and ligne.startswith('## '):
            res[courant] = '\n'.join(lignes).strip()
            courant, lignes = ligne[3:].strip(), []
        elif not code and ligne.startswith('# '):
            continue
        else:
            lignes.append(ligne)
    res[courant] = '\n'.join(lignes).strip()
    return res


def tableau(texte):
    """Lit le premier tableau Markdown d'un texte -> (entêtes, lignes)."""
    lignes = [l.strip() for l in texte.splitlines() if l.strip().startswith('|')]
    cell = lambda l: [c.strip() for c in l.strip('|').split('|')]
    return cell(lignes[0]), [cell(l) for l in lignes[2:]]


def inline(t):
    MD.reset()
    h = MD.convert(t)
    return re.sub(r'^<p>(.*)</p>$', r'\1', h, flags=re.S)


# ------------------------------------------------------------------ Sommaire et ancres
TOC = []  # (niveau, id, titre)
COMPTEUR = [0]


def ancre(niveau, titre, ident=None):
    COMPTEUR[0] += 1
    ident = ident or f's{COMPTEUR[0]}'
    TOC.append((niveau, ident, titre))
    marque = f'<span class="marqueur">@@{ident}@@</span>' if MARQUEURS else ''
    return ident, marque


def h2(titre, ident=None):
    i, m = ancre(2, titre, ident)
    return f'<h2 id="{i}">{marque_txt(m)}{html.escape(titre)}</h2>'


def marque_txt(m):
    return m


def section_md(titre, corps, ident=None):
    return h2(titre, ident) + rendu(corps)


def garde(lettre, ident, titre, promesse, livrables):
    i, m = ancre(1, f'{lettre} — {titre}' if lettre else titre, ident)
    num = f'<div class="num">{lettre}</div>' if lettre else ''
    return (f'<section class="garde" id="{i}">{m}{num}<h1>{html.escape(titre)}</h1>'
            f'<p class="promesse">{promesse}</p><div class="livrables">{livrables}</div></section>')


def retenir(points):
    return '<div class="encadre retenir"><h4>À retenir</h4><ul>' + ''.join(f'<li>{p}</li>' for p in points) + '</ul></div>'


def action48(rel):
    s = sections(rel).get('Prochaine action en 48 h')
    return f'<div class="encadre action"><h4>Prochaine action en 48 h</h4>{rendu(s)}</div>' if s else ''


def telephone(img, legende=None, alt=''):
    fig = f'<div class="telephone"><img src="{CAP}/{img}" alt="{html.escape(alt or legende or img)}"></div>'
    return f'<figure>{fig}<figcaption>{legende}</figcaption></figure>' if legende else fig


def navigateur(img, legende, coupe=False):
    return (f'<figure><div class="navigateur{" coupe" if coupe else ""}"><div class="barre"><span></span><span></span><span></span></div>'
            f'<img src="{CAP}/{img}" alt="{html.escape(legende)}"></div><figcaption>{legende}</figcaption></figure>')


def fcfa(v, dec=1):
    return f'{v / 1e6:,.{dec}f}'.replace(',', ' ').replace('.', ',') + ' M'


# ------------------------------------------------------------------ Graphiques SVG
VERT, ORANGE, ROUGE, GRIS = '#17603C', '#F28C28', '#B91C1C', '#94A3B8'


def svg_barres(series, labels, couleurs, larg=170, haut=70):
    """Barres groupées avec valeurs négatives. Unités : mm (viewBox = mm × 4)."""
    W, H = larg * 4, haut * 4
    mg, md_, mh, mb = 20, 10, 30, 75
    vals = [v for s in series for v in s]
    vmax, vmin = max(0, max(vals)), min(0, min(vals))
    ech = (H - mh - mb) / (vmax - vmin)
    y0 = mh + vmax * ech
    n, k = len(labels), len(series)
    gw = (W - mg - md_) / n
    bw = gw * 0.62 / k
    out = [f'<svg viewBox="0 0 {W} {H}" width="{larg}mm" height="{haut}mm" xmlns="http://www.w3.org/2000/svg" font-family="Inter" font-size="22">']
    out.append(f'<line x1="{mg}" x2="{W - md_}" y1="{y0}" y2="{y0}" stroke="#CBD5E1" stroke-width="2"/>')
    for i, lab in enumerate(labels):
        x = mg + i * gw + gw * 0.19
        for j, s in enumerate(series):
            v = s[i]
            h_ = abs(v) * ech
            y = y0 - h_ if v >= 0 else y0
            out.append(f'<rect x="{x + j * bw:.1f}" y="{y:.1f}" width="{bw - 6:.1f}" height="{max(h_, 1):.1f}" rx="4" fill="{couleurs[j]}"/>')
            ty = y - 8 if v >= 0 else y + h_ + 24
            out.append(f'<text x="{x + j * bw + (bw - 6) / 2:.1f}" y="{ty:.1f}" text-anchor="middle" fill="#0F172A" font-weight="600">{v / 1e6:,.0f}</text>'.replace(',', ' '))
        out.append(f'<text x="{mg + i * gw + gw / 2:.1f}" y="{H - 8}" text-anchor="middle" fill="#475569">{lab}</text>')
    out.append('</svg>')
    return ''.join(out)


def svg_courbes(series, couleurs, larg=170, haut=80):
    W, H = larg * 4, haut * 4
    mg, md_, mh, mb = 70, 16, 16, 40
    vals = [v for s in series for v in s]
    vmax, vmin = max(vals), min(0, min(vals))
    pas = 100e6
    vmax = (int(vmax / pas) + 1) * pas
    ech = (H - mh - mb) / (vmax - vmin)
    n = len(series[0])
    sx = (W - mg - md_) / (n - 1)
    Y = lambda v: mh + (vmax - v) * ech
    out = [f'<svg viewBox="0 0 {W} {H}" width="{larg}mm" height="{haut}mm" xmlns="http://www.w3.org/2000/svg" font-family="Inter" font-size="20">']
    g = 0
    while g <= vmax:
        out.append(f'<line x1="{mg}" x2="{W - md_}" y1="{Y(g):.1f}" y2="{Y(g):.1f}" stroke="#E2E8F0" stroke-width="1.5"/>')
        out.append(f'<text x="{mg - 8}" y="{Y(g) + 7:.1f}" text-anchor="end" fill="#475569">{int(g / 1e6)} M</text>')
        g += pas
    for m in (1, 12, 24, 36):
        out.append(f'<text x="{mg + (m - 1) * sx:.1f}" y="{H - 12}" text-anchor="middle" fill="#475569">M{m}</text>')
    for s, c in zip(series, couleurs):
        pts = ' '.join(f'{mg + i * sx:.1f},{Y(v):.1f}' for i, v in enumerate(s))
        out.append(f'<polyline points="{pts}" fill="none" stroke="{c}" stroke-width="5" stroke-linejoin="round"/>')
    out.append('</svg>')
    return ''.join(out)


def svg_cercles():
    """TAM / SAM / SOM en cercles concentriques (valeurs du livrable 01)."""
    return ('<svg viewBox="0 0 400 300" width="95mm" height="71mm" xmlns="http://www.w3.org/2000/svg" font-family="Inter">'
            '<circle cx="150" cy="150" r="145" fill="#EEF6F1"/><circle cx="150" cy="195" r="100" fill="#D4EADC"/>'
            '<circle cx="150" cy="240" r="55" fill="#17603C"/>'
            '<text x="150" y="38" text-anchor="middle" font-size="17" font-weight="700" fill="#17603C">TAM ≈ 30 M</text>'
            '<text x="150" y="120" text-anchor="middle" font-size="17" font-weight="700" fill="#0C3320">SAM ≈ 12 M</text>'
            '<text x="150" y="238" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">SOM</text>'
            '<text x="150" y="258" text-anchor="middle" font-size="14" fill="#fff">≈ 1,2 M</text>'
            '<text x="305" y="70" font-size="12" fill="#475569">démarches / an</text>'
            '<text x="305" y="88" font-size="12" fill="#475569">en Côte d\'Ivoire</text>'
            '<text x="275" y="175" font-size="12" fill="#475569">à plusieurs étapes,</text>'
            '<text x="275" y="193" font-size="12" fill="#475569">joignables par mobile</text>'
            '<text x="215" y="262" font-size="12" fill="#475569">cible à 36 mois</text></svg>')


# ------------------------------------------------------------------ Pages fixes
def couverture():
    return f'''<section class="couverture">
  <div class="txt">
    <div class="sur">JNSP 2026 · Sprint Digital</div>
    <h1>SUIVO</h1>
    <div class="promesse">Votre dossier administratif, suivi comme un colis</div>
    <div class="doc"><strong>Dossier de candidature</strong><br>Problématique : suivi des demandes administratives<br>
      Plateforme web et mobile (PWA) · SMS · WhatsApp · USSD</div>
  </div>
  <div class="tel">{telephone('01-accueil-mobile.png', alt="Écran d'accueil de l'application SUIVO")}</div>
  <div class="bas"><span>Côte d'Ivoire · Novembre 2026</span><span>MVP fonctionnel : React · Node.js · PostgreSQL</span></div>
</section>'''


def sommaire():
    lignes = []
    for niv, ident, titre in TOC:
        if niv > 2:
            continue
        pg = PAGES.get(ident, '00')
        lignes.append(f'<li class="n{niv}"><a href="#{ident}"><span>{html.escape(titre)}</span><span class="pts"></span><span class="pg">{pg}</span></a></li>')
    entete, rows = tableau(sections('README.md')['Sommaire des livrables'])
    corps = ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in (r[0], r[1], r[3])) + '</tr>' for r in rows)
    return (f'<section class="sommaire" id="sommaire"><h2>Sommaire</h2><ul class="toc">{"".join(lignes)}</ul></section>'
            f'<section class="saut"><h2>Les livrables et les critères du jury</h2>'
            f'<p>Chaque livrable sert au moins un critère d\'évaluation du jury. Le tableau ci-dessous indique lequel, et où le trouver dans ce dossier.</p>'
            f'<table><thead><tr><th>#</th><th>Livrable</th><th>Critère servi</th></tr></thead><tbody>{corps}</tbody></table>'
            f'<div class="encadre hyp"><span class="etiquette-h">[H]</span> Les chiffres marqués [H] sont des hypothèses de travail, '
            f'à valider pendant la phase de découverte (méthode décrite en partie A). Ils sont listés en annexe A4.</div></section>')


def resume():
    c = FIN['central']['synthese']
    ca3, eb3 = c["CHIFFRE D'AFFAIRES"][2], c['EBITDA'][2]
    fin = c['Financements cumulés'][0]
    i, m = ancre(1, 'Résumé exécutif', 'resume')
    return f'''<section class="resume" id="{i}">{m}<h2>Résumé exécutif</h2>
<div class="chiffres" style="--n:5">
  <div class="chiffre r"><b>4–5</b><span>déplacements par démarche aujourd'hui [H]</span></div>
  <div class="chiffre o"><b>≈ 7 000</b><span>FCFA perdus par l'usager par démarche [H]</span></div>
  <div class="chiffre"><b>{fcfa(ca3, 0)}</b><span>FCFA de chiffre d'affaires en année 3 (central)</span></div>
  <div class="chiffre"><b>{int(c["Communes clientes (fin d'année)"][2] + c["Organismes nationaux clients (fin d'année)"][2])}</b><span>administrations clientes à 36 mois</span></div>
  <div class="chiffre o"><b>{fcfa(fin, 0)}</b><span>FCFA de financement sur 36 mois</span></div>
</div>
<div class="grille">
  <div class="bloc"><h4>Le problème</h4><p>Pour savoir où en est une demande (acte de naissance, certificat de nationalité, permis…), l'usager doit se déplacer, souvent plusieurs fois. Ni lui ni l'administration ne savent qui détient le dossier ni quand il sera prêt.</p></div>
  <div class="bloc"><h4>La solution</h4><p>SUIVO donne un <strong>numéro de suivi unique</strong> à chaque demande, en ligne ou au guichet (reçu QR), relie les services qui la traitent avec leurs délais (SLA) et notifie l'usager par SMS ou WhatsApp. Il agit à distance : pièce manquante, relance.</p></div>
  <div class="bloc"><h4>La preuve</h4><p>Un <strong>MVP fonctionnel</strong> (React + Tailwind PWA, Node.js + Express, PostgreSQL) couvre tout le parcours : connexion par code SMS, file de l'agent en 1 clic, journal d'audit immuable, tableau de bord. 7 scénarios de test de bout en bout passent.</p></div>
  <div class="bloc"><h4>Le marché</h4><p>≈ 30 M démarches par an en Côte d'Ivoire, dont ≈ 12 M à plusieurs étapes [H]. Cible à 36 mois : ≈ 25 communes (24 dans le scénario central du modèle) et 2 organismes nationaux, ≈ 1,2 M demandes suivies [H], puis l'UEMOA.</p></div>
  <div class="bloc"><h4>Le modèle économique</h4><p>Le suivi reste <strong>gratuit pour le citoyen</strong>. Revenus : licences SaaS des administrations (3 à 60 M FCFA/an), mise en place, services premium optionnels, API B2B. Marge brute récurrente &gt; 75 %.</p></div>
  <div class="bloc"><h4>Les finances (scénario central)</h4><p>CA de {fcfa(c["CHIFFRE D'AFFAIRES"][0], 0)} → {fcfa(c["CHIFFRE D'AFFAIRES"][1], 0)} → {fcfa(ca3, 0)} FCFA ; EBITDA année 3 : {fcfa(eb3, 0)} ; équilibre mensuel vers le mois 36. En scénario pessimiste, la trésorerie reste positive sur 36 mois.</p></div>
  <div class="bloc demande"><h4>Notre demande</h4><p><strong>Un pilote de 6 mois</strong> avec un sponsor ministériel, une commune et un tribunal, sur 3 procédures (acte de naissance, certificat de nationalité, casier judiciaire), et 85 M FCFA de pré-amorçage. Objectif : <strong>10 000 déplacements évités par mois</strong> à la fin du pilote.</p></div>
</div></section>'''


# ------------------------------------------------------------------ Partie A
def partie_a():
    s = sections('01-etudes.md')
    out = [garde('A', 'partie-a', 'Le problème et le marché',
                 "Des millions de démarches, aucune visibilité : ce que coûte l'incertitude et à qui.",
                 'Livrable 01 — Études : problème, marché, benchmark, personas, recherche utilisateur, PESTEL, SWOT')]
    out.append('<section>')
    out.append(section_md('Nom, promesse et pitch', s['0. Nom et promesse']))
    out.append(section_md('Analyse du problème', s['1. Analyse du problème']))
    out.append(h2('Étude de marché') + f'<div class="diagramme">{svg_cercles()}</div>' + rendu(s['2. Étude de marché']))
    out.append(section_md('Benchmark', s['3. Benchmark']))
    # Personas en fiches
    ent, rows = tableau(s['4. Personas'])
    fiches = []
    for j, nom in enumerate(ent[1:], start=1):
        nom_txt = re.sub(r'\*\*(.*?)\*\*', r'\1', nom)
        initiale = nom_txt.strip()[0]
        dl = ''.join(f'<dt>{html.escape(r[0])}</dt><dd>{inline(r[j])}</dd>' for r in rows)
        fiches.append(f'<div class="persona"><div class="tete"><div class="avatar">{initiale}</div><h4>{inline(nom)}</h4></div><dl>{dl}</dl></div>')
    out.append(h2('Personas') + f'<div class="personas">{"".join(fiches)}</div>')
    out.append(section_md('Plan de recherche utilisateur', s['5. Plan de recherche utilisateur (phase de découverte, 3 semaines)']))
    out.append(section_md('PESTEL', s['6. PESTEL']))
    ent, rows = tableau(s['7. SWOT'])
    swot = (f'<div class="swot"><div class="f"><h4>Forces</h4>{inline(rows[0][0])}</div><div class="w"><h4>Faiblesses</h4>{inline(rows[0][1])}</div>'
            f'<div class="o"><h4>Opportunités</h4>{inline(rows[2][0])}</div><div class="t"><h4>Menaces</h4>{inline(rows[2][1])}</div></div>')
    out.append(h2('SWOT') + swot)
    out.append(action48('01-etudes.md'))
    out.append(retenir([
        'Le problème coûte ≈ 7 000 FCFA et 4 à 5 déplacements par démarche à l\'usager [H] ; l\'État ne mesure pas ses propres délais.',
        'SUIVO se positionne en <strong>couche de suivi transversale</strong>, complémentaire des portails existants (modèle mental du colis).',
        'Les hypothèses clés sont validées en 3 semaines : 30 entretiens, 200 questionnaires, 2 tests d\'utilisabilité, 1 lettre d\'intention.',
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie B
def partie_b():
    s = sections('02-business-model-canvas.md')
    v = sections('03-product-vision-board.md')
    out = [garde('B', 'partie-b', 'Le modèle', "Gratuit pour le citoyen, payé par ceux qui en tirent de la valeur.",
                 'Livrable 02 — Business Model Canvas, Lean Canvas, Value Proposition Canvas · Livrable 03 — Product Vision Board')]
    ent, rows = tableau(s['1. Business Model Canvas — SUIVO'])
    bloc = lambda cls, titre, txt: f'<div class="{cls}"><h4>{titre}</h4><p>{inline(txt)}</p></div>'
    bmc = ('<div class="bmc">'
           + bloc('kp', ent[0], rows[0][0]) + bloc('ka', ent[1], rows[0][1]) + bloc('kr', 'Ressources clés', rows[2][1])
           + bloc('vp', ent[2], rows[0][2]) + bloc('cr', ent[3], rows[0][3]) + bloc('ch', 'Canaux', rows[2][3])
           + bloc('cs', ent[4], rows[0][4]) + bloc('co', 'Structure de coûts', rows[4][0]) + bloc('re', 'Sources de revenus', rows[4][3])
           + '</div>')
    note = s['1. Business Model Canvas — SUIVO'].split('> ', 1)[1] if '> ' in s['1. Business Model Canvas — SUIVO'] else ''
    out.append(f'<section class="paysage">{h2("Business Model Canvas")}{bmc}<p class="petit" style="margin-top:2mm">{inline(note)}</p></section>')
    out.append('<section>')
    out.append(section_md('Lean Canvas', s['2. Lean Canvas']))
    out.append(section_md('Value Proposition Canvas', s['3. Value Proposition Canvas']))
    out.append(h2('Product Vision Board') + rendu(v['_intro'].split('\n', 2)[-1]))
    out.append(rendu('### Métriques\n' + v['Métriques']) + rendu('### Principes produit\n' + v['Principes produit']))
    out.append(action48('02-business-model-canvas.md'))
    out.append(retenir([
        'Cinq sources de revenus, dominées par les licences SaaS des administrations ; <strong>le suivi de base reste toujours gratuit</strong>.',
        'North Star : <strong>déplacements évités par mois</strong> (cible pilote : 10 000).',
        'Avantage déloyal : bibliothèque de procédures modélisées et données de délais réels inter-services.',
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie C
def partie_c():
    b = sections('04-product-backlog.md')
    w = sections('05-user-workflows.md')
    p = sections('06-processus.md')
    m = sections('09-maquettes-prototype.md')
    out = [garde('C', 'partie-c', 'Le produit', "Un numéro, une timeline, des notifications — et l'agent en 1 clic.",
                 'Livrables 04 — Backlog · 05 — User workflows · 06 — Processus · 09 — Maquettes et charte')]
    out.append('<section>')
    out.append(h2('Product backlog') + rendu(b['_intro'].split('\n', 2)[-1]) + rendu('### Épopées\n' + b['Épopées']))
    ent, rows = tableau(b['User stories (MVP = Must)'])
    must = [r for r in rows if r[4] == 'M']
    t = ('<table><thead><tr><th>ID</th><th>User story</th><th>Critères d\'acceptation</th><th>RICE</th><th>Pts</th></tr></thead><tbody>'
         + ''.join(f'<tr><td>{r[0]}</td><td>{inline(r[2])}</td><td>{inline(r[3])}</td><td>{r[5]}</td><td>{r[6]}</td></tr>' for r in must)
         + '</tbody></table>')
    out.append(f'<h3>User stories « Must » du MVP ({len(must)} sur {len(rows)})</h3>{t}<p class="petit">Le backlog complet (Should, Could, Won\'t) est en annexe A1.</p>')
    ent, rows = tableau(b['Plan de sprints jusqu\'au MVP (12 semaines)'])
    frise = ''.join(f'<div class="etape"><span class="pastille">{r[0].split()[0][1:]}</span><h4>{r[0]}</h4><p>{inline(r[1])}</p><p class="petit">{r[2]} · {r[3]} pts</p></div>' for r in rows)
    out.append(f'<h3>Plan de sprints jusqu\'au MVP (12 semaines)</h3><div class="frise" style="--n:4">{frise}</div>')
    out.append(rendu('### Definition of Ready\n' + b['Definition of Ready'] + '\n\n### Definition of Done\n' + b['Definition of Done']))
    out.append('</section><section class="saut">')
    out.append(h2('User workflows'))
    for titre, corps in w.items():
        if titre in ('_intro', 'Risques & hypothèses critiques', 'Prochaine action en 48 h'):
            continue
        out.append(f'<div class="groupe"><h3>{html.escape(titre)}</h3>{rendu(corps)}</div>')
    out.append('</section><section class="saut">')
    out.append(h2('Élaboration du processus'))
    for titre, corps in p.items():
        if titre in ('_intro', 'Risques & hypothèses critiques', 'Prochaine action en 48 h'):
            continue
        out.append(f'<h3>{html.escape(titre)}</h3>{rendu(corps)}')
    out.append('</section><section class="saut">')
    out.append(h2('Maquettes, prototype et charte graphique') + rendu(m['_intro'].split('\n', 2)[-1]))
    out.append(rendu('### Zoning des écrans clés\n' + m['1. Zoning des écrans clés']))
    tel = [('01-accueil-mobile.png', 'Accueil : suivi par numéro, démarches'), ('02-suivi-public-mobile.png', 'Suivi public : étape, service, retard'),
           ('03-mes-dossiers-mobile.png', 'Mes dossiers : progression par étape'), ('04-piece-manquante-mobile.png', 'Action requise : pièce manquante'),
           ('05-relance-mobile.png', 'Relance d\'un dossier en retard'), ('06-nouvelle-demande-mobile.png', 'Nouvelle demande : pièces et parcours')]
    out.append('<div class="saut"></div><h3>Écrans usager (mobile)</h3><div class="galerie-tel">' + ''.join(telephone(i, l) for i, l in tel) + '</div>')
    out.append('<h3>Écrans agent et pilotage (ordinateur)</h3>')
    out.append(navigateur('07-file-agent.png', 'File de travail de l\'agent : dossiers triés par urgence'))
    out.append('<div style="height:4mm"></div>' + navigateur('09-guichet-recu.png', 'Dépôt au guichet : reçu avec numéro et QR code'))
    out.append('<div class="saut"></div>' + navigateur('08-agent-validation.png', 'Validation d\'étape en 1 clic, timeline et journal d\'audit', coupe=True))
    out.append('<div style="height:4mm"></div>' + navigateur('10-pilotage.png', 'Tableau de bord de pilotage : retards par service, délai réel vs prévu', coupe=True))
    out.append(rendu('### Charte graphique\n' + m['3. Charte graphique']))
    out.append(rendu('### Accessibilité et sobriété\n' + m['4. Principes d\'accessibilité et de sobriété']))
    out.append(rendu('### Tests d\'utilisabilité prévus\n' + m['5. Tests d\'utilisabilité prévus']))
    out.append(action48('06-processus.md'))
    out.append(retenir([
        f'{len(must)} user stories « Must » livrées dans le MVP, découpées en 6 sprints de 2 semaines.',
        'Le parcours cible ramène l\'usager de 4–5 déplacements à 1 ou 2 [H] ; le SLA est suspendu pendant une pièce manquante.',
        "L'adoption par les agents est conçue dès le départ : action en moins de 10 s, champions, tableau de bord qui valorise la progression.",
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie D
def partie_d():
    s = sections('mvp/README.md')
    out = [garde('D', 'partie-d', 'La démonstration technique', "Ce n'est pas une maquette : un MVP qui fonctionne, testé de bout en bout.",
                 'Dossier mvp/ — React + Tailwind (PWA) · Node.js + Express · PostgreSQL · docker compose up')]
    out.append('<section>')
    out.append(h2('Scénario de démonstration'))
    etapes = [
        ('02-suivi-public-mobile.png', 'Suivi public', 'Le dossier SUI-2026-000001 est à l\'étape 2/3 « Instruction », au service de la nationalité, <strong>en retard de 5 jours</strong>. Aucun compte n\'est nécessaire, le nom est masqué.'),
        ('05-relance-mobile.png', 'L\'usager agit à distance', 'Awa se connecte par code SMS, <strong>relance</strong> le dossier en retard et répond à une demande de pièce manquante sans se déplacer.'),
        (None, 'L\'agent valide en 1 clic', 'Le dossier relancé passe en tête de la file du service, en rouge. L\'agent <strong>valide l\'étape</strong> : le dossier part au service suivant et Awa reçoit un SMS.'),
        ('09-guichet-recu.png', 'Dépôt au guichet', 'Pour un usager sans smartphone, l\'agent enregistre le dépôt et imprime un <strong>reçu avec numéro et QR code</strong>. Les notifications partent par SMS.'),
        ('10-pilotage.png', 'Pilotage', 'Le décideur voit les déplacements évités, les retards par service et, pour la première fois, le <strong>délai réel de chaque étape</strong> comparé au délai prévu.'),
    ]
    for k, (img, titre, txt) in enumerate(etapes, 1):
        if img is None:
            out.append(f'<div class="demo large"><div><div class="num">Étape {k}</div><h4>{titre}</h4><p>{txt}</p></div>{navigateur("07-file-agent.png", "File de travail du service de la nationalité")}</div>')
        elif 'mobile' in img:
            out.append(f'<div class="demo">{telephone(img, alt=titre)}<div><div class="num">Étape {k}</div><h4>{titre}</h4><p>{txt}</p></div></div>')
        else:
            out.append(f'<div class="demo large"><div><div class="num">Étape {k}</div><h4>{titre}</h4><p>{txt}</p></div>{navigateur(img, titre, coupe=True)}</div>')
    out.append('</section><section class="saut">')
    out.append(h2('Architecture, données, règles métier et API') + rendu(s['Architecture']))
    out.append(h2('Qualité et tests') + '<div class="chiffres" style="--n:3"><div class="chiffre"><b>7 / 7</b><span>scénarios de test de bout en bout réussis (API sur PostgreSQL réel)</span></div>'
               '<div class="chiffre"><b>0</b><span>erreur console lors du parcours complet joué dans un navigateur</span></div>'
               '<div class="chiffre o"><b>73 ko</b><span>poids de l\'application compressée (adaptée à la 3G)</span></div></div>')
    out.append(h2('Passer en production') + rendu(s['Passer en production (feuille de route technique)']))
    out.append(action48('mvp/README.md'))
    out.append(retenir([
        'Toutes les user stories « Must » sont implémentées : dépôt, suivi public, file agent, pièce manquante, relance, guichet, pilotage.',
        'Sécurité dès le MVP : code SMS haché et limité, droits par service, journal d\'audit immuable, suivi public anonymisé.',
        'Avant la production : passerelle SMS réelle, escalade automatique, USSD, audit de sécurité et hébergement souverain.',
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie E
def partie_e():
    s = sections('07-modele-financier/README.md')
    c = FIN['central']['synthese']
    ca3 = c["CHIFFRE D'AFFAIRES"][2]
    out = [garde('E', 'partie-e', 'Les finances', "Un modèle SaaS public, à l'équilibre vers le mois 36, résistant au scénario pessimiste.",
                 'Livrable 07 — Modèle financier 36 mois (Excel avec formules, 3 scénarios). Montants en FCFA hors taxes.')]
    out.append('<section>')
    out.append(h2('Chiffres clés — scénario central'))
    out.append(f'''<div class="chiffres" style="--n:4">
      <div class="chiffre"><b>{fcfa(c["CHIFFRE D'AFFAIRES"][2], 0)}</b><span>CA année 3</span></div>
      <div class="chiffre"><b>{c["Taux de marge brute"][2] * 100:.0f} %</b><span>marge brute année 3</span></div>
      <div class="chiffre o"><b>{fcfa(c["Financements cumulés"][0], 0)}</b><span>financements sur 36 mois</span></div>
      <div class="chiffre o"><b>≈ {c["Coût complet par demande suivie (année 3)"][0]:.0f}</b><span>FCFA de coût complet par demande suivie (année 3)</span></div></div>''')
    lignes = [("Communes clientes (fin d'année)", 'n'), ("Organismes nationaux clients (fin d'année)", 'n'), ("Demandes suivies dans l'année", 'n'),
              ('CA licences communes', 'm'), ('CA mise en place / intégration', 'm'), ('CA licences organismes', 'm'), ('CA premium usagers', 'm'), ('CA API B2B', 'm'),
              ("CHIFFRE D'AFFAIRES", 'M'), ('Marge brute', 'M'), ('Taux de marge brute', 'p'), ('Salaires', 'm'), ('Charges sociales', 'm'), ('EBITDA', 'M'),
              ("Trésorerie fin d'année", 'M'), ("Effectif fin d'année (ETP)", 'n')]
    def fmt(v, t):
        if t == 'p':
            return f'{v * 100:.0f} %'
        if t == 'n':
            return f'{v:,.0f}'.replace(',', ' ') if v == int(v) else f'{v:.1f}'.replace('.', ',')
        return fcfa(v)
    corps = ''.join(f'<tr><td>{"<strong>" + k + "</strong>" if t == "M" else k}</td>' + ''.join(f'<td style="text-align:right">{"<strong>" if t == "M" else ""}{fmt(v, t)}</td>' for v in c[k]) + '</tr>' for k, t in lignes)
    out.append('<h3>Compte de résultat simplifié</h3><table class="simple"><thead><tr><th>FCFA HT</th><th style="text-align:right">Année 1</th><th style="text-align:right">Année 2</th><th style="text-align:right">Année 3</th></tr></thead><tbody>' + corps + '</tbody></table>')
    out.append('<div class="graphe"><div class="titre">Chiffre d\'affaires et EBITDA par année (M FCFA, scénario central)</div>'
               + svg_barres([c["CHIFFRE D'AFFAIRES"], c['EBITDA']], ['Année 1', 'Année 2', 'Année 3'], [VERT, ORANGE])
               + f'<div class="legende"><span><i style="background:{VERT}"></i>Chiffre d\'affaires</span><span><i style="background:{ORANGE}"></i>EBITDA</span></div></div>')
    out.append('</section><section class="saut">')
    out.append(h2('Trésorerie et scénarios'))
    out.append('<div class="graphe"><div class="titre">Trésorerie de fin de mois sur 36 mois (FCFA)</div>'
               + svg_courbes([FIN[k]['treso'] for k in ('optimiste', 'central', 'pessimiste')], [VERT, ORANGE, ROUGE])
               + f'<div class="legende"><span><i style="background:{VERT}"></i>Optimiste</span><span><i style="background:{ORANGE}"></i>Central</span><span><i style="background:{ROUGE}"></i>Pessimiste</span></div></div>')
    out.append(rendu(s['Comparaison des scénarios']))
    out.append(h2('Hypothèses principales') + rendu(s['Hypothèses principales']))
    out.append(h2('Unit economics') + rendu(s['Unit economics (scénario central, année 3)']))
    out.append(h2('Risques financiers et parades') + rendu(s['Risques financiers et parades']))
    out.append(retenir([
        f"CA de {fcfa(ca3, 0)} FCFA en année 3, marge brute de {c['Taux de marge brute'][2] * 100:.0f} %, équilibre mensuel vers le mois 36.",
        'Premier levier : la vitesse de signature des communes ; second : les organismes nationaux (chacun pèse autant que 7 communes).',
        'Les montants sont des projections fondées sur des hypothèses [H] ; à faire valider par un expert-comptable avant toute levée.',
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie F
def partie_f():
    s = sections('10-organisation.md')
    out = [garde('F', 'partie-f', "L'organisation", "Une équipe produit, tech et terrain, organisée comme les meilleures startups.",
                 'Livrable 10 — Mission, organigrammes 0 / 12 / 36 mois, rôles, gouvernance OHADA, rituels, OKR, recrutement')]
    out.append('<section>')
    out.append(rendu(s['_intro']))
    for titre, corps in s.items():
        if titre in ('_intro', 'Risques & hypothèses critiques', 'Prochaine action en 48 h'):
            continue
        out.append(section_md(re.sub(r'^\d+\.\s*', '', titre), corps))
    out.append(action48('10-organisation.md'))
    out.append(retenir([
        '3 fondateurs aux responsabilités et métriques distinctes ; décisions irréversibles à l\'unanimité, après un mémo écrit.',
        'Squads autonomes par mission, pas de niveau hiérarchique avant 25 personnes ; 8 personnes au mois 12, 17 au mois 36.',
        'SAS de droit OHADA créée au CEPICI, vesting 4 ans avec 1 an de cliff, pool de 10 % pour les salariés clés.',
    ]))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Partie G
def partie_g():
    r = sections('README.md')
    out = [garde('G', 'partie-g', 'Mise sur le marché et feuille de route', "1 commune, puis 25 communes, puis l'État.",
                 'Phases de déploiement, canaux, plan d\'action J-30 → J-0, checklist « prêt pour le jury »')]
    out.append('<section>')
    out.append(h2('Les trois phases de déploiement'))
    phases = [('Mois 0–6', 'Pilote', "1 commune d'Abidjan + 1 tribunal ; 3 procédures ; gratuit ; mesure avant / après."),
              ('Mois 7–18', 'Preuve', 'Convention avec le ministère ; 12 communes ; 1er organisme national ; prix JNSP comme vitrine.'),
              ('Mois 19–36', 'Échelle', '25 communes ; API B2B ; USSD ; intérieur du pays avec des agents relais ; préparation UEMOA.')]
    out.append('<div class="frise" style="--n:3">' + ''.join(f'<div class="etape"><span class="pastille">{i}</span><div class="quand">{q}</div><h4>{n}</h4><p>{d}</p></div>' for i, (q, n, d) in enumerate(phases, 1)) + '</div>')
    out.append('<p><strong>Canaux :</strong> sponsor ministériel · associations de communes · affiches et QR dans les halls d\'attente · reçu de dépôt · radios de proximité · bailleurs GovTech.</p>')
    out.append(h2('Plan d\'action J-30 → J-0') + rendu(r['Plan d\'action J-30 → J-0']))
    out.append(h2('Checklist « Prêt pour le jury »') + rendu(r['Checklist « Prêt pour le jury »']))
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Risques
def risques():
    sources = [('01-etudes.md', 'Études', 'CPO'), ('02-business-model-canvas.md', 'Modèle économique', 'CEO'),
               ('03-product-vision-board.md', 'Vision produit', 'CPO'), ('04-product-backlog.md', 'Backlog', 'CTO'),
               ('05-user-workflows.md', 'Workflows', 'CPO'), ('06-processus.md', 'Processus', 'CPO'),
               ('07-modele-financier/README.md', 'Finances', 'CEO'), ('08-pitch-deck/README.md', 'Pitch', 'CEO'),
               ('09-maquettes-prototype.md', 'Maquettes', 'CPO'), ('mvp/README.md', 'MVP', 'CTO'), ('10-organisation.md', 'Organisation', 'CEO')]
    lignes = []
    for rel, nom, resp in sources:
        bloc = sections(rel).get('Risques & hypothèses critiques', '')
        for l in bloc.splitlines():
            mt = re.match(r'^\s*(?:\d+\.|-)\s+(.*)', l)
            if not mt:
                continue
            t = mt.group(1)
            m2 = re.match(r'\*\*(.+?)\*\*\s*(?:[:—–-]\s*)?(.*)', t)
            risque, detail = (m2.group(1), m2.group(2)) if m2 else (t, '')
            lignes.append(f'<tr><td>{nom}</td><td><strong>{inline(risque)}</strong></td><td>{inline(detail)}</td><td>{resp}</td></tr>')
    i, m = ancre(1, 'Risques consolidés', 'risques')
    return (f'<section class="partie" id="{i}">{m}<h2 style="margin-top:0">Risques consolidés</h2>'
            f'<p>Tous les risques et hypothèses critiques identifiés dans les livrables ({len(lignes)} au total), avec leur parade ou leur méthode de validation et le fondateur responsable. '
            f'La probabilité et l\'impact ne sont pas chiffrés ici : ils seront évalués par l\'équipe après la phase de découverte, plutôt que d\'avancer des notes non fondées.</p>'
            f'<table><thead><tr><th style="width:17mm">Domaine</th><th style="width:42mm">Risque / hypothèse</th><th>Détail, parade ou validation</th><th style="width:14mm">Resp.</th></tr></thead><tbody>{"".join(lignes)}</tbody></table></section>')


# ------------------------------------------------------------------ Annexes
GLOSSAIRE = [
    ('API', 'Interface qui permet à un autre logiciel (portail, banque) d\'échanger des données avec SUIVO.'),
    ('ARTCI', 'Autorité de Régulation des Télécommunications/TIC de Côte d\'Ivoire, autorité de protection des données personnelles.'),
    ('B2G / B2B2C / B2B', 'Vente à l\'administration / services aux usagers via l\'administration / vente aux entreprises.'),
    ('CEPICI', 'Centre de Promotion des Investissements en Côte d\'Ivoire : guichet unique de création d\'entreprise.'),
    ('EBITDA', 'Résultat d\'exploitation avant amortissements, intérêts et impôts.'),
    ('MoSCoW', 'Priorisation : Must (indispensable), Should, Could, Won\'t (pas maintenant).'),
    ('MVP', 'Minimum Viable Product : première version fonctionnelle qui sert à apprendre auprès des vrais utilisateurs.'),
    ('North Star', 'Indicateur unique qui mesure la valeur apportée (ici : déplacements évités par mois).'),
    ('OHADA', 'Organisation pour l\'Harmonisation en Afrique du Droit des Affaires (droit des sociétés commun).'),
    ('OKR', 'Objectives and Key Results : objectifs trimestriels et résultats mesurables associés.'),
    ('OTP', 'One-Time Password : code à usage unique envoyé par SMS pour se connecter.'),
    ('PWA', 'Progressive Web App : site web installable comme une application, utilisable hors connexion.'),
    ('RACI', 'Matrice des rôles : Réalise, Approuve, Consulté, Informé.'),
    ('RICE', 'Score de priorisation : (Portée × Impact × Confiance) / Effort.'),
    ('SaaS', 'Logiciel fourni en ligne par abonnement.'),
    ('SLA', 'Délai de traitement engagé pour une étape (ici en jours ouvrés).'),
    ('TAM / SAM / SOM', 'Marché total / marché adressable / part de marché atteignable à court terme.'),
    ('USSD', 'Service par code (*XXX#) qui fonctionne sur tous les téléphones, sans internet.'),
    ('Vesting', 'Acquisition progressive des actions d\'un fondateur ou salarié dans le temps.'),
]


def annexes():
    b = sections('04-product-backlog.md')
    j = sections('08-pitch-deck/README.md')
    out = [garde('', 'annexes', 'Annexes', 'Backlog complet, questions du jury, glossaire, hypothèses à valider, prompt maître.',
                 'A1 Backlog · A2 Questions du jury · A3 Glossaire · A4 Hypothèses [H] · A5 Prompt maître')]
    out.append('<section class="annexe">')
    out.append(h2('A1 — Backlog complet', 'annexe-backlog') + rendu(b['User stories (MVP = Must)']))
    out.append('</section><section class="annexe saut">')
    out.append(h2('A2 — Les 15 questions probables du jury', 'annexe-jury') + rendu(j['Les 15 questions les plus probables du jury']))
    out.append('</section><section class="annexe saut">')
    out.append(h2('A3 — Glossaire') + '<table class="simple"><tbody>' + ''.join(f'<tr><td style="width:32mm"><strong>{k}</strong></td><td>{v}</td></tr>' for k, v in GLOSSAIRE) + '</tbody></table>')
    hyp, vus = [], set()
    for rel in ('01-etudes.md', '06-processus.md', '07-modele-financier/README.md', '10-organisation.md', '02-business-model-canvas.md'):
        for l in lire(rel).splitlines():
            if '[H' in l and not l.startswith('>') and not l.startswith('|---'):
                t = l.lstrip('#').strip().strip('|').replace('|', ' — ')
                if t in vus:
                    continue
                vus.add(t)
                hyp.append(f'<tr><td style="width:30mm">{rel.split("/")[0]}</td><td>{inline(t)}</td></tr>')
    out.append(h2('A4 — Hypothèses à valider [H]') + '<p>Lignes des livrables qui contiennent une hypothèse marquée [H], à confirmer pendant la phase de découverte.</p>'
               + '<table class="simple"><tbody>' + ''.join(hyp) + '</tbody></table>')
    out.append('</section><section class="annexe saut">')
    prompt = lire('00-PROMPT-MAITRE.md')
    bloc = re.search(r'```text\n(.*?)```', prompt, re.S).group(1)
    out.append(h2('A5 — Prompt maître', 'annexe-prompt') + '<p>Le prompt à partir duquel l\'ensemble des livrables a été produit.</p><pre>' + html.escape(bloc) + '</pre>')
    out.append('</section>')
    return ''.join(out)


# ------------------------------------------------------------------ Assemblage
def main():
    corps = [resume(), partie_a(), partie_b(), partie_c(), partie_d(), partie_e(), partie_f(), partie_g(), risques(), annexes()]
    doc = (f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>SUIVO — Dossier de candidature JNSP Sprint Digital 2026</title>'
           f'<meta name="author" content="SUIVO"><meta name="description" content="Dossier complet du projet SUIVO : suivi des demandes administratives.">'
           f'<link rel="stylesheet" href="styles.css"></head><body>'
           f'{couverture()}{sommaire()}{"".join(corps)}</body></html>')
    (ICI / 'dossier.html').write_text(doc, encoding='utf-8')
    (ICI / 'toc.json').write_text(json.dumps([t[1] for t in TOC]))
    print(f'dossier.html : {len(TOC)} entrées de sommaire')


if __name__ == '__main__':
    main()
