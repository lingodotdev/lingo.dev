"use i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, MapPin, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";

export const Route = createFileRoute("/destinations")({
  component: DestinationsPage,
});

function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    destinations.forEach((d) => d.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const matchesSearch =
        searchQuery === "" ||
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === null || destination.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">
              <>{destinations.length} Amazing Destinations</>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">
              <>Explore Destinations</>
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            <>
              Discover breathtaking places around the world. Find your perfect
              getaway from our curated collection of destinations.
            </>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                selectedTag === null
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Filter className="w-4 h-4" />
              <>All</>
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredDestinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-card max-w-md mx-auto p-8">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                <>No destinations found matching your criteria.</>
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <>Clear filters</>
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            <>
              Showing {filteredDestinations.length} of {destinations.length}{" "}
              destinations
            </>
          </p>
        </div>
      </div>
    </div>
  );
}
