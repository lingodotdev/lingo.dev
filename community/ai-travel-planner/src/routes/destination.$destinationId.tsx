"use i18n";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  Clock,
  Heart,
  Plane,
  Compass,
  Camera,
} from "lucide-react";
import { getDestinationById } from "@/data/destinations";
import WeatherWidget from "@/components/WeatherWidget";
import CurrencyConverter from "@/components/CurrencyConverter";
import LocalPhrases from "@/components/LocalPhrases";
import PhotoGallery from "@/components/PhotoGallery";
import PackingList from "@/components/PackingList";

export const Route = createFileRoute("/destination/$destinationId")({
  component: DestinationDetailPage,
});

// Sample gallery images for each destination
const galleryImages: Record<string, { url: string; caption?: string }[]> = {
  tokyo: [
    { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", caption: "Tokyo Skyline" },
    { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80", caption: "Shibuya Crossing" },
    { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80", caption: "Traditional Temple" },
    { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", caption: "Cherry Blossoms" },
    { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80", caption: "Tokyo Tower" },
    { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=600&q=80", caption: "Street Food" },
  ],
  paris: [
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", caption: "Eiffel Tower" },
    { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", caption: "Paris Streets" },
    { url: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600&q=80", caption: "Louvre Museum" },
    { url: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600&q=80", caption: "Notre-Dame" },
    { url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80", caption: "Seine River" },
    { url: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80", caption: "Montmartre" },
  ],
  bali: [
    { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", caption: "Rice Terraces" },
    { url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80", caption: "Temple Gate" },
    { url: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80", caption: "Beach Sunset" },
    { url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80", caption: "Monkey Forest" },
    { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80", caption: "Tanah Lot Temple" },
    { url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80", caption: "Infinity Pool" },
  ],
  "new-york": [
    { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", caption: "Manhattan Skyline" },
    { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", caption: "Times Square" },
    { url: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&q=80", caption: "Brooklyn Bridge" },
    { url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80", caption: "Central Park" },
    { url: "https://images.unsplash.com/photo-1492666673288-3c4b4576ad9a?w=600&q=80", caption: "Statue of Liberty" },
    { url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=600&q=80", caption: "Empire State" },
  ],
  barcelona: [
    { url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80", caption: "Sagrada Familia" },
    { url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80", caption: "Park Güell" },
    { url: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600&q=80", caption: "La Rambla" },
    { url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80", caption: "Gothic Quarter" },
    { url: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=600&q=80", caption: "Beach" },
    { url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80", caption: "Architecture" },
  ],
  dubai: [
    { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", caption: "Burj Khalifa" },
    { url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80", caption: "Dubai Marina" },
    { url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80", caption: "Palm Jumeirah" },
    { url: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=600&q=80", caption: "Desert Safari" },
    { url: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=80", caption: "Dubai Frame" },
    { url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&q=80", caption: "Downtown" },
  ],
  santorini: [
    { url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80", caption: "Oia Sunset" },
    { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", caption: "Blue Domes" },
    { url: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=600&q=80", caption: "Caldera View" },
    { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80", caption: "White Houses" },
    { url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&q=80", caption: "Red Beach" },
    { url: "https://images.unsplash.com/photo-1507501336603-6e31db2be093?w=600&q=80", caption: "Fira Town" },
  ],
  kyoto: [
    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", caption: "Bamboo Grove" },
    { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", caption: "Kinkaku-ji" },
    { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80", caption: "Fushimi Inari" },
    { url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&q=80", caption: "Geisha District" },
    { url: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=80", caption: "Temple Gardens" },
    { url: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=600&q=80", caption: "Fall Colors" },
  ],
  maldives: [
    { url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", caption: "Overwater Villa" },
    { url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80", caption: "Crystal Waters" },
    { url: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80", caption: "Beach Paradise" },
    { url: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=600&q=80", caption: "Underwater" },
    { url: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80", caption: "Sunset" },
    { url: "https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=600&q=80", caption: "Resort" },
  ],
  iceland: [
    { url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80", caption: "Northern Lights" },
    { url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&q=80", caption: "Blue Lagoon" },
    { url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80", caption: "Waterfalls" },
    { url: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=600&q=80", caption: "Glaciers" },
    { url: "https://images.unsplash.com/photo-1509549649946-f1b6276d4f35?w=600&q=80", caption: "Geysers" },
    { url: "https://images.unsplash.com/photo-1490258336137-d6e8a5bbd0a3?w=600&q=80", caption: "Black Beach" },
  ],
};

// Currency mapping for destinations
const currencyMap: Record<string, string> = {
  JPY: "JPY",
  EUR: "EUR",
  IDR: "IDR",
  USD: "USD",
  AED: "AED",
  MVR: "MVR",
  ISK: "ISK",
};

function DestinationDetailPage() {
  const { destinationId } = useParams({ from: "/destination/$destinationId" });
  const destination = getDestinationById(destinationId);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            <>Destination not found</>
          </h1>
          <Link
            to="/destinations"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <>← Back to destinations</>
          </Link>
        </div>
      </div>
    );
  }

  const priceLabels = {
    1: <>Budget-friendly</>,
    2: <>Moderate</>,
    3: <>Premium</>,
  };

  const images = galleryImages[destinationId] || [];

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-6 md:left-12">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <>Back</>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
                <MapPin className="w-4 h-4" />
                {destination.country}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 text-sm">
                <Star className="w-4 h-4 fill-yellow-400" />
                {destination.rating}
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="w-6 h-6 text-cyan-400" />
                <>About this destination</>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {destination.description}
              </p>
            </section>

            {/* Photo Gallery */}
            {images.length > 0 && (
              <section className="glass-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-cyan-400" />
                  <>Photo Gallery</>
                </h2>
                <PhotoGallery images={images} destinationName={destination.name} />
              </section>
            )}

            {/* Weather Widget */}
            <WeatherWidget destination={destination} />

            {/* Highlights Section */}
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-cyan-400" />
                <>Top Highlights</>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-white font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activities Section */}
            {destination.activities && (
              <section className="glass-card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plane className="w-6 h-6 text-cyan-400" />
                  <>Things to Do</>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {destination.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 text-gray-300 text-center hover:border-cyan-500/30 transition-all"
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Local Phrases */}
            <LocalPhrases destination={destination} />

            {/* Tags Section */}
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                <>Tags</>
              </h2>
              <div className="flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <>Quick Info</>
              </h3>
              <div className="space-y-4">
                <InfoRow
                  icon={<Calendar className="w-5 h-5" />}
                  label={<>Best time to visit</>}
                  value={destination.bestTimeToVisit}
                />
                <InfoRow
                  icon={<DollarSign className="w-5 h-5" />}
                  label={<>Price level</>}
                  value={priceLabels[destination.priceLevel]}
                />
                <InfoRow
                  icon={<Globe className="w-5 h-5" />}
                  label={<>Language</>}
                  value={destination.language}
                />
                <InfoRow
                  icon={<Clock className="w-5 h-5" />}
                  label={<>Currency</>}
                  value={destination.currency}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  to="/planner"
                  search={{ destination: destination.id }}
                  className="block w-full"
                >
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2">
                    <Plane className="w-5 h-5" />
                    <>Plan a trip here</>
                  </button>
                </Link>
              </div>
            </div>

            {/* Currency Converter */}
            <CurrencyConverter defaultToCurrency={currencyMap[destination.currency] || "USD"} />

            {/* Packing List */}
            <PackingList destination={destination} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="text-cyan-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
