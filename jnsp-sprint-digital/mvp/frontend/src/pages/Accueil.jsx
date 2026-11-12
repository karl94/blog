import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';

export default function Accueil() {
  const [numero, setNumero] = useState('');
  const [procedures, setProcedures] = useState([]);
  const nav = useNavigate();
  const { user } = useAuth();
  useEffect(() => { api('/procedures').then(setProcedures).catch(() => {}); }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-vert-700 to-vert-900 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">Service public · Côte d'Ivoire</p>
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Où en est votre dossier ? Suivez-le comme un colis.
        </h1>
        <p className="mt-3 max-w-xl text-vert-50">
          Étape en cours, service responsable, délai restant — sans vous déplacer. Notifications par SMS et WhatsApp.
        </p>
        <form
          className="mt-6 flex max-w-lg flex-col gap-2 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); if (numero.trim()) nav(`/suivi/${numero.trim().toUpperCase()}`); }}
        >
          <label htmlFor="num" className="sr-only">Numéro de dossier</label>
          <input id="num" className="champ text-slate-900" placeholder="Ex. SUI-2026-000001" value={numero}
            onChange={(e) => setNumero(e.target.value)} autoComplete="off" />
          <button className="btn bg-orange-500 text-white hover:bg-orange-600">Suivre</button>
        </form>
        <p className="mt-3 text-sm text-vert-100">
          Pas de smartphone ? Composez <strong>*XXX#</strong> (USSD) ou demandez au guichet.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ['1', 'Déposez', 'En ligne ou au guichet : vous recevez un numéro de suivi par SMS.'],
          ['2', 'Suivez', 'Chaque étape validée vous est notifiée, avec le service et le délai.'],
          ['3', 'Finalisez', 'Vous ne vous déplacez qu\'une fois : quand c\'est prêt.'],
        ].map(([n, t, d]) => (
          <div key={n} className="carte">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">{n}</span>
            <h2 className="mt-2 font-semibold">{t}</h2>
            <p className="text-sm text-slate-600">{d}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="text-xl font-bold">Démarches disponibles</h2>
          <Link to={user ? '/nouvelle-demande' : '/connexion'} className="btn-primaire text-sm">Nouvelle demande</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {procedures.map((p) => (
            <div key={p.id} className="carte">
              <h3 className="font-semibold">{p.nom}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.etapes.length} étapes · {p.delai_total_jours} j ouvrés prévus</p>
              <p className="text-sm text-slate-600">{p.frais_fcfa ? `${p.frais_fcfa.toLocaleString('fr-FR')} FCFA de frais officiels` : 'Frais selon barème'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
