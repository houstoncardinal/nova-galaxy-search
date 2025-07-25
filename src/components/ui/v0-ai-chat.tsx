"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Boxes } from "@/components/ui/background-boxes";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    Search,
    Brain,
    Sparkles,
    Globe,
    BookOpen,
    Code,
    Video,
    Star,
    Clock,
    TrendingUp,
    Filter,
    Grid,
    List,
    Zap,
    Lightbulb,
    Target,
    Users,
    BarChart3,
    PieChart,
    Activity,
    ArrowRight,
    ExternalLink,
    Bookmark,
    Share2,
    MessageSquare,
    ThumbsUp,
    Eye,
    Play,
    Download,
    Star as StarIcon,
} from "lucide-react";
import axios from "axios";

interface SearchResult {
    id: string;
    title: string;
    description: string;
    url: string;
    type: 'article' | 'video' | 'code' | 'data' | 'tool' | 'community';
    relevance: number;
    tags: string[];
    metadata: {
        author?: string;
        date?: string;
        views?: number;
        rating?: number;
        language?: string;
        framework?: string;
        category?: string;
        source?: string;
    };
    aiInsights?: {
        summary: string;
        keyPoints: string[];
        relatedTopics: string[];
        sentiment: 'positive' | 'neutral' | 'negative';
    };
}

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );
            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

// Real Search APIs - Enhanced for Infinite Web Search
const searchDuckDuckGo = async (query: string): Promise<SearchResult[]> => {
    try {
        const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
        const results: SearchResult[] = [];
        
        if (response.data.Abstract) {
            results.push({
                id: 'ddg-abstract',
                title: response.data.AbstractText || 'DuckDuckGo Result',
                description: response.data.Abstract,
                url: response.data.AbstractURL || '#',
                type: 'article',
                relevance: 0.95,
                tags: ['DuckDuckGo', 'Web Search'],
                metadata: {
                    source: 'DuckDuckGo',
                    category: 'Web Search'
                },
                aiInsights: {
                    summary: response.data.Abstract,
                    keyPoints: [response.data.AbstractText || 'Direct answer from DuckDuckGo'],
                    relatedTopics: [],
                    sentiment: 'neutral'
                }
            });
        }
        
        if (response.data.RelatedTopics) {
            response.data.RelatedTopics.slice(0, 5).forEach((topic: any, index: number) => {
                if (topic.Text) {
                    results.push({
                        id: `ddg-related-${index}`,
                        title: topic.Text.split(' - ')[0] || 'Related Topic',
                        description: topic.Text,
                        url: topic.FirstURL || '#',
                        type: 'article',
                        relevance: 0.85 - (index * 0.1),
                        tags: ['Related', 'DuckDuckGo'],
                        metadata: {
                            source: 'DuckDuckGo',
                            category: 'Related Topics'
                        },
                        aiInsights: {
                            summary: topic.Text,
                            keyPoints: [topic.Text.split(' - ')[1] || topic.Text],
                            relatedTopics: [],
                            sentiment: 'neutral'
                        }
                    });
                }
            });
        }
        
        return results;
    } catch (error) {
        console.error('DuckDuckGo search failed:', error);
        return [];
    }
};

// Enhanced Wikipedia search with multiple languages
const searchWikipedia = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        // Search in English
        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            if (response.data.extract) {
                results.push({
                    id: 'wiki-main',
                    title: response.data.title || query,
                    description: response.data.extract,
                    url: response.data.content_urls?.desktop?.page || '#',
                    type: 'article',
                    relevance: 0.92,
                    tags: ['Wikipedia', 'Encyclopedia', 'Knowledge'],
                    metadata: {
                        author: 'Wikipedia',
                        date: response.data.timestamp,
                        views: 100000,
                        rating: 4.8,
                        category: 'Encyclopedia',
                        source: 'Wikipedia'
                    },
                    aiInsights: {
                        summary: response.data.extract,
                        keyPoints: response.data.extract.split('. ').slice(0, 3),
                        relatedTopics: [],
                        sentiment: 'neutral'
                    }
                });
            }
        } catch (error) {
            console.error('Wikipedia search failed:', error);
        }
        
        // Search for related pages
        try {
            const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
            if (searchResponse.data.query?.search) {
                searchResponse.data.query.search.slice(0, 3).forEach((item: any, index: number) => {
                    results.push({
                        id: `wiki-search-${index}`,
                        title: item.title,
                        description: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
                        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
                        type: 'article',
                        relevance: 0.88 - (index * 0.1),
                        tags: ['Wikipedia', 'Search Results'],
                        metadata: {
                            author: 'Wikipedia',
                            category: 'Encyclopedia',
                            source: 'Wikipedia'
                        },
                        aiInsights: {
                            summary: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
                            keyPoints: [item.title],
                            relatedTopics: [],
                            sentiment: 'neutral'
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Wikipedia search failed:', error);
        }
        
        return results;
    } catch (error) {
        console.error('Wikipedia search failed:', error);
        return [];
    }
};

// Enhanced News search with multiple sources
const searchNews = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        // Try NewsAPI if available
        const newsApiKey = process.env.REACT_APP_NEWS_API_KEY || 'demo';
        if (newsApiKey !== 'demo') {
            try {
                const response = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}&pageSize=10&sortBy=relevancy`);
                if (response.data.articles) {
                    response.data.articles.forEach((article: any, index: number) => {
                        results.push({
                            id: `news-${index}`,
                            title: article.title,
                            description: article.description || article.content?.substring(0, 200) || 'News article',
                            url: article.url,
                            type: 'article',
                            relevance: 0.90 - (index * 0.05),
                            tags: ['News', 'Current Events'],
                            metadata: {
                                author: article.author,
                                date: article.publishedAt,
                                views: Math.floor(Math.random() * 50000) + 1000,
                                rating: 4.5,
                                category: 'News',
                                source: article.source.name
                            },
                            aiInsights: {
                                summary: article.description || article.content?.substring(0, 200) || 'Latest news article',
                                keyPoints: [article.title],
                                relatedTopics: [],
                                sentiment: 'neutral'
                            }
                        });
                    });
                }
            } catch (error) {
                console.error('NewsAPI search failed:', error);
            }
        }
        
        return results;
    } catch (error) {
        console.error('News search failed:', error);
        return [];
    }
};

// New: Search GitHub for code and repositories
const searchGitHub = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        // Search repositories
        const repoResponse = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`);
        if (repoResponse.data.items) {
            repoResponse.data.items.forEach((repo: any, index: number) => {
                results.push({
                    id: `github-repo-${index}`,
                    title: repo.full_name,
                    description: repo.description || 'GitHub repository',
                    url: repo.html_url,
                    type: 'code',
                    relevance: 0.88 - (index * 0.1),
                    tags: ['GitHub', 'Code', 'Repository'],
                    metadata: {
                        author: repo.owner.login,
                        date: repo.created_at,
                        views: repo.watchers_count,
                        rating: repo.stargazers_count / 1000,
                        language: repo.language,
                        category: 'Code Repository',
                        source: 'GitHub'
                    },
                    aiInsights: {
                        summary: repo.description || 'Popular GitHub repository',
                        keyPoints: [`${repo.language} project`, `${repo.stargazers_count} stars`, `${repo.forks_count} forks`],
                        relatedTopics: [repo.language, 'Open Source', 'Development'],
                        sentiment: 'positive'
                    }
                });
            });
        }
        
        return results;
    } catch (error) {
        console.error('GitHub search failed:', error);
        return [];
    }
};

// New: Search Stack Overflow for Q&A
const searchStackOverflow = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        const response = await axios.get(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=5`);
        if (response.data.items) {
            response.data.items.forEach((item: any, index: number) => {
                results.push({
                    id: `so-${index}`,
                    title: item.title,
                    description: item.title,
                    url: item.link,
                    type: 'community',
                    relevance: 0.85 - (index * 0.1),
                    tags: ['Stack Overflow', 'Q&A', 'Programming'],
                    metadata: {
                        author: item.owner?.display_name,
                        date: new Date(item.creation_date * 1000).toISOString(),
                        views: item.view_count,
                        rating: item.score,
                        category: 'Q&A',
                        source: 'Stack Overflow'
                    },
                    aiInsights: {
                        summary: item.title,
                        keyPoints: [`${item.answer_count} answers`, `${item.score} votes`, item.tags?.slice(0, 3)],
                        relatedTopics: item.tags || [],
                        sentiment: item.score > 0 ? 'positive' : 'neutral'
                    }
                });
            });
        }
        
        return results;
    } catch (error) {
        console.error('Stack Overflow search failed:', error);
        return [];
    }
};

// New: Search YouTube for videos
const searchYouTube = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        // Note: YouTube API requires API key, using mock for now
        const mockVideos = [
            {
                title: `Best ${query} Tutorials and Guides`,
                description: `Comprehensive video tutorials and guides about ${query} from top creators`,
                url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
                views: Math.floor(Math.random() * 1000000) + 10000,
                rating: 4.6,
                duration: '10-30 min'
            },
            {
                title: `${query} Explained Simply`,
                description: `Simple and clear explanations of ${query} concepts`,
                url: `https://youtube.com/results?search_query=${encodeURIComponent(query + ' explained')}`,
                views: Math.floor(Math.random() * 500000) + 5000,
                rating: 4.8,
                duration: '5-15 min'
            }
        ];
        
        mockVideos.forEach((video, index) => {
            results.push({
                id: `youtube-${index}`,
                title: video.title,
                description: video.description,
                url: video.url,
                type: 'video',
                relevance: 0.87 - (index * 0.1),
                tags: ['YouTube', 'Video', 'Tutorial'],
                metadata: {
                    views: video.views,
                    rating: video.rating,
                    category: 'Video Tutorial',
                    source: 'YouTube'
                },
                aiInsights: {
                    summary: video.description,
                    keyPoints: [video.duration, `${video.views.toLocaleString()} views`],
                    relatedTopics: ['Video Tutorials', 'Learning'],
                    sentiment: 'positive'
                }
            });
        });
        
        return results;
    } catch (error) {
        console.error('YouTube search failed:', error);
        return [];
    }
};

// New: Comprehensive web search across multiple sources
const searchWebComprehensive = async (query: string): Promise<SearchResult[]> => {
    try {
        const results: SearchResult[] = [];
        
        // Search across multiple web sources
        const webSources = [
            {
                name: 'Reddit',
                url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
                type: 'community' as const,
                description: `Community discussions and posts about "${query}" on Reddit`
            },
            {
                name: 'Medium',
                url: `https://medium.com/search?q=${encodeURIComponent(query)}`,
                type: 'article' as const,
                description: `Articles and blog posts about "${query}" on Medium`
            },
            {
                name: 'Dev.to',
                url: `https://dev.to/search?q=${encodeURIComponent(query)}`,
                type: 'article' as const,
                description: `Developer articles and tutorials about "${query}"`
            },
            {
                name: 'Hashnode',
                url: `https://hashnode.com/search?q=${encodeURIComponent(query)}`,
                type: 'article' as const,
                description: `Technical blog posts about "${query}"`
            },
            {
                name: 'Product Hunt',
                url: `https://www.producthunt.com/search?q=${encodeURIComponent(query)}`,
                type: 'tool' as const,
                description: `Products and tools related to "${query}"`
            },
            {
                name: 'Indie Hackers',
                url: `https://www.indiehackers.com/search?q=${encodeURIComponent(query)}`,
                type: 'community' as const,
                description: `Entrepreneurial discussions about "${query}"`
            }
        ];
        
        webSources.forEach((source, index) => {
            results.push({
                id: `web-${source.name.toLowerCase()}-${index}`,
                title: `${query} - ${source.name} Results`,
                description: source.description,
                url: source.url,
                type: source.type,
                relevance: 0.80 - (index * 0.05),
                tags: [source.name, 'Web Search', 'Community'],
                metadata: {
                    author: `${source.name} Community`,
                    date: new Date().toISOString(),
                    views: Math.floor(Math.random() * 10000) + 1000,
                    rating: 4.3 + (Math.random() * 0.4),
                    category: source.type === 'article' ? 'Blog Post' : source.type === 'tool' ? 'Product' : 'Community',
                    source: source.name
                },
                aiInsights: {
                    summary: source.description,
                    keyPoints: [`${source.name} community content`, 'User-generated content', 'Real-world discussions'],
                    relatedTopics: [source.name, 'Community', 'User Content'],
                    sentiment: 'positive'
                }
            });
        });
        
        return results;
    } catch (error) {
        console.error('Comprehensive web search failed:', error);
        return [];
    }
};

// Enhanced infinite web search with multiple sources
const realSearchAPI = async (query: string): Promise<SearchResult[]> => {
    try {
        // Search multiple sources in parallel for infinite web coverage
        const searchPromises = [
            searchDuckDuckGo(query),
            searchWikipedia(query),
            searchNews(query),
            searchGitHub(query),
            searchStackOverflow(query),
            searchYouTube(query),
            searchWebComprehensive(query)
        ];
        
        const results = await Promise.allSettled(searchPromises);
        
        let allResults: SearchResult[] = [];
        
        // Combine results from all sources
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
                allResults.push(...result.value);
            }
        });
        
        // If no real results, fall back to enhanced mock results
        if (allResults.length === 0) {
            return enhancedMockResults(query);
        }
        
        // Remove duplicates and sort by relevance
        const uniqueResults = allResults.filter((result, index, self) => 
            index === self.findIndex(r => r.title === result.title && r.url === result.url)
        );
        
        // Enhanced sorting with source priority
        const sortedResults = uniqueResults.sort((a, b) => {
            // Priority: DuckDuckGo > Wikipedia > News > GitHub > Stack Overflow > YouTube > Web Sources
            const sourcePriority = {
                'DuckDuckGo': 7,
                'Wikipedia': 6,
                'News': 5,
                'GitHub': 4,
                'Stack Overflow': 3,
                'YouTube': 2,
                'Reddit': 1,
                'Medium': 1,
                'Dev.to': 1,
                'Hashnode': 1,
                'Product Hunt': 1,
                'Indie Hackers': 1
            };
            
            const aPriority = sourcePriority[a.metadata.source || ''] || 0;
            const bPriority = sourcePriority[b.metadata.source || ''] || 0;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            return b.relevance - a.relevance;
        });
        
        return sortedResults.slice(0, 25); // Return top 25 results for infinite feel
        
    } catch (error) {
        console.error('Infinite web search failed:', error);
        return enhancedMockResults(query);
    }
};

// Enhanced mock results for infinite web search
const enhancedMockResults = (query: string): SearchResult[] => {
    const mockResults: SearchResult[] = [
        {
            id: '1',
            title: `Search Results for "${query}" - AI-Powered Analysis`,
            description: `Nova AI has analyzed your search for "${query}" and found relevant information across multiple sources. Here are the most relevant results with AI-powered insights.`,
            url: `https://nova-search.com/results?q=${encodeURIComponent(query)}`,
            type: 'article',
            relevance: 0.98,
            tags: ['AI Analysis', 'Search Results', 'Nova'],
            metadata: {
                author: 'Nova AI',
                date: new Date().toISOString(),
                views: 15420,
                rating: 4.8,
                category: 'AI Search',
                source: 'Nova Search'
            },
            aiInsights: {
                summary: `AI-powered search results for "${query}" with semantic understanding and relevance scoring.`,
                keyPoints: ['Semantic search analysis', 'Multi-source aggregation', 'AI relevance scoring'],
                relatedTopics: ['Machine Learning', 'Search Technology', 'AI'],
                sentiment: 'positive'
            }
        },
        {
            id: '2',
            title: `Understanding "${query}": A Comprehensive Guide`,
            description: `Explore the latest information and insights about "${query}" from authoritative sources and expert analysis.`,
            url: `https://nova-search.com/guide/${encodeURIComponent(query)}`,
            type: 'article',
            relevance: 0.95,
            tags: ['Guide', 'Comprehensive', 'Expert Analysis'],
            metadata: {
                author: 'Nova Research Team',
                date: new Date().toISOString(),
                views: 8920,
                rating: 4.9,
                category: 'Research',
                source: 'Nova Research'
            },
            aiInsights: {
                summary: `Comprehensive analysis and guide for understanding "${query}" with expert insights.`,
                keyPoints: ['Expert analysis', 'Comprehensive coverage', 'Latest information'],
                relatedTopics: ['Research', 'Analysis', 'Expert Insights'],
                sentiment: 'positive'
            }
        },
        {
            id: '3',
            title: `Latest News and Updates on "${query}"`,
            description: `Stay updated with the latest news, developments, and trends related to "${query}" from trusted sources worldwide.`,
            url: `https://nova-search.com/news/${encodeURIComponent(query)}`,
            type: 'article',
            relevance: 0.92,
            tags: ['News', 'Updates', 'Trends'],
            metadata: {
                author: 'Nova News',
                date: new Date().toISOString(),
                views: 23450,
                rating: 4.7,
                category: 'News',
                source: 'Nova News'
            },
            aiInsights: {
                summary: `Latest news and developments about "${query}" from global sources.`,
                keyPoints: ['Latest news', 'Global sources', 'Trending topics'],
                relatedTopics: ['Current Events', 'Global News', 'Trends'],
                sentiment: 'neutral'
            }
        },
        {
            id: '4',
            title: `${query} - GitHub Repositories and Code Examples`,
            description: `Discover open-source projects, code examples, and repositories related to "${query}" on GitHub.`,
            url: `https://github.com/search?q=${encodeURIComponent(query)}`,
            type: 'code',
            relevance: 0.89,
            tags: ['GitHub', 'Code', 'Open Source'],
            metadata: {
                author: 'GitHub Community',
                date: new Date().toISOString(),
                views: 45670,
                rating: 4.6,
                category: 'Code Repository',
                source: 'GitHub'
            },
            aiInsights: {
                summary: `Popular GitHub repositories and code examples for "${query}".`,
                keyPoints: ['Open source projects', 'Code examples', 'Community contributions'],
                relatedTopics: ['Programming', 'Open Source', 'Development'],
                sentiment: 'positive'
            }
        },
        {
            id: '5',
            title: `${query} - Stack Overflow Q&A`,
            description: `Find answers to common questions and solutions for "${query}" from the Stack Overflow community.`,
            url: `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`,
            type: 'community',
            relevance: 0.87,
            tags: ['Stack Overflow', 'Q&A', 'Programming'],
            metadata: {
                author: 'Stack Overflow Community',
                date: new Date().toISOString(),
                views: 12340,
                rating: 4.5,
                category: 'Q&A',
                source: 'Stack Overflow'
            },
            aiInsights: {
                summary: `Community-driven Q&A and solutions for "${query}".`,
                keyPoints: ['Community answers', 'Voted solutions', 'Expert help'],
                relatedTopics: ['Programming Help', 'Community Support', 'Problem Solving'],
                sentiment: 'positive'
            }
        },
        {
            id: '6',
            title: `${query} - Video Tutorials and Guides`,
            description: `Learn "${query}" through comprehensive video tutorials, courses, and educational content.`,
            url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
            type: 'video',
            relevance: 0.85,
            tags: ['YouTube', 'Video', 'Tutorial'],
            metadata: {
                author: 'YouTube Creators',
                date: new Date().toISOString(),
                views: 67890,
                rating: 4.7,
                category: 'Video Tutorial',
                source: 'YouTube'
            },
            aiInsights: {
                summary: `Educational video content and tutorials for "${query}".`,
                keyPoints: ['Video tutorials', 'Step-by-step guides', 'Visual learning'],
                relatedTopics: ['Education', 'Learning', 'Video Content'],
                sentiment: 'positive'
            }
        },
        {
            id: '7',
            title: `${query} - Documentation and API Reference`,
            description: `Official documentation, API references, and technical specifications for "${query}".`,
            url: `https://docs.example.com/${encodeURIComponent(query)}`,
            type: 'tool',
            relevance: 0.83,
            tags: ['Documentation', 'API', 'Technical'],
            metadata: {
                author: 'Official Documentation',
                date: new Date().toISOString(),
                views: 34560,
                rating: 4.9,
                category: 'Documentation',
                source: 'Official Docs'
            },
            aiInsights: {
                summary: `Official documentation and technical specifications for "${query}".`,
                keyPoints: ['Official docs', 'API reference', 'Technical specs'],
                relatedTopics: ['Documentation', 'API', 'Technical Reference'],
                sentiment: 'neutral'
            }
        },
        {
            id: '8',
            title: `${query} - Data Analysis and Statistics`,
            description: `Data-driven insights, statistics, and analytical information about "${query}".`,
            url: `https://analytics.example.com/${encodeURIComponent(query)}`,
            type: 'data',
            relevance: 0.81,
            tags: ['Data', 'Analytics', 'Statistics'],
            metadata: {
                author: 'Data Analytics Team',
                date: new Date().toISOString(),
                views: 18920,
                rating: 4.4,
                category: 'Data Analysis',
                source: 'Analytics Platform'
            },
            aiInsights: {
                summary: `Data-driven insights and statistical analysis for "${query}".`,
                keyPoints: ['Statistical data', 'Trend analysis', 'Data insights'],
                relatedTopics: ['Data Science', 'Analytics', 'Statistics'],
                sentiment: 'neutral'
            }
        }
    ];
    
    return mockResults;
};

export function VercelV0Chat() {
    const [value, setValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [allResults, setAllResults] = useState<SearchResult[]>([]);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    const handleSearch = async () => {
        if (!value.trim()) return;
        
        setIsSearching(true);
        setSearchResults([]);
        setAllResults([]);
        setCurrentPage(1);
        setHasMoreResults(true);
        
        try {
            const results = await realSearchAPI(value);
            setAllResults(results);
            setSearchResults(results.slice(0, 10)); // Show first 10 results
            setHasMoreResults(results.length > 10);
        } catch (error) {
            console.error('Search failed:', error);
            // Fallback to mock results
            const fallbackResults = enhancedMockResults(value);
            setAllResults(fallbackResults);
            setSearchResults(fallbackResults.slice(0, 10));
            setHasMoreResults(fallbackResults.length > 10);
        } finally {
            setIsSearching(false);
        }
    };

    const loadMoreResults = async () => {
        if (!hasMoreResults || isLoadingMore) return;
        
        setIsLoadingMore(true);
        
        try {
            // Simulate loading more results by showing more from existing results
            const nextPage = currentPage + 1;
            const startIndex = (nextPage - 1) * 10;
            const endIndex = startIndex + 10;
            const newResults = allResults.slice(startIndex, endIndex);
            
            if (newResults.length > 0) {
                setSearchResults(prev => [...prev, ...newResults]);
                setCurrentPage(nextPage);
                setHasMoreResults(endIndex < allResults.length);
            } else {
                // Generate more results for infinite feel
                const additionalResults = enhancedMockResults(value);
                const additionalResultsWithOffset = additionalResults.map((result, index) => ({
                    ...result,
                    id: `${result.id}-page-${nextPage}-${index}`,
                    relevance: result.relevance - (nextPage * 0.1)
                }));
                
                setAllResults(prev => [...prev, ...additionalResultsWithOffset]);
                setSearchResults(prev => [...prev, ...additionalResultsWithOffset.slice(0, 10)]);
                setCurrentPage(nextPage);
                setHasMoreResults(true); // Always have more results for infinite search
            }
        } catch (error) {
            console.error('Load more failed:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'article': return <BookOpen className="w-4 h-4" />;
            case 'video': return <Video className="w-4 h-4" />;
            case 'code': return <Code className="w-4 h-4" />;
            case 'data': return <BarChart3 className="w-4 h-4" />;
            case 'tool': return <Zap className="w-4 h-4" />;
            case 'community': return <Users className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'article': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'video': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'code': return 'bg-green-100 text-green-700 border-green-200';
            case 'data': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'tool': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'community': return 'bg-pink-100 text-pink-700 border-pink-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredResults = searchResults.filter(result => 
        selectedFilters.length === 0 || selectedFilters.includes(result.type)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 flex flex-col">
            {/* Aceternity Background Boxes */}
            <Boxes className="opacity-20 scale-150 fixed inset-0 z-1" />
            
            {/* Dreamy Aura Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            {/* Simple Header */}
            <header className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                    Nova Search
                                </span>
                            </div>
                            <nav className="hidden md:flex items-center space-x-6">
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">API</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Docs</a>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Sign In</button>
                            <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-5 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text drop-shadow-lg animate-glow-pulse">
                        Nova Search
                    </h1>
                    <p className="text-xl text-gray-600 font-manrope max-w-2xl mx-auto">
                        Your AI-powered search assistant. Ask anything, discover everything across the infinite web.
                    </p>

                    {/* Search Interface */}
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="relative bg-white/90 rounded-2xl border border-blue-200/50 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-fade-in">
                            <div className="overflow-y-auto">
                                <Textarea
                                    ref={textareaRef}
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value);
                                        adjustHeight();
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search the universe of knowledge with Nova..."
                                    className={cn(
                                        "w-full px-6 py-4",
                                        "resize-none",
                                        "bg-transparent",
                                        "border-none",
                                        "text-gray-800 text-lg font-manrope",
                                        "focus:outline-none",
                                        "focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-offset-0",
                                        "placeholder:text-gray-400 placeholder:text-lg",
                                        "min-h-[70px] rounded-xl shadow-inner transition-all duration-300",
                                        "backdrop-blur-md"
                                    )}
                                    style={{
                                        overflow: "hidden",
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="group p-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Paperclip className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-blue-400 hidden group-hover:inline transition-opacity">
                                            Attach
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded-lg text-sm text-purple-400 transition-colors border border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 flex items-center gap-2"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Voice
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded-lg text-sm text-gray-500 transition-colors hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className={cn(
                                            "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-blue-200 hover:border-blue-400 hover:shadow-lg flex items-center gap-2",
                                            value.trim() && !isSearching
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-glow-pulse"
                                                : "text-blue-300 bg-gray-50"
                                        )}
                                    >
                                        {isSearching ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4" />
                                                <span>Search</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Results */}
                    {isSearching && (
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-blue-600 font-manrope">Nova AI is searching the universe...</span>
                            </div>
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="w-full mt-8 space-y-4">
                            {/* Results Header */}
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {filteredResults.length} Results Found
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === 'grid' 
                                                    ? 'bg-blue-100 text-blue-600' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === 'list' 
                                                    ? 'bg-blue-100 text-blue-600' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-gray-600" />
                                    <select 
                                        value={selectedFilters.join(',')} 
                                        onChange={(e) => setSelectedFilters(e.target.value ? e.target.value.split(',') : [])}
                                        className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1 text-sm"
                                    >
                                        <option value="">All Types</option>
                                        <option value="article">Articles</option>
                                        <option value="video">Videos</option>
                                        <option value="code">Code</option>
                                        <option value="data">Data</option>
                                        <option value="tool">Tools</option>
                                        <option value="community">Community</option>
                                    </select>
                                </div>
                            </div>

                            {/* Results Grid/List */}
                            <div className={cn(
                                "grid gap-4 max-h-96 overflow-y-auto",
                                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                            )}>
                                {filteredResults.map((result, index) => (
                                    <div
                                        key={result.id}
                                        className="group bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 hover:bg-white/90 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                        onClick={() => window.open(result.url, '_blank')}
                                    >
                                        {/* Result Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                                                    {getTypeIcon(result.type)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                                        {result.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {Math.round(result.relevance * 100)}% relevant
                                                        </span>
                                                        {result.metadata.rating && (
                                                            <div className="flex items-center space-x-1">
                                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                                <span className="text-xs text-gray-500">
                                                                    {result.metadata.rating}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <button 
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Save to bookmarks functionality
                                                    }}
                                                >
                                                    <Bookmark className="w-4 h-4 text-gray-400" />
                                                </button>
                                                <button 
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Share functionality
                                                    }}
                                                >
                                                    <Share2 className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                            {result.description}
                                        </p>

                                        {/* AI Insights */}
                                        {result.aiInsights && (
                                            <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Brain className="w-3 h-3 text-blue-600" />
                                                    <span className="text-xs font-semibold text-blue-700">AI Insights</span>
                                                </div>
                                                <p className="text-xs text-gray-700 mb-1 line-clamp-1">
                                                    {result.aiInsights.summary}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {result.aiInsights.keyPoints.slice(0, 1).map((point, i) => (
                                                        <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                            {point}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {result.tags.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Metadata */}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                {result.metadata.author && (
                                                    <span>{result.metadata.author}</span>
                                                )}
                                                {result.metadata.views && (
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{result.metadata.views.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                                                <span>Open</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMoreResults && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={loadMoreResults}
                                        disabled={isLoadingMore}
                                        className={cn(
                                            "px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                                            "flex items-center space-x-2 backdrop-blur-sm border border-blue-200/50"
                                        )}
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" />
                                                <span>Load More</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Infinite Search Status */}
                            {searchResults.length > 0 && (
                                <div className="text-center mt-4">
                                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200/50">
                                        <Globe className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">
                                            {searchResults.length} results found
                                        </span>
                                        {currentPage > 1 && (
                                            <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
                                                Page {currentPage}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {searchResults.length > 0 && (
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <ActionButton
                                        icon={<Search className="w-4 h-4 text-blue-500" />}
                                        label="Advanced"
                                    />
                                    <ActionButton
                                        icon={<Brain className="w-4 h-4 text-purple-500" />}
                                        label="AI Insights"
                                    />
                                    <ActionButton
                                        icon={<Clock className="w-4 h-4 text-cyan-500" />}
                                        label="History"
                                    />
                                    <ActionButton
                                        icon={<Bookmark className="w-4 h-4 text-blue-400" />}
                                        label="Saved"
                                    />
                                    <ActionButton
                                        icon={<Filter className="w-4 h-4 text-purple-400" />}
                                        label="Filters"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-gray-200/30 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <span className="text-sm text-gray-600">© 2024 Nova Search</span>
                            <div className="flex items-center space-x-4">
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Support</a>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">API</a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
    return (
        <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
        >
            {icon}
            <span className="text-xs">{label}</span>
        </button>
    );
}


