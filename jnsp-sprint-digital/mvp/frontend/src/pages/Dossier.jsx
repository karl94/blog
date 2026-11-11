import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import Timeline, { Historique, Resume } from '../components/Timeline.jsx';

export default function Dossier() {
  const { numero } = useParams();
  const [params] = useSearchParams();
  const { token, user } = useAuth();
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [texte, setTexte] = useState('');
  const estAgent = ['agent', 'admin'].includes(user?.role);

  const charger = useCallback(() => api(`/demandes/${numero}`, { token }).then(setD).catch((e) => setErreur(e.message)), [numero, token]);
  useEffect(() => { charger(); }, [charger]);

  async function action(chemin, body, ok) {
    setErreur(''); setMessage('');
    try {
      const r = await api(chemin, { method: 'POST', token, body });
      setMessage(r.message || ok); setTexte(''); await charger();
    } catch (e) { setErreur(e.message); }
  }

  if (!d) return erreur ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p> : <p>Chargement…</p>;
  const actif = ['SOUMIS', 'EN_COURS'].includes(d.statut);
  const base = `/agent/demandes/${d.numero}`;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to={estAgent ? '/agent' : '/mes-dossiers'} className="text-sm text-vert-700 underline">← Retour</Link>
      {params.get('nouveau') && (
        <p className="rounded-xl bg-vert-50 p-3 text-vert-800">
          ✓ Demande enregistrée. Notez votre numéro : <strong className="font-mono">{d.numero}</strong> — un SMS de confirmation vous a été envoyé.
        </p>
      )}
      <Resume d={d} />
      {estAgent && d.usager_telephone && <p className="text-sm text-slate-600">Usager : {d.usager} · {d.usager_telephone}</p>}

      {/* Actions usager */}
      {!estAgent && d.statut === 'ATTENTE_USAGER' && (
        <form className="carte space-y-2 border-orange-200 bg-orange-50" onSubmit={(e) => { e.preventDefault(); action(`/demandes/${d.numero}/repondre`, { commentaire: texte }, 'Réponse envoyée, votre dossier reprend.'); }}>
          <label htmlFor="rep" className="etiquette">Votre réponse au service</label>
          <textarea id="rep" className="champ" rows={3} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Ex. : pièce déposée au guichet le 12/11, ou précisions…" required />
          <button className="btn-alerte w-full">Envoyer ma réponse</button>
        </form>
      )}
      {!estAgent && actif && (
        <div className="carte flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            {d.peut_relancer ? 'Le délai prévu est dépassé : vous pouvez alerter le service responsable.' : 'La relance est possible uniquement si le délai de l\'étape est dépassé (1 fois / 48 h).'}
          </p>
          <button className="btn-secondaire" disabled={!d.peut_relancer} onClick={() => action(`/demandes/${d.numero}/relancer`, undefined, 'Relance envoyée.')}>Relancer</button>
        </div>
      )}

      {/* Actions agent */}
      {estAgent && actif && (
        <div className="carte space-y-3">
          <h3 className="font-semibold">Traiter l'étape « {d.etape_courante.nom} »</h3>
          <button className="btn-primaire w-full" onClick={() => action(`${base}/valider`, undefined, 'Étape validée — l\'usager est notifié.')}>
            ✓ Valider l'étape{d.etape_ordre === d.etapes.length ? ' (document prêt)' : ' et transmettre'}
          </button>
          <label htmlFor="msg" className="etiquette">Message (pièce manquante ou motif de rejet)</label>
          <textarea id="msg" className="champ" rows={2} value={texte} onChange={(e) => setTexte(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-alerte" onClick={() => action(`${base}/piece-manquante`, { message: texte }, 'Pièce demandée — SLA suspendu.')}>Pièce manquante</button>
            <button className="btn-secondaire text-red-700" onClick={() => action(`${base}/rejeter`, { motif: texte }, 'Dossier rejeté.')}>Rejeter</button>
          </div>
        </div>
      )}
      {estAgent && d.statut === 'PRET' && (
        <button className="btn-primaire w-full" onClick={() => action(`${base}/remettre`, undefined, 'Document remis, dossier clôturé.')}>Remettre le document à l'usager</button>
      )}

      {message && <p role="status" className="rounded-xl bg-vert-50 p-3 text-vert-800">{message}</p>}
      {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
      <Timeline d={d} />
      <Historique evenements={d.historique} />
    </div>
  );
}
