import { t } from "../i18n";
import "./EventDetail.css";

export default function EventDetail({ event, onBack }) {
  return (
    <section className="event-detail-section">
      <div className="detail-container">
        <div className="detail-blob blob-1"></div>
        <div className="detail-blob blob-2"></div>

        <button onClick={onBack} className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{t("eventDetail.back")}</span>
        </button>

        <div className="detail-glass-card">
          <div className="detail-header">
            <div className="detail-badge-row">
              <span className="detail-category">{t(`categories.${event.category}`)}</span>
            </div>
            <h1 className="detail-title">{t("title", { scope: `events.${event.id}.title` })}</h1>
          </div>

          <div className="detail-content-grid">
            <div className="detail-main-info">
              <div className="info-section">
                <h2 className="info-section-title">
                  <span className="title-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </span>
                  {t("eventDetail.about")}
                </h2>
                <p className="detail-long-desc">{t("longDesc", { scope: `events.${event.id}.longDesc` })}</p>
              </div>
            </div>

            <div className="detail-side-panel">
              <div className="spec-card">
                <div className="spec-item">
                  <div className="spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">{t("eventDetail.date")}</span>
                    <span className="spec-value">{event.date}</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">{t("eventDetail.time")}</span>
                    <span className="spec-value">{event.time}</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">{t("eventDetail.venue")}</span>
                    <span className="spec-value">{event.venue}</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                    </svg>
                  </div>
                  <div className="spec-details">
                    <span className="spec-label">{t("eventDetail.duration")}</span>
                    <span className="spec-value">{event.duration}</span>
                  </div>
                </div>
              </div>

              <button className="premium-register-btn">
                <span>{t("eventDetail.register")}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
