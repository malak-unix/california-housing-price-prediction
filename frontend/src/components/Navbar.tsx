import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { label: "Predict", href: "#predict", id: "predict" },
  { label: "Model Insights", href: "#model-insights", id: "model-insights" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("predict")

  useEffect(() => {
    let frame = 0

    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.38
        let current = links[0].id

        for (const link of links) {
          const section = document.getElementById(link.id)
          if (section && section.offsetTop <= marker) current = link.id
        }

        setActiveSection(current)
      })
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-2 pt-2 sm:px-3 lg:px-4">
      <nav
        className="mx-auto grid h-14 max-w-[1800px] grid-cols-[1fr_auto] items-center px-4 sm:px-5 md:grid-cols-[1fr_auto_1fr] lg:px-7"
        aria-label="Primary navigation"
      >
        <a
          href="#predict"
          className="group flex items-center justify-self-start focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e3ac]"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-[17px] font-semibold tracking-[-0.025em] text-[#f7f8f8]">
            PropValue <span className="text-[#53e3ac]">AI</span>
          </span>
        </a>

        <div className="hidden items-center justify-self-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "button-glow rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#53e3ac]",
                  isActive
                    ? "border-white/16 bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_8px_26px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                    : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        <span className="hidden md:block" aria-hidden="true" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="justify-self-end border border-white/12 bg-white/[0.05] text-white backdrop-blur-xl hover:bg-white/10 md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-w-[1800px] p-2 md:hidden"
        >
          <div className="grid gap-1">
            {links.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "button-glow rounded-lg border border-white/10 bg-black/55 px-3 py-3 text-sm shadow-xl backdrop-blur-xl transition-colors",
                    isActive
                      ? "bg-[#53e3ac]/9 text-[#72edbd]"
                      : "text-zinc-300 hover:bg-white/6 hover:text-white",
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
