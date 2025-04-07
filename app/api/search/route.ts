import { NextResponse } from "next/server"

// Use the provided NewsAPI key
const API_KEY = "2d28c89f4476422887cf8adbe7bb1e0b"
const BASE_URL = "https://newsapi.org/v2"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const pageSize = searchParams.get("pageSize") || "20"
  const page = searchParams.get("page") || "1"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "News API error" }, { status: response.status })
    }

    const data = await response.json()

    // Transform the API response to match our NewsArticle type
    const articles = data.articles.map((article: any, index: number) => ({
      id: `search-${index}-${Date.now()}`, // Generate a unique ID
      source: article.source,
      author: article.author,
      title: article.title || "No title available",
      description: article.description || "No description available",
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      content: article.content || "No content available",
    }))

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error searching news:", error)
    return NextResponse.json({ error: "Failed to search news" }, { status: 500 })
  }
}

