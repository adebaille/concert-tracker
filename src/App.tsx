import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";
import LoginPage from "./pages/LoginPage";

const NAV_ITEMS = [
  { id: "accueil", label: "Accueil", to: "/" },
  { id: "concerts", label: "Concerts & Festivals", to: "/concerts" },
  { id: "groupes", label: "Groupes", to: "/groupes" },
  { id: "wishlist", label: "Wishlist", to: "/wishlist" },
  { id: "merch", label: "Inventaire Merch", to: "/merch" },
];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (isCheckingSession) {
    return null;
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"></div>
          <div>
            <div className="brand-name">NOTRE UNIVERS</div>
            <div className="brand-sub">Musical · v1.0</div>
          </div>
        </div>

        <div className="nav-label">Sections</div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-label" style={{ marginTop: 20 }}>
          Outils
        </div>
        <nav className="nav">
          <NavLink
            to="/parametres"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }>
            Paramètres
          </NavLink>
        </nav>

        <div className="sidebar-spacer"></div>

        <div className="duo">
          <div className="duo-row">
            <div className="avatars">
              <div className="avatar metal" title="Emeline">
                E
              </div>
              <div className="avatar kpop" title="Alison">
                A
              </div>
            </div>
            <div className="duo-text">
              <div className="who">Alison &amp; Emeline</div>
              <div className="since">DEPUIS 2024</div>
            </div>
            <div className="status-dot" title="Connectée"></div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="section-link"
            style={{ marginTop: 10 }}>
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
