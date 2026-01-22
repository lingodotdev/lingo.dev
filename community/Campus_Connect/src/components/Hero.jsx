import { t } from "../i18n";
import "./Hero.css";

export default function Hero() {
  const scrollToEvents = () => {
    const element = document.getElementById("events-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-header">
          <h1 className="hero-title">{t("hero.title")}</h1>
          <p className="hero-subtitle">{t("hero.subtitle")}</p>
          
          <div className="hero-cta-group">
            <button className="cta-primary" onClick={scrollToEvents}>
              {t("hero.cta_primary")}
            </button>
          </div>
          
          <p className="accessibility-hint">{t("hero.accessibility_hint")}</p>
        </div>

        <div className="hero-proof-strip">
          <div className="proof-item">
            <span className="proof-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <span>{t("hero.proof.events")}</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span>{t("hero.proof.timing")}</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <span>{t("hero.proof.filter")}</span>
          </div>
          <div className="proof-item">
            <span className="proof-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </span>
            <span>{t("hero.proof.mobile")}</span>
          </div>
        </div>

        {/* Layer 3: Capabilities */}
        <div className="hero-capabilities">
          <div className="capability-block">
            <h3>{t("hero.capabilities.discover.title")}</h3>
          </div>
          <div className="capability-block">
            <h3>{t("hero.capabilities.decide.title")}</h3>
            <p>{t("hero.capabilities.decide.line")}</p>
          </div>
          <div className="capability-block">
            <h3>{t("hero.capabilities.act.title")}</h3>
            <p>{t("hero.capabilities.act.line")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
