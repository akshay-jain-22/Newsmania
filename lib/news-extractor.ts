import type { NewsArticle } from "@/types/news"

interface ExtractedNews {
  title: string
  content: string
  summary: string
  source: string
  date: string
}

export async function extractNewsFromUrl(url: string): Promise<ExtractedNews> {
  try {
    // In a production environment, you would use a server-side API to fetch and parse the content
    // For this demo, we'll use a proxy to avoid CORS issues
    const proxyUrl = `/api/extract?url=${encodeURIComponent(url)}`

    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`Failed to extract content: ${response.status}`)
    }

    const data = await response.json()

    return {
      title: data.title || "Extracted Article",
      content: data.content || "No content could be extracted",
      summary: data.summary || data.content?.substring(0, 150) + "..." || "No summary available",
      source: data.source || new URL(url).hostname,
      date: data.date || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error extracting news:", error)
    throw new Error("Failed to extract news content")
  }
}

// Function to search for news using the News API
export async function searchNews(query: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching news:", error)
    return []
  }
}

