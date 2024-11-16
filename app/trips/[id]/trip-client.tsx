"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { TripHero } from "@/components/trips/trip-hero"
import { TripCardsGrid } from "@/components/trips/trip-cards-grid"
import { Trip } from "@/lib/types/trip"
import { supabase } from "@/lib/supabase"

export default function TripClient({ 
  initialTrip 
}: { 
  initialTrip: Trip | null 
}) {
  const [trip, setTrip] = useState<Trip | null>(initialTrip)
  const [loading, setLoading] = useState(!initialTrip)

  useEffect(() => {
    if (!initialTrip) {
      setLoading(true)
      const fetchTrip = async () => {
        try {
          const { data } = await supabase
            .from("trips")
            .select("*")
            .eq("id", initialTrip?.id)
            .single()
          setTrip(data)
        } catch (error) {
          console.error("Error fetching trip:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchTrip()
    }
  }, [initialTrip])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-pulse text-lg">Loading trip details...</div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-lg text-muted-foreground">Trip not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TripHero trip={trip} />
      <main className="container mx-auto px-4 py-8">
        <TripCardsGrid tripId={trip.id} />
      </main>
    </div>
  )
}