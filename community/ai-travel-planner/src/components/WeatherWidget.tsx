"use i18n";
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer } from "lucide-react";
import type { Destination } from "@/types";

interface WeatherWidgetProps {
  destination: Destination;
  compact?: boolean;
}

// Simulated weather data based on destination and season
function getWeatherData(destination: Destination) {
  const month = new Date().getMonth();
  const isSummer = month >= 5 && month <= 8;
  
  // Get current season temperature
  const currentTemp = isSummer ? destination.avgTemp.summer : destination.avgTemp.winter;
  const tempVariation = Math.floor(Math.random() * 6) - 3;
  const temp = currentTemp + tempVariation;
  
  // Determine weather condition based on destination and temp
  let condition: "sunny" | "cloudy" | "rainy" | "snowy" = "sunny";
  let humidity = 50;
  let windSpeed = 10;
  
  if (temp < 5) {
    condition = Math.random() > 0.5 ? "snowy" : "cloudy";
    humidity = 70;
  } else if (destination.tags.includes("Beach") || destination.tags.includes("Tropical")) {
    condition = Math.random() > 0.7 ? "rainy" : "sunny";
    humidity = 75;
    windSpeed = 15;
  } else if (temp > 30) {
    condition = "sunny";
    humidity = 40;
  } else {
    condition = Math.random() > 0.6 ? "cloudy" : "sunny";
  }
  
  return {
    temp,
    condition,
    humidity,
    windSpeed,
    feelsLike: temp + (humidity > 60 ? 3 : -2),
  };
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

const weatherLabels = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
};

const weatherColors = {
  sunny: "from-amber-500 to-orange-500",
  cloudy: "from-gray-400 to-slate-500",
  rainy: "from-blue-500 to-indigo-600",
  snowy: "from-blue-200 to-blue-400",
};

export default function WeatherWidget({ destination, compact = false }: WeatherWidgetProps) {
  const weather = getWeatherData(destination);
  const WeatherIcon = weatherIcons[weather.condition];

  if (compact) {
    return (
      <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${weatherColors[weather.condition]} flex items-center justify-center`}>
          <WeatherIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-xs text-gray-400">{weatherLabels[weather.condition]}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Thermometer className="w-5 h-5 text-sky-400" />
        <>Current Weather</>
      </h3>
      
      <div className="flex items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${weatherColors[weather.condition]} flex items-center justify-center shadow-lg`}>
          <WeatherIcon className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <div className="text-4xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-gray-400">{weatherLabels[weather.condition]}</div>
          <div className="text-sm text-gray-500"><>Feels like</> {weather.feelsLike}°C</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-sm text-gray-400"><>Humidity</></div>
            <div className="text-white font-semibold">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
          <Wind className="w-5 h-5 text-sky-400" />
          <div>
            <div className="text-sm text-gray-400"><>Wind</></div>
            <div className="text-white font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>

      {/* Seasonal forecast */}
      {destination.weather && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3"><>Seasonal Temperatures</></h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(destination.weather).map(([season, temp]) => (
              <div key={season} className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-xs text-gray-500 capitalize">{season}</div>
                <div className="text-white font-semibold">{temp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
