"use i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Globe,
  Calendar,
  Sparkles,
  ArrowRight,
  Compass,
  Wallet,
} from "lucide-react";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import WorldMap from "@/components/WorldMap";
import { useTripStore } from "@/store/tripStore";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const featuredDestinations = destinations.slice(0, 6);
  const { trips } = useTripStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
              }}
            />
          ))}
        </div>

        {/* Floating destination previews */}
        <motion.div
          className="absolute top-20 left-10 hidden lg:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass-card p-2 rounded-xl">
            <img
              src={destinations[0].imageUrl}
              alt=""
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-16 hidden lg:block"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="glass-card p-2 rounded-xl">
            <img
              src={destinations[2].imageUrl}
              alt=""
              className="w-32 h-20 rounded-lg object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 hidden xl:block"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="glass-card p-2 rounded-xl">
            <img
              src={destinations[4].imageUrl}
              alt=""
              className="w-20 h-28 rounded-lg object-cover"
            />
          </div>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                <>AI-Powered Travel Planning</>
              </span>
              <span className="text-xs bg-gradient-to-r from-sky-400 to-violet-400 text-white px-2 py-0.5 rounded-full">
                <>Powered by Lingo.dev</>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">
                <>Explore the World</>
              </span>
              <br />
              <span className="text-white">
                <>Your Way</>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
              <>
                Plan epic adventures with AI-powered itineraries, real-time
                translations, and smart travel tools. Available in 6 languages.
              </>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/planner" className="btn-primary inline-flex items-center gap-2 relative z-10">
                <Sparkles className="w-5 h-5" />
                <span className="relative z-10"><>Start Planning</></span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </Link>
              <Link to="/destinations" className="btn-secondary inline-flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <>Explore Destinations</>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{destinations.length}+</div>
                <div className="text-gray-400 text-sm mt-1"><>Destinations</></div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">6</div>
                <div className="text-gray-400 text-sm mt-1"><>Languages</></div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{trips.length}</div>
                <div className="text-gray-400 text-sm mt-1"><>Your Trips</></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Interactive World Map */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <>Discover Global Destinations</>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              <>Click on any destination to explore. Our AI will help you plan the perfect trip.</>
            </p>
          </div>
          <WorldMap />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <>Smart Travel Planning</>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              <>
                Everything you need to plan, book, and enjoy your perfect trip.
              </>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Sparkles className="w-7 h-7" />}
              title={<>AI Itinerary Generator</>}
              description={<>Get personalized day-by-day plans based on your preferences and travel style.</>}
              color="sky"
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7" />}
              title={<>6 Languages</>}
              description={<>Browse and plan in English, Spanish, French, German, Japanese, or Chinese.</>}
              color="violet"
            />
            <FeatureCard
              icon={<Wallet className="w-7 h-7" />}
              title={<>Budget Tracker</>}
              description={<>Track expenses, convert currencies, and stay within your travel budget.</>}
              color="amber"
            />
            <FeatureCard
              icon={<Calendar className="w-7 h-7" />}
              title={<>Trip Dashboard</>}
              description={<>Countdown timer, packing lists, and all your trip details in one place.</>}
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                <>Trending Destinations</>
              </h2>
              <p className="text-gray-400">
                <>Most popular places loved by travelers worldwide</>
              </p>
            </div>
            <Link
              to="/destinations"
              className="hidden sm:flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              <>View all</>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} featured={index === 0} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/destinations"
              className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-2"
            >
              <>View all destinations</>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute inset-0 grid-pattern" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 rounded-3xl">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Compass className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <>Ready for Your Next Adventure?</>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              <>
                Start planning your dream trip today. Our AI will create a personalized
                itinerary in seconds.
              </>
            </p>
            <Link
              to="/planner"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <Sparkles className="w-6 h-6 relative z-10" />
              <span className="relative z-10"><>Create Your Trip</></span>
              <ArrowRight className="w-6 h-6 relative z-10" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  color: "sky" | "violet" | "amber" | "emerald";
}) {
  const colorClasses = {
    sky: "from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/20",
    violet: "from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/20",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="glass-card p-6 hover:border-white/20 transition-all duration-300 group">
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
