import { NIVEAUX, STATUTS, dateFr, delaiRestant } from '../api';

export function BadgeStatut({ statut }) {
  const s = STATUTS[statut];
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.classe}`}>{s.libelle}</span>;
}

export function BadgeNiveau({ niveau }) {
  if (!niveau) return null;
  const n = NIVEAUX[niveau];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${n.classe}`}>
      <span className={`h-2 w-2 rounded-full ${n.point}`} aria-hidden /> {n.libelle}
    </span>
  );
}

// Résumé « comme un colis » : la réponse à « où en est mon dossier ? » en 3 secondes
export function Resume({ d }) {
  const e = d.etape_courante;
  let titre; let detail;
  if (d.statut === 'PRET') { titre = 'Votre dossier est finalisé'; detail = `Document, paiement ou décision à récupérer : ${d.etapes[0].service}, ${d.etapes[0].organisme}`; }
  else if (d.statut === 'RETIRE') { titre = 'Dossier clôturé'; detail = 'La démarche est terminée.'; }
  else if (d.statut === 'REJETE') { titre = 'Dossier rejeté'; detail = d.motif_rejet; }
  else if (d.statut === 'ATTENTE_USAGER') { titre = 'Action requise de votre part'; detail = d.message_attente; }
  else { titre = `Étape ${e.ordre}/${d.etapes.length} : ${e.nom}`; detail = `Chez : ${e.service} — ${e.organisme}`; }
  return (
    <div className="carte">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-slate-500">{d.numero}</span>
        <BadgeStatut statut={d.statut} />
        {e?.niveau && <BadgeNiveau niveau={e.niveau} />}
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900">{titre}</h2>
      <p className="mt-1 text-slate-700">{detail}</p>
      {['SOUMIS', 'EN_COURS'].includes(d.statut) && e?.echeance && (
        <p className="mt-2 text-sm text-slate-600">
          Échéance de l'étape : <strong>{dateFr(e.echeance)}</strong> ({delaiRestant(e.echeance)})
        </p>
      )}
      <p className="mt-1 text-sm text-slate-500">{d.procedure.nom} · déposé le {dateFr(d.cree_le)} · {d.canal === 'guichet' ? 'au guichet' : 'en ligne'}</p>
    </div>
  );
}

export default function Timeline({ d }) {
  const icone = { fait: '✓', en_cours: '•', a_venir: '' };
  const couleur = {
    fait: 'bg-vert-600 text-white border-vert-600',
    en_cours: d.statut === 'ATTENTE_USAGER' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-vert-700 border-vert-600 ring-4 ring-vert-100',
    a_venir: 'bg-white border-slate-300',
  };
  return (
    <ol className="carte" aria-label="Étapes du dossier">
      {d.etapes.map((e, i) => (
        <li key={e.ordre} className="relative flex gap-3 pb-5 last:pb-0">
          {i < d.etapes.length - 1 && <span className={`absolute left-[15px] top-8 h-full w-0.5 ${e.etat === 'fait' ? 'bg-vert-600' : 'bg-slate-200'}`} aria-hidden />}
          <span className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${couleur[e.etat]}`}>
            {icone[e.etat] || e.ordre}
          </span>
          <div className="min-w-0">
            <p className={`font-semibold ${e.etat === 'a_venir' ? 'text-slate-500' : 'text-slate-900'}`}>{e.nom}</p>
            <p className="text-sm text-slate-600">{e.service} · {e.organisme}</p>
            <p className="text-xs text-slate-500">
              Délai prévu : {e.sla_jours} j ouvré{e.sla_jours > 1 ? 's' : ''}
              {e.validee_le && <> · validée le {dateFr(e.validee_le, true)}</>}
            </p>
          </div>
        </li>
      ))}
      <li className="flex gap-3 pt-5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm ${['PRET', 'RETIRE'].includes(d.statut) ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-300'}`}>★</span>
        <p className={`self-center font-semibold ${['PRET', 'RETIRE'].includes(d.statut) ? 'text-slate-900' : 'text-slate-500'}`}>Dossier finalisé</p>
      </li>
    </ol>
  );
}

export function Historique({ evenements }) {
  const libelles = {
    DEPOT: 'Dossier déposé', ETAPE_VALIDEE: 'Étape validée', PIECE_MANQUANTE: 'Pièce demandée',
    REPONSE_USAGER: 'Réponse de l\'usager', RELANCE: 'Relance', PRET: 'Dossier finalisé', RETIRE: 'Dossier clôturé', REJET: 'Rejet',
  };
  return (
    <div className="carte">
      <h3 className="mb-2 font-semibold">Historique (journal d'audit)</h3>
      <ul className="space-y-2 text-sm">
        {[...evenements].reverse().map((e, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-28 shrink-0 text-slate-500">{dateFr(e.cree_le, true)}</span>
            <span>
              <strong>{libelles[e.type] || e.type}</strong>
              {e.commentaire && <> — {e.commentaire}</>}
              {e.acteur && <span className="text-slate-500"> · {e.acteur}</span>}
              {e.dans_les_delais === false && <span className="ml-1 text-red-600">(hors délai)</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
