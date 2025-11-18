import Link from "next/link";

// Full-bleed navbar wrapper; inner container holds padding/centering.
// No 100vw/w-screen anywhere → avoids Windows scrollbar gutter.
export default function Navbar() {
  return (
    <div className="w-full bg-lime-500 site-navbar">
      <div className="mx-auto w-full max-w-[var(--max-container-width)] px-4">
        <nav className="flex items-center h-12">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-base font-semibold">Lingo.dev</span>
          </Link>

          {/* Spacer */}
          <div className="grow" />

          {/* Right: Simple links (demo only) */}
          <ul className="flex items-center gap-2">
            <li>
              <a
                className="px-3 py-1.5 rounded-lg hover:bg-black/10"
                href="/get-started"
              >
                Get started
              </a>
            </li>
            <li>
              <a
                className="px-3 py-1.5 rounded-lg hover:bg-black/10"
                href="/cli"
              >
                CLI
              </a>
            </li>
            <li>
              <a
                className="px-3 py-1.5 rounded-lg hover:bg-black/10"
                href="/sdk"
              >
                SDK
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
