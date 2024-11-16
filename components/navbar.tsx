"use client"

import Link from "next/link"
import { Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { UserNav } from "@/components/dashboard/user-nav"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const showUserNav = pathname.startsWith("/dashboard") || pathname.startsWith("/trips")

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">dodotrips</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {showUserNav && <UserNav />}
          </div>
        </div>
      </div>
    </nav>
  )
}