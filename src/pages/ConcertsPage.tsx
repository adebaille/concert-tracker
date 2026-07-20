import "../styles/concerts.css";
import Topbar from "../components/TopBar";
import ConcertCard from "../components/ConcertCard";
import type { Concert } from "../types";
import { useState } from "react";

const concerts: Concert[] = [
  {
    id: 1,
    genre: "kpop",
    status: "prevu",
    photoLabel: "Photo · Sserafim",
    bigBg: "EASY CRAZY HOT",
    date: "02 JUIN 2026 · 20H00",
    price: 98,
    name: "Le Sserafim",
    venue: "Accor Arena",
    city: "Paris",
    rating: 0,
    setlist: "Fearless · Antifragile · Unforgiven · Easy · Crazy",
  },
  {
    id: 2,
    genre: "metal",
    status: "prevu",
    photoLabel: "Photo · Sleep Token",
    bigBg: "EVEN IN ARCADIA",
    date: "14 SEPT 2026 · 19H30",
    price: 72,
    name: "Sleep Token",
    venue: "Zénith",
    city: "Lille",
    rating: 0,
    anecdote:
      "On a réussi à choper les billets en 4 min. Vesper en pré-vente FR — record perso de Emeline.",
  },
  {
    id: 3,
    genre: "kpop",
    status: "passe",
    photoLabel: "Photo · Stray Kids",
    bigBg: "DOMINATE",
    date: "12 OCT 2024 · 20H00",
    price: 120,
    name: "Stray Kids",
    venue: "La Défense Arena",
    city: "Paris",
    rating: 5,
    anecdote:
      "Alison a pleuré dès Maniac. Lightstick officiel acheté pendant le concert. Souvenir absolu.",
  },
  {
    id: 4,
    genre: "metal",
    status: "passe",
    photoLabel: "Photo · Bring Me The Horizon",
    bigBg: "NEX GEN",
    date: "28 MARS 2025 · 20H30",
    price: 65,
    name: "Bring Me The Horizon",
    venue: "Zénith",
    city: "Paris",
    rating: 4,
    anecdote:
      "Première fois en pit pour Emeline. Alison l'a tenue toute la soirée. T-shirt acheté = obligatoire.",
  },
  {
    id: 5,
    genre: "kpop",
    status: "passe",
    photoLabel: "Photo · (G)I-DLE",
    bigBg: "I-DLE",
    date: "22 JANV 2025 · 20H00",
    price: 85,
    name: "(G)I-DLE",
    venue: "Adidas Arena",
    city: "Paris",
    rating: 4,
    setlist: "Tomboy · Queencard · Wife · Super Lady · Nxde",
  },
  {
    id: 6,
    genre: "metal",
    status: "annule",
    photoLabel: "Photo · Spiritbox",
    bigBg: "TSUNAMI SEA",
    date: "04 FÉV 2025",
    price: 58,
    name: "Spiritbox",
    venue: "Bataclan",
    city: "Paris",
    rating: 0,
    anecdote:
      "Annulé par le groupe à 24h du concert. Remboursement effectué le 06/02. Emeline dévastée.",
  },
];

function ConcertsPage() {
  const [activeFilter, setActiveFilter] = useState<
    "tous" | "a-venir" | "passes"
  >("tous");
  const filteredConcerts = concerts.filter((concert) => {
    if (activeFilter === "a-venir") return concert.status === "prevu";
    if (activeFilter === "passes") return concert.status === "passe";
    return true;
  });
  return (
    <>
      <Topbar currentPage="Concerts & Festivals" />

      <div className="page-head">
        <h1 className="page-title">
          Concerts <span className="accent">& Festivals</span>
        </h1>
        <div className="page-sub">
          <span>{concerts.length} enregistrés</span>
          <span className="dot"></span>
          <span>
            {concerts.filter((c) => c.status === "passe").length} vécus
          </span>
          <span className="dot"></span>
          <span>
            {concerts.filter((c) => c.status === "prevu").length} à venir
          </span>
        </div>
      </div>

      <div className="filters">
        <button
          className={`filter-chip ${activeFilter === "tous" ? "active" : ""}`}
          onClick={() => setActiveFilter("tous")}>
          Tous <span className="count">{concerts.length}</span>
        </button>
        <button
          className={`filter-chip ${activeFilter === "a-venir" ? "active" : ""}`}
          onClick={() => setActiveFilter("a-venir")}>
          À venir{" "}
          <span className="count">
            {concerts.filter((c) => c.status === "prevu").length}
          </span>
        </button>
        <button
          className={`filter-chip ${activeFilter === "passes" ? "active" : ""}`}
          onClick={() => setActiveFilter("passes")}>
          Passés{" "}
          <span className="count">
            {concerts.filter((c) => c.status === "passe").length}
          </span>
        </button>
      </div>

      <section className="concerts-grid">
        {filteredConcerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </section>
    </>
  );
}

export default ConcertsPage;
