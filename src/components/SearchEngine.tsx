import { Search, Sparkles, ArrowRight, Zap, Mic, TrendingUp, Clock, Star, ExternalLink, Github, MessageSquare, Code, FileText } from "lucide-react"
import { NovaButton } from "./ui/nova-button"
import { Input } from "./ui/input"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

// AI suggestions and trending topics
const aiSuggestions = [
  "AI trends 2024", "quantum computing basics", "machine learning tutorials",
  "neural networks explained", "artificial intelligence ethics", "deep learning frameworks"
]

const recentSearches = [
  "React best practices", "TypeScript advanced patterns", "Tailwind CSS components"
]

const trendingTopics = [
  "AI and the future of work", "Web3 development", "Sustainable technology"
]

interface SearchResult {
  id: number
  title: string
  description: string
  url?: string
  source?: string
  type: string
  relevance: number
  metadata?: any
}

const getSourceIcon = (source: string) => {
  switch (source?.toLowerCase()) {
    case 'github': return <Github className="w-4 h-4" />
    case 'reddit': return <MessageSquare className="w-4 h-4" />
    case 'stack overflow': return <Code className="w-4 h-4" />
    case 'hacker news': return <TrendingUp className="w-4 h-4" />
    case 'wikipedia': return <FileText className="w-4 h-4" />
    default: return <Search className="w-4 h-4" />
  }
}

const getSourceColor = (source: string) => {
  switch (source?.toLowerCase()) {
    case 'github': return 'bg-gray-100 text-gray-700'
    case 'reddit': return 'bg-orange-100 text-orange-700'
    case 'stack overflow': return 'bg-orange-100 text-orange-700'
    case 'hacker news': return 'bg-orange-100 text-orange-700'
    case 'wikipedia': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export const SearchEngine = () => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Real web search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setShowSuggestions(false)
    
    try {
      const { data, error } = await supabase.functions.invoke('web-search', {
        body: { 
          query: query.trim(),
          session_id: crypto.randomUUID()
        }
      })

      if (error) {
        console.error('Search error:', error)
        toast({
          title: "Search Error",
          description: "There was an error performing your search. Please try again.",
          variant: "destructive",
        })
        setSearchResults([])
      } else if (data?.results && data.results.length > 0) {
        // Transform results for display
        const transformedResults = data.results.map((result: any, index: number) => ({
          id: index + 1,
          title: result.title,
          description: result.description,
          url: result.url,
          source: result.source,
          type: result.source?.toLowerCase().replace(' ', '_') || 'web',
          relevance: result.relevance || 0.5,
          metadata: result.metadata
        }))
        setSearchResults(transformedResults)
        
        toast({
          title: "Search Complete",
          description: `Found ${transformedResults.length} results from multiple sources`,
        })
      } else {
        setSearchResults([])
        toast({
          title: "No Results Found",
          description: "Try different keywords or check your spelling",
        })
      }
    } catch (error) {
      console.error('Search failed:', error)
      toast({
        title: "Search Failed",
        description: "Please check your connection and try again",
        variant: "destructive",
      })
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = () => {
    performSearch(searchQuery)
  }

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        toast({
          title: "Listening...",
          description: "Speak your search query now",
        })
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        performSearch(transcript)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        toast({
          title: "Voice Search Error",
          description: "Could not capture voice input. Please try again.",
          variant: "destructive",
        })
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice search",
        variant: "destructive",
      })
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    performSearch(suggestion)
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      window.open(result.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Enhanced Search Interface */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-blue-200/50 p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search the web... Ask anything, find everything..."
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
              className={`${isListening ? 'animate-pulse bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              disabled={isListening}
            >
              <Mic className="w-5 h-5" />
            </NovaButton>
            <NovaButton 
              onClick={handleSearch}
              size="lg" 
              className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              disabled={isSearching || !searchQuery.trim()}
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
          {showSuggestions && !isSearching && searchResults.length === 0 && (
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
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Search Results ({searchResults.length})
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Sources:</span>
                  {[...new Set(searchResults.map(r => r.source))].slice(0, 3).map((source, i) => (
                    <span key={i} className={`px-2 py-1 rounded-full text-xs ${getSourceColor(source || '')}`}>
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="p-4 bg-white/60 rounded-xl border border-gray-200 hover:bg-white/80 transition-all cursor-pointer group hover:shadow-md"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getSourceColor(result.source || '')}`}>
                            {getSourceIcon(result.source || '')}
                            <span>{result.source}</span>
                          </div>
                          {result.metadata?.stars && (
                            <span className="text-xs text-yellow-600 flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{result.metadata.stars}</span>
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {Math.round(result.relevance * 100)}% match
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                          {result.title}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {result.description}
                        </p>
                        
                        {result.url && (
                          <p className="text-xs text-green-600 truncate flex items-center space-x-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>{result.url}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {isSearching && (
            <div className="mt-6 flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Searching across multiple sources...</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span className="font-manrope">
              Search across Wikipedia, GitHub, Stack Overflow, Reddit, Hacker News and more
            </span>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}