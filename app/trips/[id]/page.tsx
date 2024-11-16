"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { TripDetails } from "@/components/trips/trip-details"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Trip } from "@/lib/types/trip"

export default function TripPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrip() {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", params.id)
        .single()

      if (data) {
        setTrip(data)
      }
      setLoading(false)
    }

    fetchTrip()
  }, [params.id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground">
            The trip you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return <TripDetails trip={trip} />
}