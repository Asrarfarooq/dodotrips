"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { getCityImage } from "@/lib/unsplash"
import { toast } from "sonner"

interface TripCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    origin?: string
    destination?: string
    startDate?: Date
    passengers?: number
  }
}

export function TripCreationDialog({ 
  open, 
  onOpenChange, 
  initialData 
}: TripCreationDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(initialData?.startDate || new Date())
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    passengers: "1"
  })

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        origin: initialData.origin || "",
        destination: initialData.destination || "",
        passengers: initialData.passengers?.toString() || "1"
      })
      if (initialData.startDate) {
        setDate(initialData.startDate)
      }
    }
  }, [initialData, open])

  const handleSubmit = async () => {
    if (!date || !formData.origin || !formData.destination) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get city image from Unsplash
      const imageUrl = await getCityImage(formData.destination)

      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          origin: formData.origin,
          destination: formData.destination,
          start_date: date.toISOString(),
          passengers: parseInt(formData.passengers),
          image_url: imageUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      toast.success("Trip created successfully!")
      onOpenChange(false)
      router.push(`/trips/${data.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plan Your Trip</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your new trip itinerary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="Enter city of origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Enter destination city"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Passengers</Label>
            <Select
              value={formData.passengers}
              onValueChange={(value) => setFormData({ ...formData, passengers: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of passengers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "passenger" : "passengers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Trip
        </Button>
      </DialogContent>
    </Dialog>
  )
}