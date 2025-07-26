import { Search, Sparkles, ArrowRight, Zap, Mic, X, TrendingUp, Clock, Star } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Input } from "./ui/input"
import { useState, useEffect } from "react"
import heroImage from "@/assets/nova-hero.jpg"

// Mock AI suggestions and search results
const aiSuggestions = [
  "AI trends 2024",
  "quantum computing basics", 
  "machine learning tutorials",
  "neural networks explained",
  "artificial intelligence ethics",
  "deep learning frameworks"
]

const recentSearches = [
  "React best practices",
  "TypeScript advanced patterns",
  "Tailwind CSS components"
]

const trendingTopics = [
  "AI and the future of work",
  "Web3 development",
  "Sustainable technology"
]

export const NovaHero = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Simulate search results
  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setShowSuggestions(false)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock results
    const mockResults = [
      {
        id: 1,
        title: `Results for "${query}"`,
        description: "AI-powered insights and analysis",
        type: "article",
        relevance: 0.95
      },
      {
        id: 2,
        title: "Related topics and discussions",
        description: "Community insights and expert opinions",
        type: "discussion",
        relevance: 0.87
      },
      {
        id: 3,
        title: "Tools and resources",
        description: "Practical applications and tutorials",
        type: "tool",
        relevance: 0.82
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
  }

  const handleSearch = () => {
    performSearch(searchQuery)
  }

  const handleVoiceSearch = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setSearchQuery("artificial intelligence trends")
      setIsListening(false)
      performSearch("artificial intelligence trends")
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    performSearch(suggestion)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean Dreamy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <img 
          src={heroImage} 
          alt="Nova Search Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        
        {/* Dreamy Color Glows Around Edges */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-left glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          {/* Top-right glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Bottom-left glow */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Bottom-right glow */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-glow-pulse" />
              <span className="text-sm font-manrope text-gray-600">
                AI-Powered Search & Discovery
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-space">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-glow-pulse">
                Nova
              </span>
              <br />
              <span className="text-gray-800">Search</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-manrope max-w-2xl mx-auto leading-relaxed">
              Experience the future of search with AI-powered intelligence, 
              instant results, and a thriving creator marketplace.
            </p>
          </div>

          {/* Enhanced Search Interface */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200/50 p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="Ask anything... Search the cosmos of knowledge..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch()
                      }}
                      className="pl-12 h-14 text-lg bg-gray-50/80 border-gray-200 font-manrope rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <NovaButton 
                    onClick={handleVoiceSearch}
                    variant="cosmic" 
                    size="icon"
                    className={`${isListening ? 'animate-pulse bg-cyan-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    <Mic className="w-5 h-5" />
                  </NovaButton>
                  <NovaButton 
                    onClick={handleSearch}
                    size="lg" 
                    className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </NovaButton>
                </div>
                
                {/* Smart Suggestions */}
                {showSuggestions && (
                  <div className="mt-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200">
                    <div className="space-y-3">
                      {/* AI Suggestions */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-800">AI Suggestions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions
                            .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                            .slice(0, 3)
                            .map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-all"
                              >
                                {suggestion}
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Recent Searches */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-800">Recent</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(search)}
                              className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-all"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Trending Topics */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-cyan-600" />
                          <span className="text-sm font-semibold text-gray-800">Trending</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trendingTopics.map((topic, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(topic)}
                              className="px-3 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-full text-sm transition-all"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        className="p-4 bg-white/60 rounded-xl border border-gray-200 hover:bg-white/80 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {result.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {result.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round(result.relevance * 100)}% relevant
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span className="font-manrope">Try: "AI trends 2024" or "quantum computing basics"</span>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NovaButton size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </NovaButton>
            <NovaButton variant="cosmic" size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
              Watch Demo
            </NovaButton>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
            <div className="text-center group">
              <div className="text-2xl font-bold font-space text-blue-600 group-hover:scale-110 transition-transform">1M+</div>
              <div className="text-sm text-gray-600 font-manrope">Smart Searches</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl font-bold font-space text-purple-600 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm text-gray-600 font-manrope">AI Tools</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl font-bold font-space text-cyan-600 group-hover:scale-110 transition-transform">10k+</div>
              <div className="text-sm text-gray-600 font-manrope">Creators</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}