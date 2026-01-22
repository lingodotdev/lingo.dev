import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItineraryItem } from "@/types";

interface Trip {
  id: string;
  name: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  items: ItineraryItem[];
  expenses: Expense[];
  packingList: PackingItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Expense {
  id: string;
  category: "transport" | "accommodation" | "food" | "activities" | "shopping" | "other";
  description: string;
  amount: number;
  date: string;
}

interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

interface TripStore {
  trips: Trip[];
  currentTripId: string | null;
  
  // Trip actions
  createTrip: (trip: Omit<Trip, "id" | "createdAt" | "updatedAt" | "expenses" | "packingList" | "notes">) => string;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (id: string | null) => void;
  getCurrentTrip: () => Trip | null;
  
  // Itinerary actions
  addItineraryItem: (tripId: string, item: Omit<ItineraryItem, "id">) => void;
  updateItineraryItem: (tripId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
  removeItineraryItem: (tripId: string, itemId: string) => void;
  
  // Expense actions
  addExpense: (tripId: string, expense: Omit<Expense, "id">) => void;
  removeExpense: (tripId: string, expenseId: string) => void;
  getTotalExpenses: (tripId: string) => number;
  
  // Packing list actions
  addPackingItem: (tripId: string, item: Omit<PackingItem, "id" | "packed">) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  removePackingItem: (tripId: string, itemId: string) => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      trips: [],
      currentTripId: null,

      createTrip: (tripData) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newTrip: Trip = {
          ...tripData,
          id,
          expenses: [],
          packingList: [],
          notes: "",
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ trips: [...state.trips, newTrip], currentTripId: id }));
        return id;
      },

      updateTrip: (id, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id
              ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
              : trip
          ),
        }));
      },

      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
          currentTripId: state.currentTripId === id ? null : state.currentTripId,
        }));
      },

      setCurrentTrip: (id) => set({ currentTripId: id }),

      getCurrentTrip: () => {
        const { trips, currentTripId } = get();
        return trips.find((t) => t.id === currentTripId) || null;
      },

      addItineraryItem: (tripId, item) => {
        const id = crypto.randomUUID();
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  items: [...trip.items, { ...item, id }],
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      updateItineraryItem: (tripId, itemId, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  items: trip.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      removeItineraryItem: (tripId, itemId) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  items: trip.items.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      addExpense: (tripId, expense) => {
        const id = crypto.randomUUID();
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  expenses: [...trip.expenses, { ...expense, id }],
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      removeExpense: (tripId, expenseId) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  expenses: trip.expenses.filter((e) => e.id !== expenseId),
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      getTotalExpenses: (tripId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        return trip?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
      },

      addPackingItem: (tripId, item) => {
        const id = crypto.randomUUID();
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  packingList: [...trip.packingList, { ...item, id, packed: false }],
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      togglePackingItem: (tripId, itemId) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  packingList: trip.packingList.map((item) =>
                    item.id === itemId ? { ...item, packed: !item.packed } : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },

      removePackingItem: (tripId, itemId) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  packingList: trip.packingList.filter((item) => item.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : trip
          ),
        }));
      },
    }),
    {
      name: "ai-travel-planner-trips",
    }
  )
);

export type { Trip, Expense, PackingItem };
