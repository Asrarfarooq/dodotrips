"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { getUserLocation } from "@/lib/location"
import { toast } from "sonner"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  homeCity: z.string().min(2, "Home city must be at least 2 characters"),
})

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.user_metadata?.name || "",
        homeCity: user.user_metadata?.homeCity || "",
      })
    }
  }, [open, user, form])

  useEffect(() => {
    async function detectLocation() {
      if (!user?.user_metadata?.homeCity) {
        const city = await getUserLocation()
        if (city) {
          form.setValue("homeCity", city)
          toast.info(`We detected your location as ${city}`)
        }
      }
    }
    if (open) {
      detectLocation()
    }
  }, [open, user, form])

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          name: values.name,
          homeCity: values.homeCity
        }
      })

      if (error) throw error

      toast.success("Profile updated successfully!")
      onOpenChange(false)
      
      // Update local storage to reflect changes immediately
      const session = await supabase.auth.getSession()
      if (session.data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session.data.session))
      }
      
      // Force reload to update UI
      window.location.reload()
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
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your home city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}