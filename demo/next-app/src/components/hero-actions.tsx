"use client";

export function HeroActions() {
  return (
    <div className="flex flex-row gap-4 justify-center items-center">
      <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Get Started
      </button>

      <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Learn More
      </button>
    </div>
  );
}
