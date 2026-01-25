export default function Home() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-8 justify-between">

        <div className="space-y-3 text-center lg:text-left">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mute border border-boder mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-acc animate-pulse" />
            <span className="text-sm font-medium text-subtxt">
              Future Backed by Lingo.dev
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-txt">
            Build Forms Multilingual
            <span className="block text-acc">
              With Instant Translation
            </span>
          </h1>

          <p className="text-sm text-subtxt text-right">
            Powered by{" "}
            <span className="font-semibold text-txt">Lingo.dev</span> —
            powered localization for modern apps.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a
              href="/builder"
              className="inline-flex items-center justify-center text-lg px-6 py-2 rounded-full bg-prim text-white font-medium shadow hover:opacity-90 transition"
            >
              Start Building
            </a>
            <a
              href="https://github.com/guptashubham-11/formlingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-lg px-6 py-2 rounded-full bg-crd text-txt font-medium shadow hover:opacity-90 transition"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="relative w-xs bg-crd border border-boder rounded-xl shadow-xl p-6 space-y-4">

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-mute rounded" />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-acc rounded-full" />
                <span className="w-2 h-2 bg-prim rounded-full" />
                <span className="w-2 h-2 bg-subtxt rounded-full" />
              </div>
            </div>

            {/* Fake Form Inputs */}
            <div className="space-y-3">
              <div className="h-10 w-full bg-mute rounded-xl" />
              <div className="h-10 w-full bg-mute rounded-xl" />
              <div className="h-10 w-full bg-mute rounded-xl" />
            </div>

            {/* Language Switch */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-32 bg-mute rounded" />
              <div className="h-8 w-20 bg-mute rounded-full" />
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <div className="h-10 w-full bg-prim rounded-full shadow" />
            </div>
          </div>

          {/* Floating Accent */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-acc/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-prim/20 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-boder bg-bg">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-subtxt">

          {/* Left */}
          <span>
            © {new Date().getFullYear()} FormLingo
          </span>

          {/* Center */}
          <div className="flex items-center gap-4">
            <a href="/builder" className="hover:text-prim transition">
              Builder
            </a>
            <span className="opacity-40">•</span>
            <a href="/preview" className="hover:text-prim transition">
              Preview
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://github.com/guptashubham-11/formlingo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-prim transition"
            >
              GitHub
            </a>
          </div>

          {/* Right */}
          <span>
            Built by{" "}
            <a
              href="https://github.com/guptashubham-11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prim font-medium hover:underline"
            >
              Shubham
            </a>
          </span>

        </div>
      </footer>

    </section>
  );
}
