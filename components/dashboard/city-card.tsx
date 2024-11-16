"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface CityCardProps {
  id?: string
  city: string
  description: string
  imageUrl: string
  isPopularDestination?: boolean
}

export function CityCard({ id, city, description, imageUrl, isPopularDestination = false }: CityCardProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleClick = async () => {
    if (!isPopularDestination) {
      router.push(`/trips/${id}`)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please login to create a trip")
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("trips")
        .insert([
          {
            user_id: user.id,
            origin: "Your Location",
            destination: city,
            start_date: new Date().toISOString(),
            passengers: 1,
            image_url: imageUrl
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast.success(`Created trip to ${city}!`)
      router.push(`/trips/${data.id}`)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast.success("Trip deleted successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Card 
        className="group cursor-pointer overflow-hidden" 
        onClick={(e) => {
          // Don't trigger card click if clicking dropdown
          if (!(e.target as HTMLElement).closest('[data-dropdown-trigger="true"]')) {
            handleClick()
          }
        }}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[4/3]">
            <Image
              src={imageUrl}
              alt={city}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-semibold">{city}</h3>
                  <p className="text-sm text-gray-200">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!isPopularDestination && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="p-2 hover:bg-white/20 rounded-full transition-colors"
                          data-dropdown-trigger="true"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-5 w-5 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          setDeleteDialogOpen(true)
                        }}>
                          Delete Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/trips/${id}/edit`)
                        }}>
                          Edit Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/trips/${id}/share`)
                        }}>
                          Share Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip
              to {city} and remove all associated data.
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
    </>
  )
}