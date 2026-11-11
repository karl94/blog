import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, delaiRestant } from '../api';
import { useAuth } from '../auth.jsx';
import { BadgeNiveau, BadgeStatut } from '../components/Timeline.jsx';

export default function MesDossiers() {
  const { token, user } = useAuth();
  const [dossiers, setDossiers] = useState(null);
  const [erreur, setErreur] = useState('');
  useEffect(() => { api('/demandes', { token }).then(setDossiers).catch((e) => setErreur(e.message)); }, [token]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm text-slate-500">Bonjour {user?.nom || ''}</p>
          <h1 className="text-2xl font-bold">Mes dossiers</h1>
        </div>
        <Link to="/nouvelle-demande" className="btn-primaire">+ Nouvelle demande</Link>
      </div>
      {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
      {dossiers?.length === 0 && <p className="carte text-slate-600">Aucun dossier pour l'instant.</p>}
      <ul className="space-y-3">
        {dossiers?.map((d) => (
          <li key={d.numero}>
            <Link to={`/dossier/${d.numero}`} className="carte block hover:border-vert-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-slate-500">{d.numero}</span>
                <BadgeStatut statut={d.statut} />
                <BadgeNiveau niveau={d.etape_courante?.niveau} />
              </div>
              <p className="mt-1 font-semibold">{d.procedure.nom}</p>
              {['SOUMIS', 'EN_COURS'].includes(d.statut) && (
                <p className="text-sm text-slate-600">
                  Étape {d.etape_ordre}/{d.etapes.length} · {d.etape_courante.service} · {delaiRestant(d.etape_courante.echeance)}
                </p>
              )}
              {d.statut === 'ATTENTE_USAGER' && <p className="text-sm font-medium text-orange-700">⚠ {d.message_attente}</p>}
              {d.statut === 'PRET' && <p className="text-sm font-medium text-vert-700">Prêt — retrait : {d.etapes[0].service}</p>}
              <div className="mt-3 flex gap-1" aria-hidden>
                {d.etapes.map((e) => (
                  <span key={e.ordre} className={`h-1.5 flex-1 rounded-full ${e.etat === 'fait' ? 'bg-vert-600' : e.etat === 'en_cours' ? 'bg-orange-500' : 'bg-slate-200'}`} />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
