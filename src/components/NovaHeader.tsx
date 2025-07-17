import { Search, Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"
import { NovaButton } from "./ui/nova-button"
import { ThemeSelector } from "./ThemeSelector"
import { ParticleField, ScanLine } from "./effects/ParticleEffects"

export const NovaHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <ParticleField />
      <ScanLine />
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-2xl border-b border-border shadow-cosmic">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-10 h-10 bg-nova-gradient rounded-xl shadow-nova animate-nova-pulse group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="absolute top-1.5 left-1.5 w-7 h-7 text-primary-foreground animate-glow-pulse" />
              <div className="absolute inset-0 bg-nova-gradient rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300" />
            </div>
            <div>
              <span className="text-2xl font-bold font-space bg-nova-gradient bg-clip-text text-transparent">
                Nova Search
              </span>
              <div className="text-xs text-muted-foreground font-manrope">
                AI-Powered Discovery
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {['Search', 'AI Tools', 'Marketplace', 'Docs', 'Community'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="relative text-muted-foreground hover:text-foreground transition-all duration-300 font-manrope group"
              >
                {item}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-nova-gradient group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeSelector />
            
            <NovaButton variant="ghost" size="icon" className="hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </NovaButton>
            
            <div className="hidden md:flex items-center space-x-3">
              <NovaButton variant="cosmic" size="sm" className="font-manrope">
                Sign In
              </NovaButton>
              <NovaButton variant="nova" size="sm" className="font-manrope shadow-nova">
                Get Started
              </NovaButton>
            </div>

            {/* Mobile Menu Button */}
            <NovaButton
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </NovaButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-2xl border-b border-border shadow-cosmic animate-accordion-down">
            <div className="container mx-auto px-6 py-6 space-y-4">
              {['Search', 'AI Tools', 'Marketplace', 'Docs', 'Community'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-muted-foreground hover:text-foreground transition-colors font-manrope py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex space-x-3 pt-4 border-t border-border">
                <NovaButton variant="cosmic" size="sm" className="flex-1">
                  Sign In
                </NovaButton>
                <NovaButton variant="nova" size="sm" className="flex-1">
                  Get Started
                </NovaButton>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}