// Full-bleed announcement bar with inner constrained container.
// Background lives on the OUTER shell so it truly hits the viewport edge.
export default function AnnouncementBar() {
  return (
    <div className="w-full bg-lime-500 site-announcement">
      <div className="mx-auto w-full max-w-[var(--max-container-width)] px-4 py-1 text-sm">
        {/* Replace with real copy if you like */}
        <span className="font-medium">Lingo.dev</span>&nbsp;— experimental
        compiler & tooling demo
      </div>
    </div>
  );
}
