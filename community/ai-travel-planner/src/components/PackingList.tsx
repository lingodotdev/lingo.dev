"use i18n";
import { useState } from "react";
import { Luggage, Plus, Check, Trash2, Wand2, Sun, Camera, Shirt, Plug } from "lucide-react";
import type { Destination } from "@/types";

interface PackingListProps {
  destination?: Destination;
  tripDays?: number;
}

interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

// AI-powered packing suggestions based on destination
const getPackingSuggestions = (destination?: Destination, days: number = 7): PackingItem[] => {
  const baseItems: PackingItem[] = [
    { id: "1", name: "Passport & ID", category: "documents", packed: false },
    { id: "2", name: "Travel insurance docs", category: "documents", packed: false },
    { id: "3", name: "Phone & charger", category: "electronics", packed: false },
    { id: "4", name: "Power adapter", category: "electronics", packed: false },
    { id: "5", name: "Medications", category: "health", packed: false },
    { id: "6", name: "Toiletries", category: "health", packed: false },
    { id: "7", name: "Underwear", category: "clothing", packed: false },
    { id: "8", name: "Socks", category: "clothing", packed: false },
  ];

  // Add items based on weather/destination type
  if (destination) {
    const isHot = destination.avgTemp.summer > 25;
    const isCold = destination.avgTemp.winter < 10;
    const isBeach = destination.tags.includes("Beach");
    const isAdventure = destination.tags.includes("Adventure") || destination.tags.includes("Nature");
    const isUrban = destination.tags.includes("Urban") || destination.tags.includes("Shopping");
    
    if (isHot || isBeach) {
      baseItems.push(
        { id: "h1", name: "Sunscreen SPF 50+", category: "health", packed: false },
        { id: "h2", name: "Sunglasses", category: "accessories", packed: false },
        { id: "h3", name: "Hat/Cap", category: "accessories", packed: false },
        { id: "h4", name: "Light breathable shirts", category: "clothing", packed: false },
        { id: "h5", name: "Shorts", category: "clothing", packed: false },
      );
    }
    
    if (isBeach) {
      baseItems.push(
        { id: "b1", name: "Swimsuit", category: "clothing", packed: false },
        { id: "b2", name: "Beach towel", category: "accessories", packed: false },
        { id: "b3", name: "Flip flops", category: "footwear", packed: false },
        { id: "b4", name: "Snorkel gear (optional)", category: "gear", packed: false },
      );
    }
    
    if (isCold) {
      baseItems.push(
        { id: "c1", name: "Warm jacket", category: "clothing", packed: false },
        { id: "c2", name: "Sweaters/Fleece", category: "clothing", packed: false },
        { id: "c3", name: "Thermal underwear", category: "clothing", packed: false },
        { id: "c4", name: "Gloves", category: "accessories", packed: false },
        { id: "c5", name: "Scarf/Beanie", category: "accessories", packed: false },
      );
    }
    
    if (isAdventure) {
      baseItems.push(
        { id: "a1", name: "Hiking boots", category: "footwear", packed: false },
        { id: "a2", name: "Backpack", category: "gear", packed: false },
        { id: "a3", name: "Water bottle", category: "gear", packed: false },
        { id: "a4", name: "First aid kit", category: "health", packed: false },
      );
    }
    
    if (isUrban) {
      baseItems.push(
        { id: "u1", name: "Comfortable walking shoes", category: "footwear", packed: false },
        { id: "u2", name: "Crossbody bag", category: "accessories", packed: false },
        { id: "u3", name: "Smart casual outfit", category: "clothing", packed: false },
      );
    }
    
    // Always recommend camera for travel
    baseItems.push(
      { id: "cam", name: "Camera", category: "electronics", packed: false },
    );
  }

  // Add items based on trip length
  if (days > 5) {
    baseItems.push(
      { id: "d1", name: "Laundry bag", category: "accessories", packed: false },
    );
  }

  return baseItems;
};

const categoryIcons: Record<string, React.ReactNode> = {
  documents: <Luggage className="w-4 h-4" />,
  electronics: <Plug className="w-4 h-4" />,
  clothing: <Shirt className="w-4 h-4" />,
  health: <Plus className="w-4 h-4" />,
  accessories: <Sun className="w-4 h-4" />,
  footwear: <Luggage className="w-4 h-4" />,
  gear: <Camera className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  documents: "bg-blue-500/20 text-blue-400",
  electronics: "bg-purple-500/20 text-purple-400",
  clothing: "bg-pink-500/20 text-pink-400",
  health: "bg-red-500/20 text-red-400",
  accessories: "bg-amber-500/20 text-amber-400",
  footwear: "bg-emerald-500/20 text-emerald-400",
  gear: "bg-cyan-500/20 text-cyan-400",
};

export default function PackingList({ destination, tripDays = 7 }: PackingListProps) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("clothing");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateList = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setItems(getPackingSuggestions(destination, tripDays));
    setIsGenerating(false);
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        name: newItemName,
        category: newItemCategory,
        packed: false,
      },
    ]);
    setNewItemName("");
  };

  const packedCount = items.filter(i => i.packed).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Luggage className="w-5 h-5 text-amber-400" />
          <>Packing List</>
        </h3>
        {items.length > 0 && (
          <span className="text-sm text-gray-400">
            {packedCount}/{items.length} <>packed</>
          </span>
        )}
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {progress === 100 ? <>All packed! Ready to go!</> : <>{Math.round(progress)}% complete</>}
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Luggage className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-gray-400 mb-4">
            <>Generate a smart packing list based on your destination</>
          </p>
          <button
            onClick={generateList}
            disabled={isGenerating}
            className="btn-primary py-3 px-6 inline-flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full relative z-10 animate-spin" />
                <span className="relative z-10"><>Generating...</></span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 relative z-10" />
                <span className="relative z-10"><>Generate Packing List</></span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add new item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              placeholder="Add item..."
              className="flex-1 input-field text-sm"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="input-field w-28 text-sm"
            >
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="health">Health</option>
              <option value="accessories">Accessories</option>
              <option value="footwear">Footwear</option>
              <option value="gear">Gear</option>
            </select>
            <button
              onClick={addItem}
              className="w-10 h-10 rounded-lg bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Grouped items */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${categoryColors[category]}`}>
                    {categoryIcons[category]}
                  </span>
                  <span className="text-sm font-medium text-gray-300 capitalize">{category}</span>
                  <span className="text-xs text-gray-500">({categoryItems.filter(i => i.packed).length}/{categoryItems.length})</span>
                </div>
                <div className="space-y-1 pl-8">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all group ${
                        item.packed ? "bg-emerald-500/10" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          item.packed
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-500 hover:border-sky-400"
                        }`}
                      >
                        {item.packed && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className={`flex-1 text-sm ${item.packed ? "text-gray-500 line-through" : "text-gray-300"}`}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Regenerate button */}
          <button
            onClick={generateList}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <>Regenerate List</>
          </button>
        </div>
      )}
    </div>
  );
}
