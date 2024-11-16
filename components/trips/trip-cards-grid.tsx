"use client"

import { TripCard } from "./trip-card"

const tripCards = [
  {
    id: "travel",
    title: "Travel",
    description: "Plan your journey",
    longDescription: "Book flights, arrange transportation, and organize your travel itinerary.",
    icon: "Plane",
    href: "travel"
  },
  {
    id: "food",
    title: "Food",
    description: "Discover local cuisine",
    longDescription: "Explore local restaurants, food tours, and culinary experiences.",
    icon: "Utensils",
    href: "food"
  },
  {
    id: "activities",
    title: "Things to Do",
    description: "Explore activities",
    longDescription: "Discover attractions, tours, and unique experiences in the city.",
    icon: "MapPin",
    href: "activities"
  },
  {
    id: "expenses",
    title: "Expense Tracker",
    description: "Manage your budget",
    longDescription: "Track expenses, set budgets, and manage your travel spending.",
    icon: "Wallet",
    href: "expenses"
  },
  {
    id: "journal",
    title: "Journal",
    description: "Record your memories",
    longDescription: "Document your travel experiences, photos, and memorable moments.",
    icon: "BookOpen",
    href: "journal"
  }
]

interface TripCardsGridProps {
  tripId: string
}

export function TripCardsGrid({ tripId }: TripCardsGridProps) {
  // Split cards into two groups: top 3 and bottom 2
  const topCards = tripCards.slice(0, 3)
  const bottomCards = tripCards.slice(3)

  return (
    <div className="space-y-6">
      {/* Top three cards - maintain original grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCards.map((card) => (
          <TripCard key={card.id} tripId={tripId} {...card} />
        ))}
      </div>

      {/* Bottom two cards - split space evenly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bottomCards.map((card) => (
          <TripCard key={card.id} tripId={tripId} {...card} />
        ))}
      </div>
    </div>
  )
}