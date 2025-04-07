"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/topics",
      label: "Topics",
      active: pathname === "/topics",
    },
    {
      href: "/fact-check",
      label: "Fact Check",
      active: pathname === "/fact-check",
    },
    {
      href: "/notes",
      label: "My Notes",
      active: pathname === "/notes",
    },
  ]

  return (
    <>
      <nav className="hidden md:flex items-center gap-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>

      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm">
          <nav className="container py-8 flex flex-col gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-lg font-medium py-2 transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

