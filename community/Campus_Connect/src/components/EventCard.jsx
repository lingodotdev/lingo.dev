import { t } from "../i18n";
import './EventCard.css';

export default function EventCard({ event }) {
  const copyVenue = () => {
    navigator.clipboard.writeText(event.venue);
    alert(t("ui.copied"));
  };

  return (
    <div className="event-card-container">
      <div className="category-badge">{t(`categories.${event.category}`)}</div>
      
      <div className="card-content">
        <h2 className="event-title">
          {t("title", { scope: `events.${event.id}.title` })}
        </h2>

        <p className="event-desc">
          {t("desc", { scope: `events.${event.id}.desc` })}
        </p>

        <div className="event-info">
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="info-content">
              <span className="info-label">{t("ui.time")}</span>
              <span className="info-value">{event.time}</span>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="info-content">
              <span className="info-label">{t("ui.venue")}</span>
              <span className="info-value">{event.venue}</span>
            </div>
          </div>
        </div>

        <button onClick={copyVenue} className="copy-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("ui.copyVenue")}
        </button>
      </div>
    </div>
  );
}
