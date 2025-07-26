import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = 'all', limit = 20 } = await req.json();
    
    if (!query) {
      throw new Error('Search query is required');
    }

    const serpApiKey = Deno.env.get('SERP_API_KEY');
    if (!serpApiKey) {
      throw new Error('SERP API key not configured');
    }

    console.log(`Searching for: ${query}, type: ${type}`);
    
    const results: SearchResult[] = [];

    // Google Web Search
    if (type === 'all' || type === 'web') {
      try {
        const webResponse = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=10`);
        const webData = await webResponse.json();
        
        if (webData.organic_results) {
          webData.organic_results.slice(0, 8).forEach((result: any, index: number) => {
            results.push({
              id: `web-${index}`,
              title: result.title || 'Web Result',
              description: result.snippet || result.title,
              url: result.link,
              type: 'web',
              source: 'Google',
              metadata: {
                domain: new URL(result.link).hostname,
                date: result.date
              }
            });
          });
        }
      } catch (error) {
        console.error('Web search error:', error);
      }
    }

    // Google News Search
    if (type === 'all' || type === 'news') {
      try {
        const newsResponse = await fetch(`https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=8`);
        const newsData = await newsResponse.json();
        
        if (newsData.news_results) {
          newsData.news_results.slice(0, 6).forEach((result: any, index: number) => {
            results.push({
              id: `news-${index}`,
              title: result.title || 'News Article',
              description: result.snippet || result.title,
              url: result.link,
              type: 'news',
              source: result.source || 'News',
              thumbnail: result.thumbnail,
              metadata: {
                date: result.date,
                author: result.source
              }
            });
          });
        }
      } catch (error) {
        console.error('News search error:', error);
      }
    }

    // YouTube Search
    if (type === 'all' || type === 'video') {
      try {
        const videoResponse = await fetch(`https://serpapi.com/search.json?engine=youtube&search_query=${encodeURIComponent(query)}&api_key=${serpApiKey}`);
        const videoData = await videoResponse.json();
        
        if (videoData.video_results) {
          videoData.video_results.slice(0, 6).forEach((result: any, index: number) => {
            results.push({
              id: `video-${index}`,
              title: result.title || 'Video',
              description: result.description || result.title,
              url: result.link,
              type: 'video',
              source: 'YouTube',
              thumbnail: result.thumbnail?.static,
              metadata: {
                author: result.channel?.name,
                views: result.views,
                date: result.published_date
              }
            });
          });
        }
      } catch (error) {
        console.error('Video search error:', error);
      }
    }

    // Google Images Search
    if (type === 'all' || type === 'image') {
      try {
        const imageResponse = await fetch(`https://serpapi.com/search.json?engine=google&tbm=isch&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=6`);
        const imageData = await imageResponse.json();
        
        if (imageData.images_results) {
          imageData.images_results.slice(0, 4).forEach((result: any, index: number) => {
            results.push({
              id: `image-${index}`,
              title: result.title || 'Image',
              description: result.title || 'Image result',
              url: result.original,
              type: 'image',
              source: 'Google Images',
              thumbnail: result.thumbnail,
              metadata: {
                domain: result.source
              }
            });
          });
        }
      } catch (error) {
        console.error('Image search error:', error);
      }
    }

    // GitHub Search (using SerpAPI)
    if (type === 'all' || type === 'code') {
      try {
        const githubResponse = await fetch(`https://serpapi.com/search.json?engine=google&q=site:github.com+${encodeURIComponent(query)}&api_key=${serpApiKey}&num=5`);
        const githubData = await githubResponse.json();
        
        if (githubData.organic_results) {
          githubData.organic_results.slice(0, 4).forEach((result: any, index: number) => {
            if (result.link.includes('github.com')) {
              results.push({
                id: `code-${index}`,
                title: result.title || 'GitHub Repository',
                description: result.snippet || result.title,
                url: result.link,
                type: 'code',
                source: 'GitHub',
                metadata: {
                  domain: 'github.com'
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('GitHub search error:', error);
      }
    }

    // Academic Search (Google Scholar via SerpAPI)
    if (type === 'all' || type === 'academic') {
      try {
        const scholarResponse = await fetch(`https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=4`);
        const scholarData = await scholarResponse.json();
        
        if (scholarData.organic_results) {
          scholarData.organic_results.slice(0, 3).forEach((result: any, index: number) => {
            results.push({
              id: `academic-${index}`,
              title: result.title || 'Academic Paper',
              description: result.snippet || result.title,
              url: result.link,
              type: 'academic',
              source: 'Google Scholar',
              metadata: {
                author: result.publication_info?.authors?.[0]?.name,
                date: result.publication_info?.summary
              }
            });
          });
        }
      } catch (error) {
        console.error('Academic search error:', error);
      }
    }

    // Store search in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('searches').insert({
      query,
      results: results,
      source: type,
      metadata: {
        total_results: results.length,
        timestamp: new Date().toISOString()
      }
    });

    // Sort results by relevance (prioritize web and news)
    const sortedResults = results.sort((a, b) => {
      const typeOrder = { web: 1, news: 2, video: 3, image: 4, code: 5, academic: 6 };
      return (typeOrder[a.type] || 7) - (typeOrder[b.type] || 7);
    });

    return new Response(JSON.stringify({ 
      success: true, 
      results: sortedResults.slice(0, limit),
      total: sortedResults.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});