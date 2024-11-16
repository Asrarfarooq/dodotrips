"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { DestinationCard } from "@/components/destination-card"
import { ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return null // Prevent flash of wrong buttons
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold tracking-tight">
                A-one travel planning app
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                Your personal AI-powered travel companion for seamless trip planning and management. 
                Plan, explore, and create unforgettable memories.
              </p>
              <div className="mt-8 flex gap-4">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    onClick={() => router.push("/dashboard")}
                    className="group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={() => router.push("/login")}>
                      Sign In
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => router.push("/signup")}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <DestinationCard
                  title="Paradise Beach"
                  subtitle="Maldives"
                  imageUrl="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80"
                />
                <DestinationCard
                  title="Local Cuisine"
                  subtitle="Food Explorer"
                  imageUrl="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80"
                />
              </div>
              <div className="space-y-4 pt-8">
                <DestinationCard
                  title="Luxury Stay"
                  subtitle="Premium Hotels"
                  imageUrl="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80"
                />
                <DestinationCard
                  title="Adventure Time"
                  subtitle="Exciting Activities"
                  imageUrl="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}