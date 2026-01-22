export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  priceLevel: 1 | 2 | 3;
  tags: string[];
  highlights: string[];
  bestTimeToVisit: string;
  currency: string;
  language: string;
  coordinates: { lat: number; lng: number };
  weatherEmoji: string;
  avgTemp: { summer: number; winter: number };
  weather?: {
    summer: string;
    fall: string;
    winter: string;
    spring: string;
  };
  activities?: string[];
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  notes?: string;
  duration: string;
  category?: "sightseeing" | "food" | "transport" | "accommodation" | "activity" | "free";
}

export interface Itinerary {
  id: string;
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  items: ItineraryItem[];
  budget?: number;
  travelers: number;
}

export interface TravelTip {
  id: string;
  category: "transport" | "food" | "culture" | "safety" | "money";
  title: string;
  content: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  icon: string;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}
