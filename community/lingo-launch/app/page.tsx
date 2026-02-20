import Link from "next/link";
import {
  Globe,
  Languages,
  Pencil,
  Eye,
  Rocket,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-2/8 via-transparent to-chart-5/8" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-chart-2/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-chart-5/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 mb-8 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-chart-4" />
            <span>Powered by Lingo.dev</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
            Build Once,{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] bg-clip-text text-transparent">
              Launch Everywhere
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Create multilingual websites effortlessly. Write your content in one
            language and let AI-powered translation deliver it to the entire
            world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-lg text-lg font-medium hover:bg-secondary/80 transition-colors border border-border"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Go Global
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              LingoLaunch gives you all the tools to create, translate, and
              publish multilingual pages in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Languages,
                title: "Auto Translation",
                desc: "Write in one language. Our AI translates your entire page into multiple languages automatically.",
                color: "text-chart-2",
                bg: "bg-chart-2/10",
              },
              {
                icon: Pencil,
                title: "Visual Editor",
                desc: "Create beautiful pages with our intuitive drag-and-drop section editor. No coding required.",
                color: "text-chart-1",
                bg: "bg-chart-1/10",
              },
              {
                icon: Eye,
                title: "Instant Preview",
                desc: "See exactly how your page looks in any language before publishing. Switch locales in real time.",
                color: "text-chart-4",
                bg: "bg-chart-4/10",
              },
              {
                icon: Rocket,
                title: "One-Click Publish",
                desc: "Deploy your multilingual site instantly. Reach audiences in every country from day one.",
                color: "text-chart-5",
                bg: "bg-chart-5/10",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to a multilingual website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Page",
                desc: "Start with our page editor. Add hero sections, features, testimonials, and more.",
                icon: Pencil,
              },
              {
                step: "2",
                title: "Write Your Content",
                desc: "Write everything in your primary language. Fill in headings, descriptions, and call-to-actions.",
                icon: Globe,
              },
              {
                step: "3",
                title: "Launch Globally",
                desc: "Your page is instantly available in multiple languages. The AI handles all translations.",
                icon: Rocket,
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-sm font-bold text-chart-2 mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Reach the World
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Your pages are automatically translated into multiple languages.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { code: "EN", name: "English" },
              { code: "ES", name: "Español" },
              { code: "DE", name: "Deutsch" },
              { code: "FR", name: "Français" },
            ].map((lang) => (
              <div
                key={lang.code}
                className="bg-card border border-border rounded-xl px-6 py-4 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl font-bold text-chart-2">
                  {lang.code}
                </span>
                <span className="text-muted-foreground">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/5 to-chart-2/5 rounded-2xl p-12 sm:p-16 border border-border">
            <Zap className="h-10 w-10 text-chart-4 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Go Global?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Start creating your first multilingual page today. No credit card
              required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Create Your First Page
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-chart-2" />
            <span className="font-semibold text-foreground">LingoLaunch</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chart-2 hover:underline"
            >
              Lingo.dev
            </a>
            {" "}&mdash; Build once, ship everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
