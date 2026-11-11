import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { api } from '../api';
import { useAuth } from '../auth.jsx';

export default function Guichet() {
  const { token } = useAuth();
  const [procedures, setProcedures] = useState([]);
  const [f, setF] = useState({ telephone: '', nom: '', procedure_id: '' });
  const [recu, setRecu] = useState(null);
  const [erreur, setErreur] = useState('');
  const [qr, setQr] = useState('');
  useEffect(() => { api('/procedures').then(setProcedures); }, []);
  // QR généré localement : aucune donnée envoyée à un service tiers
  useEffect(() => {
    if (recu) QRCode.toDataURL(`${window.location.origin}/suivi/${recu.numero}`, { width: 320, margin: 1 }).then(setQr);
  }, [recu]);

  async function enregistrer(e) {
    e.preventDefault(); setErreur('');
    try {
      const r = await api('/agent/guichet', { method: 'POST', token, body: { ...f, procedure_id: Number(f.procedure_id) } });
      setRecu({ ...r, ...f, procedure: procedures.find((p) => p.id === Number(f.procedure_id)) });
      setF({ telephone: '', nom: '', procedure_id: '' });
    } catch (err) { setErreur(err.message); }
  }

  const lien = recu && `${window.location.origin}/suivi/${recu.numero}`;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={enregistrer} className="carte space-y-3">
        <h1 className="text-xl font-bold">Enregistrer un dépôt au guichet</h1>
        <p className="text-sm text-slate-600">Pour les usagers venus sur place, même sans smartphone : ils seront notifiés par SMS.</p>
        <div><label className="etiquette" htmlFor="t">Téléphone de l'usager</label>
          <input id="t" className="champ" inputMode="tel" value={f.telephone} onChange={(e) => setF({ ...f, telephone: e.target.value })} required /></div>
        <div><label className="etiquette" htmlFor="nm">Nom et prénoms</label>
          <input id="nm" className="champ" value={f.nom} onChange={(e) => setF({ ...f, nom: e.target.value })} required /></div>
        <div><label className="etiquette" htmlFor="p">Démarche</label>
          <select id="p" className="champ" value={f.procedure_id} onChange={(e) => setF({ ...f, procedure_id: e.target.value })} required>
            <option value="">Choisir…</option>
            {procedures.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select></div>
        <button className="btn-primaire w-full">Enregistrer et imprimer le reçu</button>
        {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
      </form>

      {recu && (
        <div className="carte space-y-3 border-dashed print:border-0" id="recu">
          <div className="flex items-center justify-between">
            <strong className="text-vert-800">SUIVO — Reçu de dépôt</strong>
            <span className="text-xs text-slate-500">{new Date().toLocaleString('fr-FR')}</span>
          </div>
          <p className="font-mono text-2xl font-bold tracking-wide">{recu.numero}</p>
          <p className="text-sm">{recu.nom} · {recu.telephone}</p>
          <p className="text-sm">{recu.procedure?.nom} — délai prévu {recu.procedure?.delai_total_jours} jours ouvrés</p>
          {qr && <img alt={`QR code du dossier ${recu.numero}`} className="h-40 w-40" src={qr} />}
          <p className="text-xs text-slate-600">Suivi : {lien} · ou SMS / USSD *XXX# avec le numéro</p>
          <button className="btn-secondaire w-full print:hidden" onClick={() => window.print()}>Imprimer</button>
        </div>
      )}
    </div>
  );
}
