"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TripCreationDialog } from "./trip-creation-dialog"
import { parseSearchQuery } from "@/lib/search-parser"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export function SearchBar() {
  const [tripDialogOpen, setTripDialogOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [parsedTrip, setParsedTrip] = useState<any>(null)
  const [homeCity, setHomeCity] = useState<string>("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function getHomeCity() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.homeCity) {
        setHomeCity(user.user_metadata.homeCity)
      }
    }
    getHomeCity()
  }, [])

  const handleSearch = (value: string) => {
    const parsed = parseSearchQuery(value)
    if (parsed) {
      setParsedTrip({
        origin: parsed.origin || homeCity,
        destination: parsed.destination,
        startDate: parsed.date || new Date(),
        passengers: parsed.passengers || 1
      })
      setTripDialogOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchValue)
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Try "Plan a trip to Paris for 2 people next month"`}
            className="w-full h-12 pl-4 pr-24 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                toast.info("Speech recognition coming soon!")
              }}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus 
                className="h-4 w-4 text-primary cursor-pointer"
                onClick={() => setTripDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <TripCreationDialog 
        open={tripDialogOpen} 
        onOpenChange={setTripDialogOpen}
        initialData={parsedTrip}
      />
    </>
  )
}