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
      <nav className="container flex h-16 items-center justify-between">
        <a href={withBase("/")} className="flex items-center space-x-3">
          <img src={withBase("/aic-icon.svg")} alt="AI Colleagues" className="h-8 w-8" />
          <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-300 bg-clip-text text-transparent">
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
          <a href={withBase("/contact")} className="hidden md:inline-flex">
            <Button>Request Demo</Button>
          </a>

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
            <a href={withBase("/contact")} onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Request Demo</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
