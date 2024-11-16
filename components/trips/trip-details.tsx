"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Globe, MapPin, Share2, Trash2, Users } from "lucide-react"
import { TripCardsGrid } from "./trip-cards-grid"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface Trip {
  id: string
  destination: string
  origin: string
  start_date: string
  passengers: number
  image_url: string
}

interface TripDetailsProps {
  trip: Trip
}

export function TripDetails({ trip }: TripDetailsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", trip.id)

      if (error) throw error

      toast.success("Trip deleted successfully")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Trip link copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] w-full bg-cover bg-center bg-fixed transition-all duration-700"
        style={{ 
          backgroundImage: `url(${trip.image_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/50" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
                  {trip.destination}
                </h1>
                <div className="flex flex-wrap gap-6 text-foreground/80">
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <Calendar className="h-5 w-5" />
                    <span>{format(new Date(trip.start_date), "MMMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <Users className="h-5 w-5" />
                    <span>{trip.passengers} {trip.passengers === 1 ? "traveler" : "travelers"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-full px-4 py-2">
                    <MapPin className="h-5 w-5" />
                    <span>From {trip.origin}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                  className="group bg-background/50 backdrop-blur-sm hover:bg-background/70"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </Button>
                <Button
                  variant="secondary"
                  className="group bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  className="group hover:bg-destructive/90"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8">
            {/* Trip Overview Card */}
            <div className="p-6 rounded-xl bg-card border transition-all hover:shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Trip Overview</h2>
              </div>
              <p className="text-muted-foreground">
                Your journey from {trip.origin} to {trip.destination} is set to begin on{" "}
                {format(new Date(trip.start_date), "MMMM do, yyyy")}. We've prepared a
                comprehensive plan to make your trip memorable and hassle-free.
              </p>
            </div>

            {/* Trip Cards Grid */}
            <TripCardsGrid tripId={trip.id} />
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip
              to {trip.destination} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}