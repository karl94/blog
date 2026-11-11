import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext(null);
const lire = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const ecrire = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* stockage indisponible */ } };

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => lire('suivo_token'));
  const [user, setUser] = useState(() => JSON.parse(lire('suivo_user') || 'null'));

  useEffect(() => {
    if (!token) return;
    api('/moi', { token }).then((u) => { setUser(u); ecrire('suivo_user', JSON.stringify(u)); }).catch(() => {
      if (navigator.onLine) deconnexion();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function connexion(t, u) {
    setToken(t); setUser(u);
    ecrire('suivo_token', t); ecrire('suivo_user', JSON.stringify(u));
  }
  function deconnexion() {
    setToken(null); setUser(null);
    ecrire('suivo_token', null); ecrire('suivo_user', null);
    if ('caches' in window) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
  }
  return <Ctx.Provider value={{ token, user, connexion, deconnexion }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
