import { Search, Sparkles, Compass, User } from "lucide-react"
import { NovaButton } from "./ui/nova-button"

export const NovaHeader = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-nova-gradient rounded-lg shadow-nova animate-nova-pulse" />
            <Sparkles className="absolute top-1 left-1 w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-space bg-nova-gradient bg-clip-text text-transparent">
            Nova Search
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#search" className="text-muted-foreground hover:text-foreground transition-colors font-manrope">
            Search
          </a>
          <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors font-manrope">
            AI Tools
          </a>
          <a href="#marketplace" className="text-muted-foreground hover:text-foreground transition-colors font-manrope">
            Marketplace
          </a>
          <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors font-manrope">
            Docs
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <NovaButton variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </NovaButton>
          <NovaButton variant="cosmic" size="sm">
            Sign In
          </NovaButton>
          <NovaButton variant="nova" size="sm">
            Get Started
          </NovaButton>
        </div>
      </div>
    </header>
  )
}