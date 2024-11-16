"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { TripCard as TripCardType } from "@/lib/types/trip"
import { LucideIcon } from "lucide-react"
import dynamic from "next/dynamic"

interface TripCardProps extends TripCardType {
  tripId: string
  description: string
  longDescription: string
}

export function TripCard({ title, description, longDescription, icon, href, tripId }: TripCardProps) {
  const Icon = dynamic(() => import("lucide-react").then((mod) => mod[icon as keyof typeof mod])) as LucideIcon

  return (
    <Link href={`/trips/${tripId}/${href}`}>
      <Card className="group cursor-pointer hover:bg-muted/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {longDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}