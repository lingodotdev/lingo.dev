"use i18n";
import { Link } from "@tanstack/react-router";
import { Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/types";

export default function WorldMap() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Convert lat/lng to percentage position
  // Standard Web Mercator-like projection
  const coordsToPercent = (lat: number, lng: number) => {
    // X: -180 to 180 -> 0% to 100%
    const x = ((lng + 180) / 360) * 100;
    // Y: 90 to -90 -> 0% to 100% (inverted because CSS top increases downward)
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="relative">
      {/* Map container */}
      <div className="glass-card p-4 md:p-8 rounded-3xl overflow-hidden">
        <div className="relative aspect-[2/1] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
          
          {/* World Map Image with proper styling */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/world-map.svg)",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "invert(1) brightness(0.5) opacity(0.4)",
            }}
          />

          {/* Connection lines SVG overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Connection lines between first destination (Tokyo) and others */}
            {destinations.slice(1).map((dest) => {
              const from = coordsToPercent(destinations[0].coordinates.lat, destinations[0].coordinates.lng);
              const to = coordsToPercent(dest.coordinates.lat, dest.coordinates.lng);
              
              // Scale to viewBox (0-100 x, 0-50 y since aspect is 2:1)
              const fromX = from.x;
              const fromY = from.y / 2;
              const toX = to.x;
              const toY = to.y / 2;
              
              // Curved path
              const midX = (fromX + toX) / 2;
              const midY = Math.min(fromY, toY) - 5;
              
              return (
                <path
                  key={`line-${dest.id}`}
                  d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="0.2"
                  strokeDasharray="1,0.5"
                  opacity="0.5"
                  filter="url(#glow)"
                />
              );
            })}
          </svg>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30 pointer-events-none" />

          {/* Destination markers */}
          {destinations.map((dest) => {
            const pos = coordsToPercent(dest.coordinates.lat, dest.coordinates.lng);
            const isSelected = selectedDestination?.id === dest.id;
            const isHovered = hoveredId === dest.id;

            return (
              <button
                key={dest.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
                style={{ 
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`,
                  zIndex: isSelected || isHovered ? 20 : 10,
                }}
                onClick={() => setSelectedDestination(isSelected ? null : dest)}
                onMouseEnter={() => setHoveredId(dest.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Outer glow */}
                <span 
                  className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                    isSelected || isHovered 
                      ? 'bg-sky-500/30 scale-100' 
                      : 'bg-transparent scale-0'
                  }`} 
                />
                
                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-40" style={{ animationDuration: "2s" }} />
                
                {/* Marker dot */}
                <span
                  className={`relative block w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white/60 transition-all duration-300 shadow-lg cursor-pointer ${
                    isSelected || isHovered
                      ? "bg-gradient-to-r from-sky-400 to-violet-500 shadow-sky-500/50 scale-125"
                      : "bg-sky-500 shadow-sky-500/30"
                  }`}
                />

                {/* Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass-strong px-3 py-2 rounded-xl whitespace-nowrap z-30 animate-fade-in shadow-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{dest.weatherEmoji}</span>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">{dest.name}</div>
                        <div className="text-gray-400 text-xs">{dest.country}</div>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected destination panel */}
      {selectedDestination && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 animate-fade-in z-30">
          <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <div className="relative h-32">
              <img
                src={selectedDestination.imageUrl}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-xl font-bold text-white">{selectedDestination.name}</h3>
                <p className="text-gray-300 text-sm">{selectedDestination.country}</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-medium">{selectedDestination.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedDestination.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  to="/destination/$destinationId"
                  params={{ destinationId: selectedDestination.id }}
                  className="flex-1 btn-secondary text-sm py-2 text-center"
                >
                  <>Learn More</>
                </Link>
                <Link
                  to="/planner"
                  search={{ destination: selectedDestination.id }}
                  className="flex-1 btn-primary text-sm py-2 text-center flex items-center justify-center gap-1"
                >
                  <span className="relative z-10"><>Plan Trip</></span>
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-500 border border-white/30" />
          <>Destination</>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 border border-white/30" />
          <>Selected</>
        </div>
      </div>
    </div>
  );
}
