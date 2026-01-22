"use i18n";
import { useState } from "react";
import { ClipboardCheck, Check, Circle, AlertCircle, Clock, Calendar, Plane } from "lucide-react";

interface TravelChecklistProps {
  tripStartDate?: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  daysBeforeTrip: number; // When this should ideally be done
  category: "documents" | "health" | "finance" | "planning" | "packing";
  priority: "high" | "medium" | "low";
}

const defaultChecklist: Omit<ChecklistItem, "completed">[] = [
  // 8+ weeks before
  { id: "1", title: "Check passport validity", description: "Ensure passport is valid for 6+ months beyond travel dates", daysBeforeTrip: 60, category: "documents", priority: "high" },
  { id: "2", title: "Research visa requirements", description: "Check if you need a visa for your destination", daysBeforeTrip: 60, category: "documents", priority: "high" },
  { id: "3", title: "Book flights", description: "Compare prices and book your flights", daysBeforeTrip: 56, category: "planning", priority: "high" },
  { id: "4", title: "Book accommodation", description: "Reserve hotels, hostels, or vacation rentals", daysBeforeTrip: 50, category: "planning", priority: "high" },
  
  // 4-6 weeks before
  { id: "5", title: "Get travel insurance", description: "Purchase comprehensive travel insurance coverage", daysBeforeTrip: 42, category: "finance", priority: "high" },
  { id: "6", title: "Check vaccination requirements", description: "Consult doctor for required/recommended vaccines", daysBeforeTrip: 42, category: "health", priority: "high" },
  { id: "7", title: "Apply for visa (if needed)", description: "Submit visa application with required documents", daysBeforeTrip: 35, category: "documents", priority: "high" },
  { id: "8", title: "Notify bank of travel", description: "Inform your bank about travel dates to prevent card blocks", daysBeforeTrip: 30, category: "finance", priority: "medium" },
  
  // 2-4 weeks before
  { id: "9", title: "Book tours/activities", description: "Reserve popular attractions and tours in advance", daysBeforeTrip: 21, category: "planning", priority: "medium" },
  { id: "10", title: "Arrange airport transfer", description: "Book taxi, shuttle, or transportation from airport", daysBeforeTrip: 14, category: "planning", priority: "medium" },
  { id: "11", title: "Get foreign currency", description: "Exchange some cash or order foreign currency", daysBeforeTrip: 14, category: "finance", priority: "medium" },
  { id: "12", title: "Download offline maps", description: "Save Google Maps offline for your destination", daysBeforeTrip: 7, category: "planning", priority: "low" },
  
  // 1 week before
  { id: "13", title: "Check-in online", description: "Online check-in usually opens 24-48 hours before", daysBeforeTrip: 2, category: "documents", priority: "high" },
  { id: "14", title: "Confirm all reservations", description: "Double-check all bookings and print/save confirmations", daysBeforeTrip: 3, category: "planning", priority: "high" },
  { id: "15", title: "Pack your bags", description: "Use your packing list to prepare luggage", daysBeforeTrip: 2, category: "packing", priority: "high" },
  { id: "16", title: "Charge electronics", description: "Fully charge phone, camera, laptop, power bank", daysBeforeTrip: 1, category: "packing", priority: "medium" },
  
  // Day of travel
  { id: "17", title: "Bring passport & documents", description: "Passport, visa, insurance, booking confirmations", daysBeforeTrip: 0, category: "documents", priority: "high" },
  { id: "18", title: "Check flight status", description: "Verify your flight is on time before leaving for airport", daysBeforeTrip: 0, category: "planning", priority: "high" },
];

const categoryColors = {
  documents: "text-blue-400 bg-blue-500/20",
  health: "text-red-400 bg-red-500/20",
  finance: "text-emerald-400 bg-emerald-500/20",
  planning: "text-violet-400 bg-violet-500/20",
  packing: "text-amber-400 bg-amber-500/20",
};

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-gray-500",
};

export default function TravelChecklist({ tripStartDate }: TravelChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(
    defaultChecklist.map(item => ({ ...item, completed: false }))
  );

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getDaysUntilTrip = () => {
    if (!tripStartDate) return null;
    const today = new Date();
    const tripDate = new Date(tripStartDate);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilTrip = getDaysUntilTrip();

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  // Group by timeline
  const groupedItems = {
    overdue: items.filter(i => !i.completed && daysUntilTrip !== null && daysUntilTrip < i.daysBeforeTrip),
    dueSoon: items.filter(i => !i.completed && daysUntilTrip !== null && daysUntilTrip >= i.daysBeforeTrip && daysUntilTrip <= i.daysBeforeTrip + 7),
    upcoming: items.filter(i => !i.completed && (daysUntilTrip === null || daysUntilTrip > i.daysBeforeTrip + 7)),
    completed: items.filter(i => i.completed),
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-sky-400" />
          <>Pre-Trip Checklist</>
        </h3>
        {daysUntilTrip !== null && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            daysUntilTrip <= 7 ? "bg-red-500/20 text-red-400" : "bg-sky-500/20 text-sky-400"
          }`}>
            <Plane className="w-4 h-4" />
            {daysUntilTrip <= 0 ? <>Trip day!</> : <>{daysUntilTrip} days to go</>}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">{completedCount} of {items.length} <>completed</></span>
          <span className="text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {/* Overdue items */}
        {groupedItems.overdue.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400"><>Overdue</></span>
            </div>
            <div className="space-y-2">
              {groupedItems.overdue.map(item => (
                <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        )}

        {/* Due soon */}
        {groupedItems.dueSoon.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400"><>Due Soon</></span>
            </div>
            <div className="space-y-2">
              {groupedItems.dueSoon.map(item => (
                <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {groupedItems.upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400"><>Upcoming</></span>
            </div>
            <div className="space-y-2">
              {groupedItems.upcoming.map(item => (
                <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {groupedItems.completed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400"><>Completed</></span>
            </div>
            <div className="space-y-2">
              {groupedItems.completed.map(item => (
                <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChecklistItemRow({ item, onToggle }: { item: ChecklistItem; onToggle: (id: string) => void }) {
  return (
    <div
      className={`p-3 rounded-xl border-l-4 ${priorityColors[item.priority]} ${
        item.completed ? "bg-emerald-500/5" : "bg-white/5 hover:bg-white/10"
      } transition-all cursor-pointer`}
      onClick={() => onToggle(item.id)}
    >
      <div className="flex items-start gap-3">
        <button
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            item.completed
              ? "border-emerald-500 bg-emerald-500"
              : "border-gray-500 hover:border-sky-400"
          }`}
        >
          {item.completed ? (
            <Check className="w-3 h-3 text-white" />
          ) : (
            <Circle className="w-3 h-3 text-transparent" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${item.completed ? "text-gray-500 line-through" : "text-white"}`}>
              {item.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
              {item.category}
            </span>
          </div>
          <p className={`text-sm mt-1 ${item.completed ? "text-gray-600" : "text-gray-400"}`}>
            {item.description}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {item.daysBeforeTrip === 0 ? <>Day of travel</> : <>{item.daysBeforeTrip}+ days before</>}
          </p>
        </div>
      </div>
    </div>
  );
}
