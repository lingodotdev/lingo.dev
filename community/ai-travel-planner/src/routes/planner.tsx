"use i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Wallet,
  ChevronDown,
  Wand2,
  Save,
  ArrowRight,
  Lightbulb,
  Shuffle,
} from "lucide-react";
import { destinations, getDestinationById, getActivitySuggestions } from "@/data/destinations";
import { useTripStore } from "@/store/tripStore";
import type { ItineraryItem } from "@/types";

interface PlannerSearch {
  destination?: string;
}

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  validateSearch: (search: Record<string, unknown>): PlannerSearch => {
    return {
      destination: search.destination as string | undefined,
    };
  },
});

function PlannerPage() {
  const navigate = useNavigate();
  const { destination: preselectedDestination } = Route.useSearch();
  const { createTrip } = useTripStore();

  const [tripName, setTripName] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(preselectedDestination || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState(1000);
  const [currency] = useState("USD");
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [newItem, setNewItem] = useState({
    day: 1,
    time: "09:00",
    activity: "",
    location: "",
    duration: "2 hours",
    category: "sightseeing" as const,
  });

  const destination = getDestinationById(selectedDestination);
  const suggestions = selectedDestination ? getActivitySuggestions(selectedDestination) : [];

  const getDayCount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff + 1);
  };

  const dayCount = getDayCount();

  const itemsByDay = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.day]) acc[item.day] = [];
      acc[item.day].push(item);
      return acc;
    }, {} as Record<number, ItineraryItem[]>);
  }, [items]);

  const addItem = () => {
    if (!newItem.activity || !newItem.location) return;

    const item: ItineraryItem = {
      id: crypto.randomUUID(),
      ...newItem,
    };
    setItems([...items, item]);
    setNewItem({
      ...newItem,
      time: "09:00",
      activity: "",
      location: "",
    });
  };

  const addSuggestion = (suggestion: string) => {
    const item: ItineraryItem = {
      id: crypto.randomUUID(),
      day: newItem.day,
      time: `${9 + (items.filter(i => i.day === newItem.day).length * 3)}:00`.padStart(5, "0"),
      activity: suggestion,
      location: destination?.name || "",
      duration: "3 hours",
      category: "sightseeing",
    };
    setItems([...items, item]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const generateAIItinerary = async () => {
    if (!selectedDestination || dayCount === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with smart suggestions
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const activitiesPerDay = Math.min(4, Math.floor(8 / (travelers > 2 ? 1.5 : 1)));
    const availableSuggestions = [...suggestions];
    const generatedItems: ItineraryItem[] = [];
    
    for (let day = 1; day <= Math.min(dayCount, 5); day++) {
      const times = ["09:00", "12:00", "15:00", "19:00"];
      const durations = ["2 hours", "1.5 hours", "3 hours", "2 hours"];
      const categories: ItineraryItem["category"][] = ["sightseeing", "food", "activity", "food"];
      
      for (let i = 0; i < activitiesPerDay && availableSuggestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableSuggestions.length);
        const activity = availableSuggestions.splice(randomIndex, 1)[0];
        
        generatedItems.push({
          id: crypto.randomUUID(),
          day,
          time: times[i],
          activity,
          location: destination?.name || "",
          duration: durations[i],
          category: categories[i],
        });
      }
    }
    
    setItems(generatedItems);
    setIsGenerating(false);
  };

  const saveTrip = () => {
    if (!selectedDestination || !startDate || !endDate || !tripName) return;
    
    createTrip({
      name: tripName,
      destinationId: selectedDestination,
      startDate,
      endDate,
      travelers,
      budget,
      currency,
      items,
    });
    
    navigate({ to: "/dashboard" });
  };

  const categoryColors = {
    sightseeing: "bg-sky-500/20 text-sky-400",
    food: "bg-amber-500/20 text-amber-400",
    transport: "bg-emerald-500/20 text-emerald-400",
    accommodation: "bg-violet-500/20 text-violet-400",
    activity: "bg-pink-500/20 text-pink-400",
    free: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            <>AI Trip Planner</>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            <>
              Create your perfect travel itinerary. Let AI suggest activities or
              build your own day-by-day plan.
            </>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trip Details Card */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <>Trip Details</>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <>Trip Name</>
                  </label>
                  <input
                    type="text"
                    placeholder="My Amazing Trip"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    <>Destination</>
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.weatherEmoji} {d.name}, {d.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <>Start Date</>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <>End Date</>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      <>Travelers</>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={travelers}
                      onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Wallet className="w-4 h-4 inline mr-1" />
                      <>Budget</>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Preview */}
              {destination && (
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{destination.name}</h3>
                      <p className="text-sm text-gray-400">{destination.country}</p>
                      <p className="text-xs text-gray-500">{destination.bestTimeToVisit}</p>
                    </div>
                  </div>
                </div>
              )}

              {dayCount > 0 && (
                <div className="mt-4 text-center p-3 rounded-xl bg-gradient-to-r from-sky-500/10 to-violet-500/10 border border-sky-500/20">
                  <span className="text-sky-400 font-semibold text-lg">
                    {dayCount} {dayCount === 1 ? <>day</> : <>days</>}
                  </span>
                  <span className="text-gray-400 ml-2">
                    <>of adventure</>
                  </span>
                </div>
              )}
            </div>

            {/* AI Generate Button */}
            {dayCount > 0 && selectedDestination && (
              <button
                onClick={generateAIItinerary}
                disabled={isGenerating}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full relative z-10 animate-spin" />
                    <span className="relative z-10"><>Generating...</></span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 relative z-10" />
                    <span className="relative z-10"><>Generate AI Itinerary</></span>
                  </>
                )}
              </button>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="glass-card p-4">
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="w-full flex items-center justify-between text-white font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <>Activity Ideas</>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${showSuggestions ? "rotate-180" : ""}`}
                  />
                </button>

                {showSuggestions && (
                  <div className="overflow-hidden">
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => addSuggestion(suggestion)}
                          className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors flex items-center gap-2 hover:translate-x-1 transition-transform"
                        >
                          <Plus className="w-4 h-4 text-sky-400 flex-shrink-0" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Activity Form */}
            {dayCount > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <>Add Activity</>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <>Day</>
                      </label>
                      <select
                        value={newItem.day}
                        onChange={(e) => setNewItem({ ...newItem, day: parseInt(e.target.value) })}
                        className="input-field"
                      >
                        {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            Day {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        <>Time</>
                      </label>
                      <input
                        type="time"
                        value={newItem.time}
                        onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <>Activity</>
                    </label>
                    <input
                      type="text"
                      placeholder="Visit the Eiffel Tower"
                      value={newItem.activity}
                      onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <>Location</>
                    </label>
                    <input
                      type="text"
                      placeholder="Champ de Mars, Paris"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <button
                    onClick={addItem}
                    disabled={!newItem.activity || !newItem.location}
                    className="w-full btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    <>Add to Itinerary</>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Itinerary Display */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  <>Your itinerary is empty</>
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  <>
                    Fill in your trip details and click "Generate AI Itinerary" for instant
                    suggestions, or add activities manually.
                  </>
                </p>
                {!selectedDestination && (
                  <Link to="/destinations" className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-2">
                    <>Browse destinations for inspiration</>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    <>Your Itinerary</>
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      {items.length} {items.length === 1 ? <>activity</> : <>activities</>}
                    </span>
                    <button
                      onClick={() => setItems([])}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => {
                  const dayItems = itemsByDay[day] || [];
                  if (dayItems.length === 0) return null;

                  return (
                    <div key={day} className="glass-card p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white font-bold">
                          {day}
                        </span>
                        <>Day {day}</>
                        <span className="text-gray-500 text-sm font-normal ml-auto">
                          {dayItems.length} {dayItems.length === 1 ? <>activity</> : <>activities</>}
                        </span>
                      </h3>

                      <div className="space-y-3">
                        {dayItems
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 group hover:bg-white/10 transition-colors"
                            >
                              <div className="text-sky-400 font-mono text-sm font-semibold min-w-[50px] pt-1">
                                {item.time}
                              </div>
                              <div className="w-px h-full min-h-[40px] bg-gradient-to-b from-sky-500 to-violet-500" />
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{item.activity}</h4>
                                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[item.category || "sightseeing"]}`}>
                                    {item.category || "sightseeing"}
                                  </span>
                                  <span className="text-xs text-gray-500">{item.duration}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}

                {/* Save Trip Button */}
                {items.length > 0 && tripName && selectedDestination && startDate && endDate && (
                  <button
                    onClick={saveTrip}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <Save className="w-5 h-5 relative z-10" />
                    <span className="relative z-10"><>Save Trip to Dashboard</></span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
