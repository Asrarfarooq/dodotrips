import { toast } from "sonner"

const OPENCAGE_API_KEY = "93ce67e0aa1745edaad0657354e508bb"

export async function getUserLocation(): Promise<string | null> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    const { latitude, longitude } = position.coords
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
    )
    const data = await response.json()

    if (data.results?.[0]?.components?.city) {
      return data.results[0].components.city
    }
    
    return null
  } catch (error) {
    console.error("Error getting location:", error)
    return null
  }
}