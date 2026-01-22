import type { Destination, TravelTip } from "@/types";

export const destinations: Destination[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    description:
      "A mesmerizing blend of ultramodern and traditional, from neon-lit skyscrapers and anime shops to historic temples and traditional tea ceremonies.",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    rating: 4.8,
    priceLevel: 3,
    tags: ["Culture", "Food", "Technology", "Shopping"],
    highlights: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Tokyo Skytree",
      "Tsukiji Fish Market",
    ],
    bestTimeToVisit: "March-May, September-November",
    currency: "JPY",
    language: "Japanese",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    weatherEmoji: "🌸",
    avgTemp: { summer: 27, winter: 6 },
    weather: { summer: "27°C", fall: "18°C", winter: "6°C", spring: "15°C" },
    activities: ["Visit Senso-ji Temple", "Explore Shibuya", "Try authentic ramen", "Shop in Harajuku", "Visit teamLab Borderless"],
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    description:
      "The City of Light enchants with iconic landmarks, world-class museums, exquisite cuisine, and romantic boulevards lined with charming cafés.",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.7,
    priceLevel: 3,
    tags: ["Romance", "Art", "Food", "History"],
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame Cathedral",
      "Champs-Élysées",
    ],
    bestTimeToVisit: "April-June, September-October",
    currency: "EUR",
    language: "French",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    weatherEmoji: "☀️",
    avgTemp: { summer: 20, winter: 5 },
    weather: { summer: "20°C", fall: "12°C", winter: "5°C", spring: "13°C" },
    activities: ["Visit Eiffel Tower", "Explore the Louvre", "Seine river cruise", "Visit Montmartre", "Enjoy croissants at a café"],
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    description:
      "A tropical paradise offering pristine beaches, ancient temples, lush rice terraces, and a rich spiritual culture that welcomes travelers from around the world.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.6,
    priceLevel: 1,
    tags: ["Beach", "Spiritual", "Nature", "Wellness"],
    highlights: [
      "Ubud Rice Terraces",
      "Tanah Lot Temple",
      "Seminyak Beach",
      "Mount Batur",
    ],
    bestTimeToVisit: "April-October",
    currency: "IDR",
    language: "Indonesian",
    coordinates: { lat: -8.3405, lng: 115.092 },
    weatherEmoji: "🌴",
    avgTemp: { summer: 30, winter: 27 },
    weather: { summer: "30°C", fall: "28°C", winter: "27°C", spring: "29°C" },
    activities: ["Trek Mount Batur", "Visit rice terraces", "Explore Monkey Forest", "Surf at Uluwatu", "Take a cooking class"],
  },
  {
    id: "new-york",
    name: "New York City",
    country: "United States",
    description:
      "The city that never sleeps offers world-famous attractions, Broadway shows, diverse neighborhoods, and an unmatched energy that inspires millions.",
    imageUrl:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    rating: 4.7,
    priceLevel: 3,
    tags: ["Urban", "Culture", "Entertainment", "Shopping"],
    highlights: [
      "Statue of Liberty",
      "Central Park",
      "Times Square",
      "Brooklyn Bridge",
    ],
    bestTimeToVisit: "April-June, September-November",
    currency: "USD",
    language: "English",
    coordinates: { lat: 40.7128, lng: -74.006 },
    weatherEmoji: "🗽",
    avgTemp: { summer: 25, winter: 0 },
    weather: { summer: "25°C", fall: "15°C", winter: "0°C", spring: "14°C" },
    activities: ["Visit Statue of Liberty", "Explore Central Park", "See a Broadway show", "Walk Brooklyn Bridge", "Visit the Met"],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    description:
      "A vibrant Mediterranean city famous for stunning Gaudí architecture, beautiful beaches, delicious tapas, and an exciting nightlife scene.",
    imageUrl:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    rating: 4.6,
    priceLevel: 2,
    tags: ["Architecture", "Beach", "Food", "Nightlife"],
    highlights: [
      "Sagrada Familia",
      "Park Güell",
      "La Rambla",
      "Gothic Quarter",
    ],
    bestTimeToVisit: "May-June, September-October",
    currency: "EUR",
    language: "Spanish/Catalan",
    coordinates: { lat: 41.3874, lng: 2.1686 },
    weatherEmoji: "🏖️",
    avgTemp: { summer: 28, winter: 10 },
    weather: { summer: "28°C", fall: "18°C", winter: "10°C", spring: "17°C" },
    activities: ["Tour Sagrada Familia", "Explore Park Güell", "Walk La Rambla", "Visit Gothic Quarter", "Relax at Barceloneta Beach"],
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    description:
      "A futuristic metropolis rising from the desert, featuring record-breaking skyscrapers, luxury shopping, golden beaches, and Arabian hospitality.",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    rating: 4.5,
    priceLevel: 3,
    tags: ["Luxury", "Shopping", "Architecture", "Desert"],
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
    bestTimeToVisit: "November-March",
    currency: "AED",
    language: "Arabic/English",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    weatherEmoji: "🏜️",
    avgTemp: { summer: 41, winter: 20 },
    weather: { summer: "41°C", fall: "32°C", winter: "20°C", spring: "28°C" },
    activities: ["Visit Burj Khalifa", "Shop at Dubai Mall", "Desert safari", "Explore Gold Souk", "Visit Palm Jumeirah"],
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    description:
      "An enchanting island paradise with iconic white-washed buildings, stunning sunsets over the caldera, and crystal-clear Aegean waters.",
    imageUrl:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    rating: 4.9,
    priceLevel: 3,
    tags: ["Romance", "Beach", "Photography", "Wine"],
    highlights: [
      "Oia Sunset",
      "Red Beach",
      "Ancient Akrotiri",
      "Wine Tasting",
    ],
    bestTimeToVisit: "April-October",
    currency: "EUR",
    language: "Greek",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    weatherEmoji: "🌅",
    avgTemp: { summer: 29, winter: 12 },
    weather: { summer: "29°C", fall: "20°C", winter: "12°C", spring: "18°C" },
    activities: ["Watch sunset in Oia", "Explore Red Beach", "Wine tasting tour", "Sail around caldera", "Visit ancient Akrotiri"],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    description:
      "The cultural heart of Japan, home to thousands of temples, traditional geisha districts, serene zen gardens, and exquisite kaiseki cuisine.",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    rating: 4.8,
    priceLevel: 2,
    tags: ["Culture", "History", "Nature", "Temples"],
    highlights: [
      "Fushimi Inari Shrine",
      "Arashiyama Bamboo Grove",
      "Kinkaku-ji",
      "Gion District",
    ],
    bestTimeToVisit: "March-May, October-November",
    currency: "JPY",
    language: "Japanese",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    weatherEmoji: "🍁",
    avgTemp: { summer: 28, winter: 5 },
    weather: { summer: "28°C", fall: "17°C", winter: "5°C", spring: "15°C" },
    activities: ["Walk Fushimi Inari", "Visit Bamboo Grove", "Explore Kinkaku-ji", "Tea ceremony", "Walk through Gion"],
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    description:
      "A tropical paradise of over 1,000 coral islands featuring overwater villas, pristine beaches, world-class diving, and unparalleled luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    rating: 4.9,
    priceLevel: 3,
    tags: ["Beach", "Luxury", "Diving", "Romance"],
    highlights: [
      "Overwater Villas",
      "Bioluminescent Beach",
      "Coral Reefs",
      "Spa Retreats",
    ],
    bestTimeToVisit: "November-April",
    currency: "MVR",
    language: "Dhivehi/English",
    coordinates: { lat: 3.2028, lng: 73.2207 },
    weatherEmoji: "🐠",
    avgTemp: { summer: 31, winter: 29 },
    weather: { summer: "31°C", fall: "30°C", winter: "29°C", spring: "30°C" },
    activities: ["Snorkel with manta rays", "Watch bioluminescence", "Spa treatment", "Sunset dolphin cruise", "Scuba diving"],
  },
  {
    id: "iceland",
    name: "Iceland",
    country: "Iceland",
    description:
      "Land of fire and ice featuring dramatic landscapes, geothermal wonders, glaciers, waterfalls, and the mesmerizing Northern Lights.",
    imageUrl:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    rating: 4.7,
    priceLevel: 3,
    tags: ["Nature", "Adventure", "Photography", "Northern Lights"],
    highlights: [
      "Northern Lights",
      "Blue Lagoon",
      "Golden Circle",
      "Glacier Hiking",
    ],
    bestTimeToVisit: "June-August, September-March (Northern Lights)",
    currency: "ISK",
    language: "Icelandic/English",
    coordinates: { lat: 64.9631, lng: -19.0208 },
    weatherEmoji: "🌌",
    avgTemp: { summer: 13, winter: -1 },
    weather: { summer: "13°C", fall: "5°C", winter: "-1°C", spring: "4°C" },
    activities: ["Chase Northern Lights", "Swim in Blue Lagoon", "Drive Golden Circle", "Hike on glacier", "Explore ice caves"],
  },
];

export const travelTips: TravelTip[] = [
  {
    id: "1",
    category: "transport",
    title: "Book flights early",
    content:
      "Book your flights at least 6-8 weeks in advance for the best prices on international travel.",
  },
  {
    id: "2",
    category: "money",
    title: "Notify your bank",
    content:
      "Always notify your bank before traveling internationally to avoid having your cards blocked.",
  },
  {
    id: "3",
    category: "culture",
    title: "Learn basic phrases",
    content:
      "Learning hello, thank you, and please in the local language goes a long way with locals.",
  },
  {
    id: "4",
    category: "safety",
    title: "Copy important documents",
    content:
      "Keep digital copies of your passport, ID, and important documents in a secure cloud storage.",
  },
  {
    id: "5",
    category: "food",
    title: "Eat where locals eat",
    content:
      "Skip tourist restaurants and find where locals dine for authentic and affordable food.",
  },
];

// AI-generated activity suggestions based on destination
export const activitySuggestions: Record<string, string[]> = {
  tokyo: [
    "Visit Senso-ji Temple at sunrise",
    "Experience the Shibuya crossing rush hour",
    "Explore Akihabara electronics district",
    "Try authentic ramen in a local shop",
    "Watch a sumo wrestling practice",
    "Stroll through Ueno Park",
    "Shop in Harajuku for unique fashion",
    "Visit teamLab Borderless digital art museum",
  ],
  paris: [
    "Watch sunrise at the Eiffel Tower",
    "Explore the Louvre's hidden gems",
    "Take a Seine river cruise at night",
    "Visit Montmartre and Sacré-Cœur",
    "Enjoy croissants at a local café",
    "Explore the Latin Quarter",
    "Visit the Palace of Versailles",
    "Walk through Jardin des Tuileries",
  ],
  bali: [
    "Sunrise trek at Mount Batur",
    "Visit Tegallalang Rice Terraces",
    "Explore Ubud Monkey Forest",
    "Attend a traditional Balinese ceremony",
    "Surf at Uluwatu Beach",
    "Visit Tanah Lot Temple at sunset",
    "Take a cooking class",
    "Relax at a luxury spa",
  ],
  "new-york": [
    "Walk across Brooklyn Bridge at sunrise",
    "Catch a Broadway show",
    "Visit the 9/11 Memorial",
    "Explore Central Park by bike",
    "See the view from Top of the Rock",
    "Visit the Met Museum",
    "Walk the High Line",
    "Try pizza in Little Italy",
  ],
  barcelona: [
    "Tour the Sagrada Familia",
    "Explore Park Güell's mosaics",
    "Walk down La Rambla",
    "Visit the Gothic Quarter",
    "Relax at Barceloneta Beach",
    "Watch flamenco show",
    "Visit La Boqueria market",
    "Explore the Picasso Museum",
  ],
  dubai: [
    "Visit Burj Khalifa observation deck",
    "Shop at Dubai Mall",
    "Desert safari with BBQ dinner",
    "Explore the Gold Souk",
    "Visit Palm Jumeirah",
    "Take an abra ride on Dubai Creek",
    "Visit Dubai Marina at night",
    "Experience indoor skiing",
  ],
  santorini: [
    "Watch sunset in Oia",
    "Explore Red Beach",
    "Visit ancient Akrotiri ruins",
    "Wine tasting tour",
    "Sail around the caldera",
    "Hike from Fira to Oia",
    "Swim in hot springs",
    "Explore Fira's clifftop shops",
  ],
  kyoto: [
    "Walk through Fushimi Inari's torii gates",
    "Visit Arashiyama Bamboo Grove",
    "Explore Kinkaku-ji Golden Pavilion",
    "Tea ceremony experience",
    "Walk through Gion at dusk",
    "Visit Nijo Castle",
    "Explore Philosopher's Path",
    "Try traditional kaiseki meal",
  ],
  maldives: [
    "Snorkel with manta rays",
    "Watch bioluminescent plankton at night",
    "Spa treatment over the water",
    "Sunset dolphin cruise",
    "Scuba diving at coral reefs",
    "Private beach picnic",
    "Underwater restaurant dining",
    "Island hopping tour",
  ],
  iceland: [
    "Chase the Northern Lights",
    "Swim in Blue Lagoon",
    "Drive the Golden Circle",
    "Hike on a glacier",
    "Visit Gullfoss waterfall",
    "Explore ice caves",
    "Whale watching tour",
    "Visit Jökulsárlón glacier lagoon",
  ],
};

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function searchDestinations(query: string): Destination[] {
  const lowercaseQuery = query.toLowerCase();
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(lowercaseQuery) ||
      d.country.toLowerCase().includes(lowercaseQuery) ||
      d.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getActivitySuggestions(destinationId: string): string[] {
  return activitySuggestions[destinationId] || [];
}
