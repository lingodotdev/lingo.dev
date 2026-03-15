import { LocaleSwitcher } from "@lingo.dev/compiler/react";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-4 flex gap-4 items-center justify-between bg-gray-800 text-white shadow-lg">
      <div className="flex items-center gap-6">
        <span className="font-semibold">
          Lingo.dev compiler Tanstack router demo
        </span>
        <nav className="flex gap-4">
          <Link
            to="/"
            className="hover:text-blue-300 transition-colors [&.active]:text-blue-400 [&.active]:font-semibold"
            activeProps={{ className: "active" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-300 transition-colors [&.active]:text-blue-400 [&.active]:font-semibold"
            activeProps={{ className: "active" }}
            data-testid="about-link"
          >
            About
          </Link>
        </nav>
      </div>
      <div>
        This header is not translated, since it's not marked with "use i18n",
        but "useDirective" is "true"
      </div>
      <LocaleSwitcher
        locales={[
          { code: "en", label: "English" },
          { code: "es", label: "Spanish" },
          { code: "de", label: "Deutsch" },
          { code: "fr", label: "Français" },
        ]}
        className="locale-switcher"
      />
    </header>
  );
}
