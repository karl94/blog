import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Accueil from './pages/Accueil.jsx';
import Suivi from './pages/Suivi.jsx';
import Connexion from './pages/Connexion.jsx';
import MesDossiers from './pages/MesDossiers.jsx';
import NouvelleDemande from './pages/NouvelleDemande.jsx';
import Dossier from './pages/Dossier.jsx';
import AgentFile from './pages/AgentFile.jsx';
import Guichet from './pages/Guichet.jsx';
import Pilotage from './pages/Pilotage.jsx';

function Protege({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/connexion" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function Entete() {
  const { user, deconnexion } = useAuth();
  const nav = useNavigate();
  const lien = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-vert-50 hover:bg-white/10'}`;
  const estAgent = user && ['agent', 'admin'].includes(user.role);
  return (
    <header className="bg-vert-800 text-white">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-vert-600" aria-hidden />
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-auto flex items-center gap-2 text-lg font-bold tracking-tight">
          <img src="/icon.svg" alt="" className="h-8 w-8" /> SUIVO
        </Link>
        <nav className="flex flex-wrap items-center gap-1" aria-label="Navigation principale">
          {user?.role === 'usager' && <NavLink to="/mes-dossiers" className={lien}>Mes dossiers</NavLink>}
          {estAgent && <NavLink to="/agent" className={lien}>File de travail</NavLink>}
          {estAgent && <NavLink to="/agent/guichet" className={lien}>Dépôt guichet</NavLink>}
          {estAgent && <NavLink to="/pilotage" className={lien}>Pilotage</NavLink>}
          {user ? (
            <button className="rounded-lg px-3 py-2 text-sm text-vert-50 hover:bg-white/10" onClick={() => { deconnexion(); nav('/'); }}>
              Déconnexion
            </button>
          ) : (
            <NavLink to="/connexion" className={lien}>Se connecter</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Entete />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/suivi" element={<Suivi />} />
          <Route path="/suivi/:numero" element={<Suivi />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/mes-dossiers" element={<Protege><MesDossiers /></Protege>} />
          <Route path="/nouvelle-demande" element={<Protege><NouvelleDemande /></Protege>} />
          <Route path="/dossier/:numero" element={<Protege><Dossier /></Protege>} />
          <Route path="/agent" element={<Protege roles={['agent', 'admin']}><AgentFile /></Protege>} />
          <Route path="/agent/guichet" element={<Protege roles={['agent', 'admin']}><Guichet /></Protege>} />
          <Route path="/pilotage" element={<Protege roles={['agent', 'admin']}><Pilotage /></Protege>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        SUIVO — prototype MVP · JNSP Sprint Digital 2026 · Données de démonstration fictives
      </footer>
    </div>
  );
}
