"""Génère le modèle financier SUIVO (36 mois) au format Excel, avec formules.

Usage : python3 generer_modele.py  -> modele-financier-suivo.xlsx
Toutes les hypothèses (cellules en bleu) sont modifiables dans l'onglet « Hypothèses » ;
le scénario se choisit dans la cellule C4 (1 = pessimiste, 2 = central, 3 = optimiste).
Montants en FCFA hors taxes.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import LineChart, BarChart, Reference

MONTHS = 36
BLUE = Font(color="0000FF")
BOLD = Font(bold=True)
HEAD = Font(bold=True, color="FFFFFF")
HEAD_FILL = PatternFill("solid", fgColor="1F5C3A")
SECTION_FILL = PatternFill("solid", fgColor="E8F0EA")
TOTAL_FILL = PatternFill("solid", fgColor="FCE9D9")
THIN = Border(top=Side(style="thin", color="999999"))
FCFA = '#,##0;[Red]-#,##0'

wb = Workbook()

# ---------------------------------------------------------------- Hypothèses
h = wb.active
h.title = "Hypothèses"
h.column_dimensions["A"].width = 4
h.column_dimensions["B"].width = 58
for c in "CDEF":
    h.column_dimensions[c].width = 16
h["B1"] = "SUIVO — Modèle financier 36 mois — Hypothèses (FCFA HT)"
h["B1"].font = Font(bold=True, size=14)
h["B2"] = "Cellules bleues = hypothèses modifiables. Marquées [H] dans le dossier : à valider pendant le pilote."

H = {}  # nom -> adresse absolue
row = 4


def section(title):
    global row
    row += 1
    h.cell(row=row, column=2, value=title).font = BOLD
    for col in range(2, 7):
        h.cell(row=row, column=col).fill = SECTION_FILL
    row += 1


def inp(name, label, value, fmt=FCFA, formula=False):
    global row
    h.cell(row=row, column=2, value=label)
    c = h.cell(row=row, column=3, value=value)
    if not formula:
        c.font = BLUE
    c.number_format = fmt
    H[name] = f"Hypothèses!$C${row}"
    row += 1


h["B4"] = "Scénario actif (1 = pessimiste, 2 = central, 3 = optimiste)"
h["C4"] = 2
h["C4"].font = Font(bold=True, color="0000FF")
H["scen"] = "Hypothèses!$C$4"
row = 5

section("Multiplicateurs de scénario")
h.cell(row=row, column=2, value="Paramètre")
for i, t in enumerate(["Pessimiste", "Central", "Optimiste", "Actif"]):
    h.cell(row=row, column=3 + i, value=t).font = BOLD
row += 1
for name, label, vals in [
    ("m_acq", "Multiplicateur d'acquisition clients", (0.6, 1.0, 1.4)),
    ("m_adop", "Multiplicateur d'adoption usagers (premium, API)", (0.6, 1.0, 1.3)),
    ("m_prix", "Multiplicateur de prix", (0.85, 1.0, 1.1)),
    ("delai", "Délai de paiement de l'État (mois)", (6, 3, 2)),
]:
    h.cell(row=row, column=2, value=label)
    for i, v in enumerate(vals):
        h.cell(row=row, column=3 + i, value=v).font = BLUE
    h.cell(row=row, column=6, value=f"=CHOOSE($C$4,C{row},D{row},E{row})").font = BOLD
    H[name] = f"Hypothèses!$F${row}"
    row += 1

section("Acquisition des administrations")
inp("pilot_end", "Fin du pilote gratuit (mois)", 6, "0")
inp("com_y1", "Nouvelles communes / mois — année 1 (après pilote)", 0.5, "0.00")
inp("com_y2", "Nouvelles communes / mois — année 2", 0.75, "0.00")
inp("com_y3", "Nouvelles communes / mois — année 3", 1.0, "0.00")
inp("org1", "Mois de signature du 1er organisme national", 13, "0")
inp("org2", "Mois de signature du 2e organisme national", 25, "0")

section("Prix (base, avant multiplicateur)")
inp("p_com", "Licence SaaS commune — prix moyen annuel", 6_000_000)
inp("setup_com", "Frais de mise en place commune (one-shot)", 2_000_000)
inp("p_org", "Licence SaaS organisme national — annuel", 40_000_000)
inp("setup_org", "Frais d'intégration organisme (one-shot)", 15_000_000)
inp("p_prem", "Panier moyen service premium usager", 1_000)
inp("p_api", "Prix par appel API B2B", 100)

section("Volumes")
inp("dem_com", "Demandes suivies / mois par commune", 2_000, "#,##0")
inp("dem_org", "Demandes suivies / mois par organisme", 8_000, "#,##0")
inp("dem_pilot", "Demandes suivies / mois pendant le pilote", 1_000, "#,##0")
inp("tx_prem", "Taux d'usagers achetant un service premium", 0.03, "0.0%")
inp("api_start", "Mois de lancement de l'API B2B", 19, "0")
inp("tx_api", "Appels API / demande suivie", 0.10, "0.00")

section("Coûts variables")
inp("sms_dem", "SMS / WhatsApp par demande", 3, "0")
inp("p_sms", "Coût unitaire SMS", 15)
inp("infra_fix", "Hébergement & sécurité — fixe mensuel", 300_000)
inp("infra_var", "Hébergement — coût par demande", 5)
inp("part_prem", "Part reversée aux partenaires (livraison, paiement)", 0.30, "0%")
inp("dep_com", "Déploiement & formation par nouvelle commune", 1_000_000)
inp("dep_org", "Déploiement & formation par nouvel organisme", 5_000_000)
inp("charges", "Charges sociales patronales (% salaires) [H]", 0.25, "0%")

section("Coûts fixes mensuels par année")
h.cell(row=row, column=2, value="Poste")
for i, t in enumerate(["Année 1", "Année 2", "Année 3"]):
    h.cell(row=row, column=3 + i, value=t).font = BOLD
row += 1
for name, label, vals in [
    ("mkt", "Marketing & communication", (500_000, 1_500_000, 2_500_000)),
    ("fg", "Frais généraux (bureau, juridique, comptable, assurances)", (600_000, 900_000, 1_200_000)),
]:
    h.cell(row=row, column=2, value=label)
    for i, v in enumerate(vals):
        c = h.cell(row=row, column=3 + i, value=v)
        c.font = BLUE
        c.number_format = FCFA
    H[name] = row
    row += 1

section("Financement (hors exploitation)")
inp("apport", "Apport des fondateurs (mois 1)", 8_000_000)
inp("prix_jnsp", "Prix / subvention concours & incubateur (mois 3) [H]", 10_000_000)
inp("preseed", "Pré-amorçage : business angels / Love money (mois 4)", 75_000_000)
inp("grant", "Subvention bailleur GovTech (mois 10) [H]", 50_000_000)
inp("seed", "Levée d'amorçage (mois 15)", 250_000_000)
inp("seed_m", "Mois de la levée d'amorçage", 15, "0")

# ---------------------------------------------------------------- Effectifs
e = wb.create_sheet("Effectifs")
e.column_dimensions["A"].width = 38
for c, w in zip("BCDE", (18, 16, 18, 40)):
    e.column_dimensions[c].width = w
hdr = ["Poste", "Salaire brut mensuel", "Mois d'arrivée", "Salaire post-levée", "Remarque"]
for i, t in enumerate(hdr):
    c = e.cell(row=1, column=1 + i, value=t)
    c.font = HEAD
    c.fill = HEAD_FILL
staff = [
    ("CEO — co-fondateur", 300_000, 1, 1_000_000, "Rémunération réduite jusqu'à la levée"),
    ("CTO — co-fondateur", 300_000, 1, 1_100_000, ""),
    ("CPO — co-fondateur", 300_000, 1, 1_000_000, ""),
    ("Développeur·se full-stack 1", 600_000, 4, 750_000, ""),
    ("Développeur·se full-stack 2", 600_000, 7, 750_000, ""),
    ("Product designer UX/UI", 500_000, 7, 650_000, ""),
    ("Responsable déploiement terrain 1", 350_000, 7, 450_000, "Formation agents, support"),
    ("Juriste / DPO (temps partiel)", 300_000, 10, 400_000, "Conformité ARTCI"),
    ("Responsable grands comptes B2G", 700_000, 13, 900_000, ""),
    ("Responsable déploiement terrain 2", 350_000, 13, 450_000, ""),
    ("Développeur·se full-stack 3", 750_000, 16, 750_000, ""),
    ("QA / testeur·se", 450_000, 16, 450_000, ""),
    ("Data analyst", 600_000, 19, 600_000, "Tableaux de bord, estimation des délais"),
    ("Support usager / community manager", 300_000, 19, 300_000, ""),
    ("Développeur·se mobile/USSD", 750_000, 25, 750_000, ""),
    ("Responsable déploiement terrain 3", 450_000, 25, 450_000, "Intérieur du pays"),
    ("Responsable partenariats B2B / API", 800_000, 25, 800_000, ""),
]
for r, (p, s, m, s2, rem) in enumerate(staff, start=2):
    e.cell(row=r, column=1, value=p)
    for col, v, f in ((2, s, FCFA), (3, m, "0"), (4, s2, FCFA)):
        c = e.cell(row=r, column=col, value=v)
        c.font = BLUE
        c.number_format = f
    e.cell(row=r, column=5, value=rem)
STAFF_LAST = 1 + len(staff)

# ---------------------------------------------------------------- Mensuel
m = wb.create_sheet("Mensuel")
m.column_dimensions["A"].width = 46
m.freeze_panes = "B3"
m["A1"] = "Projection mensuelle (FCFA HT)"
m["A1"].font = Font(bold=True, size=13)
m.cell(row=2, column=1, value="Mois").font = HEAD
m.cell(row=2, column=1).fill = HEAD_FILL
for k in range(1, MONTHS + 1):
    c = m.cell(row=2, column=1 + k, value=k)
    c.font = HEAD
    c.fill = HEAD_FILL
    m.column_dimensions[get_column_letter(1 + k)].width = 13

R = {}
mrow = 3


def line(name, label, f, fmt=FCFA, style=None):
    """f(col_letter, prev_col_letter, k) -> formule Excel."""
    global mrow
    R[name] = mrow
    m.cell(row=mrow, column=1, value=label)
    for k in range(1, MONTHS + 1):
        col = get_column_letter(1 + k)
        prev = get_column_letter(k) if k > 1 else None
        c = m.cell(row=mrow, column=1 + k, value=f(col, prev, k))
        c.number_format = fmt
        if style == "total":
            c.font = BOLD
            c.fill = TOTAL_FILL
            c.border = THIN
    if style == "total":
        m.cell(row=mrow, column=1).font = BOLD
        m.cell(row=mrow, column=1).fill = TOTAL_FILL
    R[name] = mrow
    mrow += 1


def msec(title):
    global mrow
    mrow += 1
    m.cell(row=mrow, column=1, value=title).font = BOLD
    m.cell(row=mrow, column=1).fill = SECTION_FILL
    mrow += 1


def yearpick(name, col):
    """Valeur année 1/2/3 d'une ligne de coûts fixes selon le mois de la colonne."""
    r = H[name]
    return f"CHOOSE(INT(({col}$2-1)/12)+1,Hypothèses!$C${r},Hypothèses!$D${r},Hypothèses!$E${r})"


msec("Clients")
newcom = (
    f"IF({{c}}$2<={H['pilot_end']},0,IF({{c}}$2<=12,{H['com_y1']},IF({{c}}$2<=24,{H['com_y2']},{H['com_y3']})))*{H['m_acq']}"
)
line("com_new", "Nouvelles communes (fractionnaire = probabilité)", lambda c, p, k: "=" + newcom.format(c=c), "0.00")
line("com_cum", "Communes clientes (cumul)",
     lambda c, p, k: f"={c}{R['com_new']}" if k == 1 else f"={p}{R['com_cum']}+{c}{R['com_new']}", "0.00")
line("org_new", "Nouveaux organismes nationaux",
     lambda c, p, k: f"=IF({c}$2=ROUND({H['org1']}/{H['m_acq']},0),1,0)+IF({c}$2=ROUND({H['org2']}/{H['m_acq']},0),1,0)", "0")
line("org_cum", "Organismes clients (cumul)",
     lambda c, p, k: f"={c}{R['org_new']}" if k == 1 else f"={p}{R['org_cum']}+{c}{R['org_new']}", "0")
line("dem", "Demandes suivies / mois",
     lambda c, p, k: f"=IF({c}$2<={H['pilot_end']},{H['dem_pilot']},{H['dem_pilot']}+{c}{R['com_cum']}*{H['dem_com']}+{c}{R['org_cum']}*{H['dem_org']})",
     "#,##0")

msec("Chiffre d'affaires (reconnu)")
line("ca_com", "Licences communes",
     lambda c, p, k: f"={c}{R['com_cum']}*{H['p_com']}/12*{H['m_prix']}")
line("ca_setup", "Mise en place / intégration",
     lambda c, p, k: f"=({c}{R['com_new']}*{H['setup_com']}+{c}{R['org_new']}*{H['setup_org']})*{H['m_prix']}")
line("ca_org", "Licences organismes nationaux",
     lambda c, p, k: f"={c}{R['org_cum']}*{H['p_org']}/12*{H['m_prix']}")
line("ca_prem", "Services premium usagers (B2B2C)",
     lambda c, p, k: f"=IF({c}$2<={H['pilot_end']},0,{c}{R['dem']}*{H['tx_prem']}*{H['m_adop']}*{H['p_prem']})")
line("ca_api", "API B2B",
     lambda c, p, k: f"=IF({c}$2<{H['api_start']},0,{c}{R['dem']}*{H['tx_api']}*{H['m_adop']}*{H['p_api']}*{H['m_prix']})")
line("ca", "CHIFFRE D'AFFAIRES TOTAL",
     lambda c, p, k: f"=SUM({c}{R['ca_com']}:{c}{R['ca_api']})", style="total")

msec("Coûts")
line("c_sms", "SMS / WhatsApp", lambda c, p, k: f"={c}{R['dem']}*{H['sms_dem']}*{H['p_sms']}")
line("c_infra", "Hébergement & sécurité", lambda c, p, k: f"={H['infra_fix']}+{c}{R['dem']}*{H['infra_var']}")
line("c_part", "Reversement partenaires premium", lambda c, p, k: f"={c}{R['ca_prem']}*{H['part_prem']}")
line("c_dep", "Déploiement & formation",
     lambda c, p, k: f"={c}{R['com_new']}*{H['dep_com']}+{c}{R['org_new']}*{H['dep_org']}")
line("marge", "MARGE BRUTE",
     lambda c, p, k: f"={c}{R['ca']}-SUM({c}{R['c_sms']}:{c}{R['c_dep']})", style="total")
line("c_sal", "Salaires bruts",
     lambda c, p, k: (
         f"=SUMPRODUCT((Effectifs!$C$2:$C${STAFF_LAST}<={c}$2)*(Effectifs!$B$2:$B${STAFF_LAST}*({c}$2<{H['seed_m']})"
         f"+Effectifs!$D$2:$D${STAFF_LAST}*({c}$2>={H['seed_m']})))"
     ))
line("c_chg", "Charges sociales", lambda c, p, k: f"={c}{R['c_sal']}*{H['charges']}")
line("c_mkt", "Marketing", lambda c, p, k: "=" + yearpick("mkt", c))
line("c_fg", "Frais généraux", lambda c, p, k: "=" + yearpick("fg", c))
line("ebitda", "EBITDA", lambda c, p, k: f"={c}{R['marge']}-SUM({c}{R['c_sal']}:{c}{R['c_fg']})", style="total")
line("ebitda_cum", "EBITDA cumulé",
     lambda c, p, k: f"={c}{R['ebitda']}" if k == 1 else f"={p}{R['ebitda_cum']}+{c}{R['ebitda']}")
from openpyxl.utils import get_column_letter as _gcl
line("ebitda_pos", "EBITDA positif jusqu'à M36 ? (1 = oui)",
     lambda c, p, k: f"=IF({c}{R['ebitda']}>0,1,0)" if k == MONTHS
     else f"=IF(AND({c}{R['ebitda']}>0,{_gcl(2 + k)}{R['ebitda_pos']}=1),1,0)", "0")
line("effectif", "Effectif (ETP)",
     lambda c, p, k: f"=COUNTIF(Effectifs!$C$2:$C${STAFF_LAST},\"<=\"&{c}$2)", "0")

msec("Trésorerie")
b2g = f"{{c}}{R['ca_com']}+{{c}}{R['ca_setup']}+{{c}}{R['ca_org']}"
line("enc_b2g", "Encaissements B2G (avec délai de paiement de l'État)",
     lambda c, p, k: (
         f"=IF({c}$2-{H['delai']}<1,0,INDEX($B{R['ca_com']}:$AK{R['ca_com']},1,{c}$2-{H['delai']})"
         f"+INDEX($B{R['ca_setup']}:$AK{R['ca_setup']},1,{c}$2-{H['delai']})"
         f"+INDEX($B{R['ca_org']}:$AK{R['ca_org']},1,{c}$2-{H['delai']}))"
     ))
line("enc_b2c", "Encaissements premium + API (immédiats, Mobile Money)",
     lambda c, p, k: f"={c}{R['ca_prem']}+{c}{R['ca_api']}")
line("decaiss", "Décaissements d'exploitation",
     lambda c, p, k: f"=SUM({c}{R['c_sms']}:{c}{R['c_dep']})+SUM({c}{R['c_sal']}:{c}{R['c_fg']})")
line("fin", "Financements reçus",
     lambda c, p, k: (
         f"=IF({c}$2=1,{H['apport']},0)+IF({c}$2=3,{H['prix_jnsp']},0)+IF({c}$2=4,{H['preseed']},0)"
         f"+IF({c}$2=10,{H['grant']},0)+IF({c}$2={H['seed_m']},{H['seed']},0)"
     ))
line("flux", "Flux net du mois",
     lambda c, p, k: f"={c}{R['enc_b2g']}+{c}{R['enc_b2c']}-{c}{R['decaiss']}+{c}{R['fin']}")
line("treso", "TRÉSORERIE FIN DE MOIS",
     lambda c, p, k: f"={c}{R['flux']}" if k == 1 else f"={p}{R['treso']}+{c}{R['flux']}", style="total")

# ---------------------------------------------------------------- Synthèse annuelle
s = wb.create_sheet("Synthèse", 0)
s.column_dimensions["A"].width = 44
for c in "BCDE":
    s.column_dimensions[c].width = 18
s["A1"] = "SUIVO — Synthèse financière (FCFA HT)"
s["A1"].font = Font(bold=True, size=14)
s["A2"] = "=\"Scénario actif : \"&CHOOSE(Hypothèses!$C$4,\"Pessimiste\",\"Central\",\"Optimiste\")"
for i, t in enumerate(["Indicateur", "Année 1", "Année 2", "Année 3"]):
    c = s.cell(row=4, column=1 + i, value=t)
    c.font = HEAD
    c.fill = HEAD_FILL
ranges = [("B", "M"), ("N", "Y"), ("Z", "AK")]
srow = 5
S = {}


def sline(name, label, kind="sum", src=None, fmt=FCFA, bold=False):
    global srow
    s.cell(row=srow, column=1, value=label)
    for i, (a, b) in enumerate(ranges):
        r = R[src or name]
        if kind == "sum":
            f = f"=SUM(Mensuel!{a}{r}:{b}{r})"
        elif kind == "end":
            f = f"=Mensuel!{b}{r}"
        else:
            f = kind(i)
        c = s.cell(row=srow, column=2 + i, value=f)
        c.number_format = fmt
        if bold:
            c.font = BOLD
    if bold:
        s.cell(row=srow, column=1).font = BOLD
    S[name] = srow
    srow += 1


sline("com_cum", "Communes clientes (fin d'année)", "end", fmt="0")
sline("org_cum", "Organismes nationaux clients (fin d'année)", "end", fmt="0")
sline("dem", "Demandes suivies dans l'année", fmt="#,##0")
sline("ca_com", "CA licences communes")
sline("ca_setup", "CA mise en place / intégration")
sline("ca_org", "CA licences organismes")
sline("ca_prem", "CA premium usagers")
sline("ca_api", "CA API B2B")
sline("ca", "CHIFFRE D'AFFAIRES", bold=True)
sline("marge", "Marge brute", bold=True)
s.cell(row=srow, column=1, value="Taux de marge brute")
for i in range(3):
    col = get_column_letter(2 + i)
    s.cell(row=srow, column=2 + i, value=f"=IFERROR({col}{S['marge']}/{col}{S['ca']},0)").number_format = "0%"
srow += 1
sline("c_sal", "Salaires")
sline("c_chg", "Charges sociales")
sline("ebitda", "EBITDA", bold=True)
sline("treso", "Trésorerie fin d'année", "end", bold=True)
sline("effectif", "Effectif fin d'année (ETP)", "end", fmt="0")
srow += 1
s.cell(row=srow, column=1, value="Indicateurs clés").font = BOLD
srow += 1
kpis = [
    ("Trésorerie minimale sur 36 mois", f"=MIN(Mensuel!B{R['treso']}:AK{R['treso']})", FCFA),
    ("Point mort : 1er mois d'EBITDA durablement positif",
     f"=IFERROR(MATCH(1,Mensuel!B{R['ebitda_pos']}:AK{R['ebitda_pos']},0),\"> 36\")", "0"),
    ("Financements cumulés", f"=SUM(Mensuel!B{R['fin']}:AK{R['fin']})", FCFA),
    ("Coût complet par demande suivie (année 3)",
     f"=IFERROR((SUM(Mensuel!Z{R['c_sms']}:AK{R['c_dep']})+SUM(Mensuel!Z{R['c_sal']}:AK{R['c_fg']}))/D{S['dem']},0)", FCFA),
    ("CA moyen par administration cliente (année 3)",
     f"=IFERROR((D{S['ca_com']}+D{S['ca_org']}+D{S['ca_setup']})/(D{S['com_cum']}+D{S['org_cum']}),0)", FCFA),
    ("Coût d'acquisition + déploiement d'une commune",
     f"=Hypothèses!$C${int(H['dep_com'].split('$')[-1])}", FCFA),
]
for label, f, fmt in kpis:
    s.cell(row=srow, column=1, value=label)
    c = s.cell(row=srow, column=2, value=f)
    c.number_format = fmt
    c.font = BOLD
    srow += 1

# Graphiques
ch = BarChart()
ch.title = "Chiffre d'affaires vs EBITDA par année"
ch.add_data(Reference(s, min_col=1, max_col=4, min_row=S["ca"], max_row=S["ca"]), from_rows=True, titles_from_data=True)
ch.add_data(Reference(s, min_col=1, max_col=4, min_row=S["ebitda"], max_row=S["ebitda"]), from_rows=True, titles_from_data=True)
ch.set_categories(Reference(s, min_col=2, max_col=4, min_row=4))
ch.height, ch.width = 7, 16
s.add_chart(ch, "F4")

lc = LineChart()
lc.title = "Trésorerie mensuelle"
lc.add_data(Reference(m, min_col=1, max_col=1 + MONTHS, min_row=R["treso"], max_row=R["treso"]), from_rows=True, titles_from_data=True)
lc.set_categories(Reference(m, min_col=2, max_col=1 + MONTHS, min_row=2))
lc.height, lc.width = 7, 16
s.add_chart(lc, "F20")

wb.save("modele-financier-suivo.xlsx")
print("OK -> modele-financier-suivo.xlsx")
