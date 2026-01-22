"use i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Plus,
  Trash2,
  Check,
  Package,
  Plane,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTripStore, type Trip } from "@/store/tripStore";
import { getDestinationById } from "@/data/destinations";
import ShareTrip from "@/components/ShareTrip";
import TravelChecklist from "@/components/TravelChecklist";
import ExpenseTracker from "@/components/ExpenseTracker";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { trips, deleteTrip } = useTripStore();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(
    trips[0]?.id || null
  );

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const destination = selectedTrip
    ? getDestinationById(selectedTrip.destinationId)
    : null;

  const getDaysUntilTrip = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <>Trip Dashboard</>
          </h1>
          <p className="text-gray-400">
            <>Manage your trips, track expenses, and prepare for your adventures.</>
          </p>
        </div>

        {trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Trip List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  <>Your Trips</> ({trips.length})
                </h2>
                <Link
                  to="/planner"
                  className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </Link>
              </div>

              <div className="space-y-3">
                {trips.map((trip) => {
                  const dest = getDestinationById(trip.destinationId);
                  const daysUntil = getDaysUntilTrip(trip.startDate);
                  const isSelected = trip.id === selectedTripId;

                  return (
                    <button
                      key={trip.id}
                      className={`w-full text-left glass-card p-4 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? "border-sky-500/50 bg-sky-500/10"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => setSelectedTripId(trip.id)}
                    >
                      <div className="flex items-start gap-3">
                        {dest && (
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {trip.name}
                          </h3>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {dest?.name || trip.destinationId}
                          </p>
                        </div>
                        <div className="text-right">
                          {daysUntil > 0 ? (
                            <div className="text-sky-400 text-sm font-medium">
                              {daysUntil}d
                            </div>
                          ) : daysUntil === 0 ? (
                            <div className="text-emerald-400 text-sm font-medium">
                              <>Today!</>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">
                              <>Past</>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Travel Checklist - Shown below trip list */}
              {selectedTrip && (
                <TravelChecklist tripStartDate={selectedTrip.startDate} />
              )}
            </div>

            {/* Trip Details */}
            <div className="lg:col-span-2">
              {selectedTrip && destination ? (
                <TripDetails
                  trip={selectedTrip}
                  destination={destination}
                  onDelete={() => {
                    deleteTrip(selectedTrip.id);
                    setSelectedTripId(trips.find((t) => t.id !== selectedTrip.id)?.id || null);
                  }}
                />
              ) : (
                <div className="glass-card p-12 text-center">
                  <p className="text-gray-400">
                    <>Select a trip to view details</>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TripDetails({
  trip,
  destination,
  onDelete,
}: {
  trip: Trip;
  destination: NonNullable<ReturnType<typeof getDestinationById>>;
  onDelete: () => void;
}) {
  const { getTotalExpenses, addPackingItem, togglePackingItem, removePackingItem } = useTripStore();
  const [newPackingItem, setNewPackingItem] = useState({ name: "", category: "Essentials" });

  const getDaysUntilTrip = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getTripDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysUntil = getDaysUntilTrip(trip.startDate);
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const totalExpenses = getTotalExpenses(trip.id);
  const budgetUsed = trip.budget > 0 ? (totalExpenses / trip.budget) * 100 : 0;
  const packedCount = trip.packingList.filter((i) => i.packed).length;

  const handleAddPackingItem = () => {
    if (!newPackingItem.name) return;
    addPackingItem(trip.id, newPackingItem);
    setNewPackingItem({ name: "", category: "Essentials" });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="glass-card overflow-hidden">
        <div className="relative h-48">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">{trip.name}</h2>
            <p className="text-gray-300 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {destination.name}, {destination.country}
            </p>
          </div>
          <button
            onClick={onDelete}
            className="absolute top-4 right-4 w-10 h-10 rounded-lg glass hover:bg-red-500/20 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label={<>Days Until</>}
          value={daysUntil.toString()}
          color="sky"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label={<>Duration</>}
          value={`${duration} days`}
          color="violet"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label={<>Travelers</>}
          value={trip.travelers.toString()}
          color="emerald"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label={<>Budget</>}
          value={`${trip.currency} ${trip.budget}`}
          color="amber"
        />
      </div>

      {/* Budget Progress */}
      {trip.budget > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm"><>Budget Used</></span>
            <span className="text-white font-semibold">
              {trip.currency} {totalExpenses.toFixed(2)} / {trip.budget}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill transition-all duration-500"
              style={{
                width: `${Math.min(budgetUsed, 100)}%`,
                background: budgetUsed > 90
                  ? "linear-gradient(to right, #ef4444, #f97316)"
                  : budgetUsed > 70
                  ? "linear-gradient(to right, #f59e0b, #eab308)"
                  : undefined,
              }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {budgetUsed.toFixed(0)}% <>used</>
          </p>
        </div>
      )}

      {/* Expenses Tracker & Packing */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Expenses - Using the new component */}
        <ExpenseTracker budget={trip.budget} currency={trip.currency} />

        {/* Packing List */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-400" />
            <>Packing List</>
            <span className="text-gray-500 text-sm ml-auto">
              {packedCount}/{trip.packingList.length}
            </span>
          </h3>

          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {trip.packingList.length === 0 ? (
              <p className="text-gray-500 text-sm"><>No items yet</></p>
            ) : (
              trip.packingList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group"
                >
                  <button
                    onClick={() => togglePackingItem(trip.id, item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      item.packed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {item.packed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${item.packed ? "text-gray-500 line-through" : "text-white"}`}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => removePackingItem(trip.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Item name"
              value={newPackingItem.name}
              onChange={(e) => setNewPackingItem({ ...newPackingItem, name: e.target.value })}
              className="input-field flex-1 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddPackingItem()}
            />
            <button
              onClick={handleAddPackingItem}
              className="w-10 h-10 rounded-lg bg-violet-500 hover:bg-violet-400 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Trip */}
      <ShareTrip trip={trip} />

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          to="/planner"
          search={{ destination: trip.destinationId }}
          className="btn-secondary flex-1 text-center flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <>Edit Itinerary</>
        </Link>
        <Link
          to="/destination/$destinationId"
          params={{ destinationId: trip.destinationId }}
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <span className="relative z-10"><>View Destination</></span>
          <ArrowRight className="w-4 h-4 relative z-10" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: string;
  color: "sky" | "violet" | "emerald" | "amber";
}) {
  const colorClasses = {
    sky: "text-sky-400 bg-sky-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
  };

  return (
    <div className="glass-card p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-12 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center">
        <Plane className="w-10 h-10 text-sky-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        <>No Trips Yet</>
      </h2>
      <p className="text-gray-400 mb-6">
        <>Start planning your first adventure. Our AI will help you create the perfect itinerary.</>
      </p>
      <Link to="/planner" className="btn-primary inline-flex items-center gap-2">
        <Sparkles className="w-5 h-5 relative z-10" />
        <span className="relative z-10"><>Create Your First Trip</></span>
      </Link>
    </div>
  );
}
