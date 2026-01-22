"use i18n";
import { Link } from "@tanstack/react-router";
import { Star, MapPin, ArrowRight } from "lucide-react";
import type { Destination } from "@/types";

interface DestinationCardProps {
  destination: Destination;
  featured?: boolean;
}

export default function DestinationCard({ destination, featured = false }: DestinationCardProps) {
  const priceIndicator = "💰".repeat(destination.priceLevel);

  return (
    <Link
      to="/destination/$destinationId"
      params={{ destinationId: destination.id }}
      className="block"
    >
      <div
        className={`card group cursor-pointer hover:scale-[1.02] transition-transform ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
      >
        <div className={`relative overflow-hidden ${featured ? "h-64 md:h-80" : "h-48"}`}>
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Weather badge */}
          <div className="absolute top-3 left-3">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-lg">{destination.weatherEmoji}</span>
              <span className="text-white text-sm font-medium">
                {destination.avgTemp.summer}°C
              </span>
            </div>
          </div>
          
          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <div className="glass rounded-full px-2.5 py-1.5 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">{destination.rating}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1 text-gray-300 text-sm mb-1">
              <MapPin className="w-3.5 h-3.5" />
              {destination.country}
            </div>
            <h3 className={`font-bold text-white ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
              {destination.name}
            </h3>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {destination.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {destination.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" title="Price level">{priceIndicator}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-sky-500 transition-colors hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
