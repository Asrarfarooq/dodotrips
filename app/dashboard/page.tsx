"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/dashboard/search-bar"
import { CityCard } from "@/components/dashboard/city-card"
import { Navbar } from "@/components/navbar"
import { Trip } from "@/lib/types/trip"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const popularCities = [
  {
    city: "London",
    description: "Experience the historic charm of England's capital",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80",
  },
  {
    city: "Paris",
    description: "Discover the city of love and lights",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
  },
  {
    city: "New York",
    description: "Explore the city that never sleeps",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80",
  },
  {
    city: "Tokyo",
    description: "Immerse yourself in Japan's vibrant capital",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80",
  },
  {
    city: "Barcelona",
    description: "Experience the heart of Catalonian culture",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80",
  },
  {
    city: "Dubai",
    description: "Discover the jewel of the Middle East",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuthAndFetchTrips() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      const { data: trips, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching trips:", error)
        return
      }

      setTrips(trips || [])
      setLoading(false)
    }

    checkAuthAndFetchTrips()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Hi, {user?.user_metadata?.name?.split(" ")[0] || "Traveler"}!
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">Plan your next adventure</p>
          </div>

          <SearchBar />

          {trips.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">My Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <Link key={trip.id} href={`/trips/${trip.id}`}>
                    <CityCard
                      city={trip.destination}
                      description={`From ${trip.origin}`}
                      imageUrl={trip.image_url}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCities.map((city) => (
                <CityCard 
                  key={city.city} 
                  {...city} 
                  isPopularDestination={true}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}