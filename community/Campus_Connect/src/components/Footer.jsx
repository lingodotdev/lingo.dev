import { t } from "../i18n";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-copyright">{t("footer.copyright")}</p>
        <p className="footer-credit">{t("footer.builtBy")}</p>
      </div>
    </footer>
  );
}
