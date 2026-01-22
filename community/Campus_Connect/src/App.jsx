import { useState } from "react";
import events from "./data/events.json";
import EventCard from "./components/EventCard";
import LanguageToggle from "./components/LanguageToggle";
import { t } from "./i18n";
import './App.css';

import Hero from "./components/Hero";
import Footer from "./components/Footer";
import EventDetail from "./components/EventDetail";
import Logo from "./components/Logo";

export default function App() {
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter(e => e.category === filter);

  if (selectedEvent) {
    return (
      <div className="app-container">
        <div className="mesh-bg"></div>
        <Logo />
        <LanguageToggle />
        <EventDetail 
          event={selectedEvent} 
          onBack={() => setSelectedEvent(null)} 
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="mesh-bg"></div>
      
      <Logo />
      <LanguageToggle />
      <Hero />
      
      <div className="content-wrapper" id="events-section">
        <header>
          <div className="title-section">
            <h1>Campus Connect</h1>
            <p className="event-count">
              {t("events.count", { count: filteredEvents.length })}
            </p>
          </div>
        </header>

        <nav className="filter-bar">
          {["all", "workshop", "hackathon", "placement"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
            >
              {cat === "all" ? "All" : t(`categories.${cat}`)}
            </button>
          ))}
        </nav>

        <main className="events-grid">
          {filteredEvents.map(e => (
            <div key={e.id} onClick={() => setSelectedEvent(e)} style={{ cursor: 'pointer' }}>
              <EventCard event={e} />
            </div>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
