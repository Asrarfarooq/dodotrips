"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface DestinationCardProps {
  title: string
  subtitle: string
  imageUrl: string
}

export function DestinationCard({ title, subtitle, imageUrl }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]">
      <CardContent className="p-0 relative aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-gray-200">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}