import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { resolveParticipants } from "../lib/participants";
import "../styles/wishlist.css";
import "../styles/form.css";
import Topbar from "../components/TopBar";
import DreamCard from "../components/DreamCard";
import ConcertForm from "../components/ConcertForm";
import ReveForm from "../components/ReveForm";
import type { Reve, Profil } from "../types";
import { SignalHigh, SignalMedium, SignalLow, Wallet } from "lucide-react";

const COLUMNS = [
  {
    priority: "haute" as const,
    icon: SignalHigh,
    label: "Priorité haute",
    unit: "rêves",
  },
  {
    priority: "moyenne" as const,
    icon: SignalMedium,
    label: "Priorité moyenne",
    unit: "envies",
  },
  {
    priority: "basse" as const,
    icon: SignalLow,
    label: "Priorité basse",
    unit: "envies",
  },
];

function WishlistPage() {
  const [reves, setReves] = useState<Reve[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReve, setEditingReve] = useState<Reve | null>(null);
  const [convertingReve, setConvertingReve] = useState<Reve | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "toutes" | "haute" | "moyenne" | "basse"
  >("toutes");
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("focus");

  async function loadReves() {
    const [{ data: reveRows }, { data: profilRows }] = await Promise.all([
      supabase.from("reves").select("*"),
      supabase.from("profils").select("*"),
    ]);

    const profils = (profilRows ?? []) as Profil[];

    const formatted: Reve[] = (reveRows ?? []).map((row) => ({
      id: row.id,
      priority: row.priority,
      genre: row.genre,
      title: row.title,
      subtitle: row.subtitle ?? "",
      dateValue: row.date_value ?? "",
      budget: row.budget ?? 0,
      note: row.note ?? "",
      groupeId: row.groupe_id,
      isWatched: row.is_watched,
      isShared: row.is_shared,
      participants: resolveParticipants(profils, row.added_by, row.is_shared),
    }));

    setReves(formatted);
    setIsLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState après await, donc pas synchrone
    loadReves();
  }, []);

  useEffect(() => {
    if (!focusId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- réinitialiser les filtres quand un focus arrive est volontaire
    setActiveFilter("toutes");
    setSearchQuery("");
  }, [focusId]);

  useEffect(() => {
    if (isLoading || !focusId) return;

    const element = document.getElementById(`reve-${focusId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, focusId]);

  function openCreateForm() {
    setEditingReve(null);
    setIsFormOpen(true);
  }

  function openEditForm(reve: Reve) {
    setEditingReve(reve);
    setIsFormOpen(true);
  }

  function handleConvert(reve: Reve) {
    setConvertingReve(reve);
  }

  function closeConvertForm() {
    setConvertingReve(null);
  }

  async function handleConcertSaved() {
    // Le concert vient d'être créé : on supprime le rêve source
    if (convertingReve) {
      await supabase.from("reves").delete().eq("id", convertingReve.id);
    }
    setConvertingReve(null);
    loadReves();
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingReve(null);
  }

  async function handleDelete(reve: Reve) {
    const confirmed = window.confirm(
      `Supprimer « ${reve.title} » ? Cette action est définitive.`,
    );
    if (!confirmed) return;

    const { error } = await supabase.from("reves").delete().eq("id", reve.id);

    if (error) {
      window.alert("Suppression impossible : " + error.message);
      return;
    }

    loadReves();
  }

  const searchedReves = reves.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hauteCount = reves.filter((r) => r.priority === "haute").length;
  const moyenneCount = reves.filter((r) => r.priority === "moyenne").length;
  const basseCount = reves.filter((r) => r.priority === "basse").length;
  const totalBudget = reves.reduce((total, r) => total + r.budget, 0);

  const visibleColumns = COLUMNS.filter(
    (col) => activeFilter === "toutes" || activeFilter === col.priority,
  );

  if (isLoading) {
    return (
      <>
        <Topbar currentPage="Wishlist" />
        <p style={{ padding: 24 }}>Chargement de la wishlist...</p>
      </>
    );
  }

  return (
    <>
      <Topbar currentPage="Wishlist" onAdd={openCreateForm} />

      <div className="page-head">
        <h1 className="page-title">
          <span className="accent">Wishlist</span>
        </h1>
        <div className="page-sub">
          <span>{reves.length} concerts rêvés</span>
          <span className="dot"></span>
          <span>{hauteCount} priorité haute</span>
          <span className="dot"></span>
          <span>{moyenneCount} priorité moyenne</span>
          <span className="dot"></span>
          <span>{basseCount} priorité basse</span>
        </div>
      </div>

      <section className="wl-summary">
        <div className="wl-stat">
          <div className="ico-circle">
            <SignalHigh size={20} />
          </div>
          <div className="body">
            <div className="v">{String(hauteCount).padStart(2, "0")}</div>
            <div className="l">Priorité haute</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">
            <SignalMedium size={20} />
          </div>
          <div className="body">
            <div className="v">{String(moyenneCount).padStart(2, "0")}</div>
            <div className="l">Priorité moyenne</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">
            <SignalLow size={20} />
          </div>
          <div className="body">
            <div className="v">{String(basseCount).padStart(2, "0")}</div>
            <div className="l">Priorité basse</div>
          </div>
        </div>
        <div className="wl-stat">
          <div className="ico-circle">
            <Wallet size={20} />
          </div>
          <div className="body">
            <div className="v">{totalBudget.toLocaleString("fr-FR")} €</div>
            <div className="l">Budget rêvé total</div>
          </div>
        </div>
      </section>

      <div className="filters">
        <button
          className={`filter-chip ${activeFilter === "toutes" ? "active" : ""}`}
          onClick={() => setActiveFilter("toutes")}>
          Toutes <span className="count">{reves.length}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === "haute" ? "active" : ""}`}
          onClick={() => setActiveFilter("haute")}>
          Priorité haute <span className="count">{hauteCount}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === "moyenne" ? "active" : ""}`}
          onClick={() => setActiveFilter("moyenne")}>
          Priorité moyenne <span className="count">{moyenneCount}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === "basse" ? "active" : ""}`}
          onClick={() => setActiveFilter("basse")}>
          Priorité basse <span className="count">{basseCount}</span>
        </button>
        <div className="filter-sep"></div>
        <div className="filter-search">
          <input
            placeholder="Chercher un rêve…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="wl-board">
        {visibleColumns.map((col) => {
          const columnReves = searchedReves.filter(
            (r) => r.priority === col.priority,
          );
          return (
            <div key={col.priority} className={`wl-col ${col.priority}`}>
              <div className="wl-col-head">
                <div className="wl-col-title">
                  <div className="icon-circle">
                    <col.icon size={18} />
                  </div>
                  {col.label}
                </div>
                <div className="wl-col-count">
                  {String(columnReves.length).padStart(2, "0")} {col.unit}
                </div>
              </div>
              {columnReves.map((reve) => (
                <DreamCard
                  key={reve.id}
                  reve={reve}
                  isFocused={String(reve.id) === focusId}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  onConvert={handleConvert}
                />
              ))}
            </div>
          );
        })}
      </section>

      {isFormOpen && (
        <ReveForm reve={editingReve} onClose={closeForm} onSaved={loadReves} />
      )}

      {convertingReve && (
        <ConcertForm
          concert={null}
          initialValues={{
            name: convertingReve.title,
            genre: convertingReve.genre,
            price: String(convertingReve.budget),
            lineup:
              convertingReve.groupeId !== null
                ? [
                    {
                      mode: "suivi",
                      groupeId: String(convertingReve.groupeId),
                      groupeName: "",
                    },
                  ]
                : [],
          }}
          onClose={closeConvertForm}
          onSaved={handleConcertSaved}
        />
      )}
    </>
  );
}

export default WishlistPage;
