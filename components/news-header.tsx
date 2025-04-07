"use client"

import type React from "react"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Newspaper, Search, Menu, X, RefreshCw } from "lucide-react"
import { useAutoRefresh } from "@/components/auto-refresh-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NewsHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { lastRefresh, refreshing, triggerRefresh } = useAutoRefresh()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            <span className="text-xl font-bold">Newsmania</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search news..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/topics" className="text-sm font-medium hover:underline underline-offset-4">
            Topics
          </Link>
          <Link href="/extract" className="text-sm font-medium hover:underline underline-offset-4">
            Extract
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => triggerRefresh()}
            disabled={refreshing}
            title={lastRefresh ? `Last updated: ${lastRefresh.toLocaleTimeString()}` : "Refresh news"}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search news..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className="px-2 py-1.5 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/topics"
                className="px-2 py-1.5 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Topics
              </Link>
              <Link
                href="/extract"
                className="px-2 py-1.5 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Extract
              </Link>
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    triggerRefresh()
                    setMobileMenuOpen(false)
                  }}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh News
                </Button>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

