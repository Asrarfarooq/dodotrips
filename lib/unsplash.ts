import { createApi } from "unsplash-js"

export const unsplash = createApi({
  accessKey: "y3dzw_29_D1BASnTRUU7E26SmL8WAUQD4WsTPcjPEWQ",
})

export async function getCityImage(city: string): Promise<string> {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${city} city`,
      orientation: "landscape",
      perPage: 1,
    })
    
    if (result.response?.results[0]?.urls?.regular) {
      return result.response.results[0].urls.regular
    }
    
    // Fallback to source.unsplash.com
    return `https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(city)},cityscape`
  } catch (error) {
    // Default fallback image
    return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80"
  }
}