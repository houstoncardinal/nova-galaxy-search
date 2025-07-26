import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  Mic,
  MicOff,
  Paperclip,
  Filter,
  Grid,
  List,
  ArrowRight,
  ExternalLink,
  Clock,
  Globe,
  Video,
  Image as ImageIcon,
  Code,
  BookOpen,
  Newspaper,
  Sparkles,
  TrendingUp,
  Eye,
  Calendar,
  Star,
  Download,
  Share2,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'web' | 'video' | 'news' | 'image' | 'code' | 'academic';
  source: string;
  thumbnail?: string;
  metadata: {
    date?: string;
    author?: string;
    domain?: string;
    views?: number;
    rating?: number;
  };
}

interface AIInsights {
  summary: string;
  keyInsights: string[];
  recommendedSearches: string[];
}

export function PowerfulSearchEngine() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("relevance");
  const [isRecording, setIsRecording] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const searchCategories = [
    { value: "all", label: "All", icon: Globe, color: "bg-blue-500" },
    { value: "web", label: "Web", icon: Globe, color: "bg-green-500" },
    { value: "news", label: "News", icon: Newspaper, color: "bg-red-500" },
    { value: "video", label: "Videos", icon: Video, color: "bg-purple-500" },
    { value: "image", label: "Images", icon: ImageIcon, color: "bg-pink-500" },
    { value: "code", label: "Code", icon: Code, color: "bg-orange-500" },
    { value: "academic", label: "Academic", icon: BookOpen, color: "bg-indigo-500" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "date", label: "Most Recent" },
    { value: "views", label: "Most Popular" },
  ];

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your search query...",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('voice-transcription', {
          body: { audio: base64Audio }
        });
        
        if (error) throw error;
        
        if (data.success) {
          setQuery(data.text);
          toast({
            title: "Speech recognized",
            description: `"${data.text}"`,
          });
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: "Could not convert speech to text",
        variant: "destructive",
      });
    }
  };

  // File attachment handler
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    toast({
      title: "Files attached",
      description: `${files.length} file(s) added to search context`,
    });
  };

  // Search function
  const performSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setAiInsights(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('web-search', {
        body: { 
          query: searchQuery, 
          type: searchType,
          limit: 50 
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setResults(data.results);
        setSearchHistory(prev => [searchQuery, ...prev.filter(q => q !== searchQuery).slice(0, 9)]);
        
        // Generate AI insights
        generateAIInsights(data.results, searchQuery);
        
        toast({
          title: "Search completed",
          description: `Found ${data.results.length} results`,
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not perform search",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async (searchResults: SearchResult[], searchQuery: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { results: searchResults, query: searchQuery }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    }
  };

  // Search suggestions
  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        const commonSearches = [
          `${query} tutorial`,
          `${query} examples`,
          `${query} best practices`,
          `how to ${query}`,
          `${query} vs`,
        ];
        setSuggestions(commonSearches);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.metadata.date || 0).getTime() - new Date(a.metadata.date || 0).getTime();
      case "views":
        return (b.metadata.views || 0) - (a.metadata.views || 0);
      default:
        return 0; // Keep original relevance order
    }
  });

  const getTypeIcon = (type: string) => {
    const iconMap = {
      web: Globe,
      news: Newspaper,
      video: Video,
      image: ImageIcon,
      code: Code,
      academic: BookOpen,
    };
    return iconMap[type as keyof typeof iconMap] || Globe;
  };

  const getTypeColor = (type: string) => {
    const colorMap = {
      web: "text-green-600",
      news: "text-red-600",
      video: "text-purple-600",
      image: "text-pink-600",
      code: "text-orange-600",
      academic: "text-indigo-600",
    };
    return colorMap[type as keyof typeof colorMap] || "text-gray-600";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-nova bg-clip-text text-transparent">
            Nova Search Engine
          </h1>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                placeholder="Search the web with AI-powered insights..."
                className="pl-12 pr-32 h-14 text-lg rounded-pill shadow-nova border-primary/20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFileSelect}
                  className="h-10 w-10 p-0 rounded-full hover:bg-primary/10"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "h-10 w-10 p-0 rounded-full",
                    isRecording ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-primary/10"
                  )}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              onClick={() => performSearch()}
              disabled={loading || !query.trim()}
              className="h-14 px-8 rounded-pill shadow-nova"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion);
                    setSuggestions([]);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* File attachments display */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
            {selectedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {file.name}
                <button
                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                  className="ml-2 text-xs"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileChange}
          multiple
          className="hidden"
        />
      </div>

      {/* Search Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {searchCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.value}
              variant={searchType === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSearchType(category.value)}
              className="rounded-pill"
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <Card className="border-primary/20 shadow-cosmic">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Insights</h3>
            </div>
            <p className="text-muted-foreground mb-4">{aiInsights.summary}</p>
            {aiInsights.keyInsights.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Key Insights:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {aiInsights.keyInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            {aiInsights.recommendedSearches.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommended Searches:</h4>
                <div className="flex flex-wrap gap-2">
                  {aiInsights.recommendedSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => performSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {results.length} results found
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          )}>
            {sortedResults.map((result) => {
              const TypeIcon = getTypeIcon(result.type);
              return (
                <Card key={result.id} className="hover:shadow-lg transition-shadow border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {result.thumbnail && (
                        <img
                          src={result.thumbnail}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <TypeIcon className={cn("h-4 w-4", getTypeColor(result.type))} />
                          <Badge variant="outline" className="text-xs">
                            {result.source}
                          </Badge>
                          {result.metadata.date && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.metadata.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {result.title}
                          </a>
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                          {result.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {result.metadata.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {result.metadata.views.toLocaleString()}
                              </span>
                            )}
                            {result.metadata.domain && (
                              <span>{result.metadata.domain}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Bookmark className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                              <a href={result.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => {
                    setQuery(search);
                    performSearch(search);
                  }}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}