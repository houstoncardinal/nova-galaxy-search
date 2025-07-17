import { Search, Sparkles, ArrowRight, Zap } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Input } from "./ui/input"
import heroImage from "@/assets/nova-hero.jpg"

export const NovaHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic">
        <img 
          src={heroImage} 
          alt="Nova Search Cosmic Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-nova-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-float" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-secondary rounded-full animate-glow-pulse" />
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-nova-cyan rounded-full animate-nova-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-muted/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
              <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm font-manrope text-muted-foreground">
                The Future of Search & AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-space">
              <span className="bg-nova-gradient bg-clip-text text-transparent animate-glow-pulse">
                Nova
              </span>
              <br />
              <span className="text-foreground">Search</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-manrope max-w-2xl mx-auto leading-relaxed">
              Discover the universe of information with AI-powered search, 
              intelligent tools, and a thriving creator marketplace.
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-nova-gradient rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-cosmic">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder="Search the cosmos of knowledge..."
                      className="pl-12 h-14 text-lg bg-muted/50 border-border font-manrope rounded-xl"
                    />
                  </div>
                  <NovaButton size="lg" className="h-14">
                    <Zap className="w-5 h-5 mr-2" />
                    Search
                  </NovaButton>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span className="font-manrope">Try: "AI trends 2024" or "quantum computing basics"</span>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NovaButton size="lg" className="w-full sm:w-auto">
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </NovaButton>
            <NovaButton variant="cosmic" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </NovaButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold font-space text-primary">1M+</div>
              <div className="text-sm text-muted-foreground font-manrope">Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-space text-secondary">500+</div>
              <div className="text-sm text-muted-foreground font-manrope">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-space text-accent">10k+</div>
              <div className="text-sm text-muted-foreground font-manrope">Creators</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}