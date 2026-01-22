"use client";

import { Languages, Building2, MapPin, Clock } from "lucide-react";

export function StatsSection() {
  return (
    <section className="py-12 bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <Languages className="h-8 w-8 mb-3" style={{ color: "#4299eb" }} />
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              15+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Languages Supported
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Building2 className="h-8 w-8 mb-3" style={{ color: "#4299eb" }} />
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              500+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Schemes
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="h-8 w-8 mb-3" style={{ color: "#4299eb" }} />
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              28+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              States Covered
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="h-8 w-8 mb-3" style={{ color: "#4299eb" }} />
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Less than 3s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Response Time
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
