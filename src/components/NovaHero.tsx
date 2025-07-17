import { Search, Sparkles, ArrowRight, Zap, Mic, Command } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Input } from "./ui/input"
import { AdvancedSearchInterface } from "./AdvancedSearchInterface"
import { HologramEffect } from "./effects/ParticleEffects"
import heroImage from "@/assets/nova-hero.jpg"

export const NovaHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-cosmic">
        <img 
          src={heroImage} 
          alt="Nova Search Cosmic Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/60 to-background/80" />
        <div className="absolute inset-0 bg-nova-gradient opacity-5" />
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            <div className={`w-${Math.floor(Math.random() * 3) + 1} h-${Math.floor(Math.random() * 3) + 1} bg-primary/30 rounded-full animate-nova-pulse`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Enhanced Headline */}
          <HologramEffect>
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-muted/30 backdrop-blur-xl rounded-full px-6 py-3 border border-border shadow-cosmic">
                <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
                <span className="text-sm font-manrope text-muted-foreground">
                  The Future of Search & AI Discovery
                </span>
                <div className="w-2 h-2 bg-primary rounded-full animate-nova-pulse" />
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-space leading-tight">
                <span className="bg-nova-gradient bg-clip-text text-transparent animate-glow-pulse block">
                  Nova
                </span>
                <span className="text-foreground block">Search</span>
                <div className="text-lg md:text-xl text-muted-foreground font-manrope mt-4 max-w-3xl mx-auto leading-relaxed">
                  Discover infinite possibilities with AI-powered search, intelligent tools, 
                  and a thriving creator ecosystem.
                </div>
              </h1>
            </div>
          </HologramEffect>

          {/* Advanced Search Interface */}
          <div className="relative">
            <AdvancedSearchInterface />
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <NovaButton size="lg" className="w-full sm:w-auto px-8 py-4 text-lg shadow-nova hover:shadow-glow">
              <Zap className="w-6 h-6 mr-3" />
              Start Exploring
              <ArrowRight className="w-6 h-6 ml-3" />
            </NovaButton>
            <NovaButton variant="cosmic" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
              <Command className="w-6 h-6 mr-3" />
              Watch Demo
            </NovaButton>
          </div>

          {/* Enhanced Stats with animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
            {[
              { number: '1M+', label: 'Searches', color: 'text-primary' },
              { number: '500+', label: 'AI Tools', color: 'text-secondary' },
              { number: '10k+', label: 'Creators', color: 'text-accent' },
              { number: '99.9%', label: 'Uptime', color: 'text-nova-cyan' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-110 transition-transform duration-300"
              >
                <div className={`text-3xl md:text-4xl font-bold font-space ${stat.color} group-hover:animate-glow-pulse`}>
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-manrope mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}