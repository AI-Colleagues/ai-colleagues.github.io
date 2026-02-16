import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { withBase } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Services", href: withBase("/#features") },
    { label: "FAQ", href: withBase("/#faq") },
    { label: "Blog", href: withBase("/blog") },
    { label: "News", href: withBase("/news") },
    { label: "Contact", href: withBase("/contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-[72px] items-center justify-between">
        <a href={withBase("/")} className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white p-0">
            <img
              src={withBase("/aic-icon.svg")}
              alt="AI Colleagues"
              className="h-[92%] w-[92%] object-contain scale-[1.5] translate-x-[2%] translate-y-[6%]"
            />
          </span>
          <span className="font-bold leading-tight text-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-300 bg-clip-text text-transparent">
            AI Colleagues
          </span>
        </a>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild className="hidden md:inline-flex">
            <a href={withBase("/contact")}>Request Demo</a>
          </Button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="w-full">
              <a href={withBase("/contact")} onClick={() => setIsMenuOpen(false)}>
                Request Demo
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
