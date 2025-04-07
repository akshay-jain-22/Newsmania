import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Fetch the HTML content from the URL
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: response.status })
    }

    const html = await response.text()

    // Use cheerio to parse the HTML
    const $ = cheerio.load(html)

    // Extract the title
    const title = $("title").text() || $("h1").first().text()

    // Extract the main content
    // This is a simple implementation and might need to be adjusted for different websites
    let content = ""

    // Try to find the main article content
    const articleSelectors = ["article", ".article-content", ".post-content", ".entry-content", ".content", "main"]

    for (const selector of articleSelectors) {
      const element = $(selector)
      if (element.length) {
        content = element.text().trim()
        break
      }
    }

    // If no content was found with the selectors, get the body text
    if (!content) {
      content = $("body").text().trim()
    }

    // Clean up the content
    content = content.replace(/\s+/g, " ").trim()

    // Create a summary (first 200 characters)
    const summary = content.substring(0, 200) + "..."

    // Get the source domain
    const source = new URL(url).hostname

    // Get the current date
    const date = new Date().toISOString()

    return NextResponse.json({
      title,
      content,
      summary,
      source,
      date,
    })
  } catch (error) {
    console.error("Error extracting content:", error)
    return NextResponse.json({ error: "Failed to extract content" }, { status: 500 })
  }
}

