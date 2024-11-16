"use client"

import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { Trip } from "@/lib/types/trip"

interface TripHeroProps {
  trip: Trip
}

export function TripHero({ trip }: TripHeroProps) {
  return (
    <div 
      className="relative h-[500px] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${trip.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      <div className="absolute bottom-12 left-8 right-8 text-white">
        <h1 className="text-6xl font-bold mb-6">{trip.destination}</h1>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{format(new Date(trip.startDate), "MMMM do, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{trip.passengers} {trip.passengers === 1 ? "traveler" : "travelers"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>From {trip.origin}</span>
          </div>
        </div>
      </div>
    </div>
  )
}