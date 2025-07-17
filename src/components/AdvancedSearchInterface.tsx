import React, { useState, useEffect } from 'react'
import { Search, Mic, Command, ArrowRight, Sparkles, Brain, Filter, Clock } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { HologramEffect } from "./effects/ParticleEffects"

const searchSuggestions = [
  "AI trends 2024",
  "quantum computing basics",
  "machine learning algorithms",
  "blockchain technology",
  "neural networks explained",
  "future of robotics"
]

const recentSearches = [
  "artificial intelligence",
  "space exploration",
  "sustainable energy"
]

export const AdvancedSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      console.log('Searching for:', query)
    }, 2000)
  }

  const handleVoiceSearch = () => {
    setIsVoiceActive(!isVoiceActive)
    // Voice search implementation would go here
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('nova-search-input')?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <HologramEffect>
        <div className="relative group">
          {/* Outer glow effect */}
          <div className="absolute inset-0 bg-nova-gradient rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500 animate-morph" />
          
          {/* Main search container */}
          <div className="relative bg-card/90 backdrop-blur-2xl rounded-3xl border border-border shadow-cosmic hover:shadow-nova transition-all duration-500 p-8">
            {/* Search header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-primary animate-glow-pulse" />
                <span className="font-semibold font-space text-foreground">
                  Nova Intelligence Search
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="animate-float">
                  AI Powered
                </Badge>
                <Badge variant="outline" className="text-accent border-accent/30">
                  Real-time
                </Badge>
              </div>
            </div>

            {/* Main search input */}
            <div className="relative mb-6">
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                <Search className={`w-6 h-6 transition-all duration-300 ${
                  isSearching ? 'text-primary animate-cosmic-rotate' : 'text-muted-foreground'
                }`} />
              </div>
              
              <Input
                id="nova-search-input"
                placeholder="Search the cosmos of knowledge..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(query.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-16 pl-16 pr-32 text-lg bg-muted/30 border-border font-manrope rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <NovaButton
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceSearch}
                  className={`transition-all duration-300 ${
                    isVoiceActive ? 'text-primary animate-nova-pulse' : ''
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </NovaButton>
                
                <NovaButton
                  size="lg"
                  onClick={handleSearch}
                  disabled={!query.trim() || isSearching}
                  className="px-6 relative overflow-hidden"
                >
                  {isSearching ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-cosmic-rotate" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </NovaButton>
              </div>
            </div>

            {/* Search suggestions */}
            {showSuggestions && (
              <div className="absolute left-8 right-8 top-full mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-cosmic z-50 overflow-hidden animate-scale-in">
                <div className="p-4">
                  <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Suggestions
                  </div>
                  <div className="space-y-2">
                    {searchSuggestions
                      .filter(suggestion => 
                        suggestion.toLowerCase().includes(query.toLowerCase())
                      )
                      .slice(0, 4)
                      .map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                          onClick={() => {
                            setQuery(suggestion)
                            setShowSuggestions(false)
                          }}
                        >
                          <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-manrope text-foreground group-hover:text-primary transition-colors">
                            {suggestion}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground font-manrope">
                  Try: 
                </span>
                {searchSuggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="text-primary hover:text-primary-glow transition-colors font-manrope"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Command className="w-4 h-4" />
                  <span className="font-manrope">K</span>
                </div>
                
                <NovaButton variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </NovaButton>
              </div>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground font-space">
                    Recent Searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </HologramEffect>
    </div>
  )
}