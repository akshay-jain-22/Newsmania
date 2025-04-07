import { NewsHeader } from "@/components/news-header"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle } from "lucide-react"
import { searchNews } from "@/lib/news-extractor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  // If no query is provided, show a message
  if (!query) {
    return (
      <div className="flex min-h-screen flex-col">
        <NewsHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Search News</h1>
                <p className="text-muted-foreground">Enter a search term to find relevant news articles</p>
              </div>

              <form action="/search" className="flex max-w-md gap-2">
                <Input type="text" name="q" placeholder="Search news..." required />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Search for news articles
  const articles = await searchNews(query)

  return (
    <div className="flex min-h-screen flex-col">
      <NewsHeader />

      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
              <p className="text-muted-foreground">Showing results for "{query}"</p>
            </div>

            <form action="/search" className="flex max-w-md gap-2">
              <Input type="text" name="q" placeholder="Search news..." defaultValue={query} required />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            <Separator />

            {articles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                  <NewsCard key={`search-${index}`} article={article} />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No results found</AlertTitle>
                <AlertDescription>
                  No articles match your search query. Try different keywords or browse by topic instead.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

