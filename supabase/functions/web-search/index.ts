import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: string;
  relevance?: number;
  metadata?: any;
}

async function searchWikipedia(query: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching Wikipedia for: ${query}`);
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/search/page?q=${encodeURIComponent(query)}&limit=5`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.pages) {
      return data.pages.map((page: any) => ({
        title: page.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`,
        description: page.description || page.excerpt,
        source: 'Wikipedia',
        relevance: 0.8,
        metadata: { thumbnail: page.thumbnail }
      }));
    }
    return [];
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

async function searchGitHub(query: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching GitHub for: ${query}`);
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=3`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((repo: any) => ({
        title: repo.full_name,
        url: repo.html_url,
        description: repo.description || 'No description available',
        source: 'GitHub',
        relevance: 0.9,
        metadata: { 
          stars: repo.stargazers_count,
          language: repo.language,
          updated: repo.updated_at
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('GitHub search error:', error);
    return [];
  }
}

async function searchHackerNews(query: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching Hacker News for: ${query}`);
    const searchUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=3`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.hits) {
      return data.hits.map((hit: any) => ({
        title: hit.title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        description: hit.story_text || `${hit.points} points, ${hit.num_comments} comments`,
        source: 'Hacker News',
        relevance: 0.7,
        metadata: {
          points: hit.points,
          comments: hit.num_comments,
          author: hit.author,
          created_at: hit.created_at
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Hacker News search error:', error);
    return [];
  }
}

async function searchReddit(query: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching Reddit for: ${query}`);
    const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3&sort=hot`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Nova-Search/1.0'
      }
    });
    
    if (!response.ok) {
      console.log('Reddit search failed, skipping...');
      return [];
    }
    
    const data = await response.json();
    
    if (data.data?.children) {
      return data.data.children.map((child: any) => ({
        title: child.data.title,
        url: `https://reddit.com${child.data.permalink}`,
        description: child.data.selftext || `${child.data.ups} upvotes in r/${child.data.subreddit}`,
        source: 'Reddit',
        relevance: 0.6,
        metadata: {
          subreddit: child.data.subreddit,
          ups: child.data.ups,
          num_comments: child.data.num_comments,
          author: child.data.author
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Reddit search error:', error);
    return [];
  }
}

async function searchStackOverflow(query: string): Promise<SearchResult[]> {
  try {
    console.log(`Searching Stack Overflow for: ${query}`);
    const searchUrl = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=3`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((item: any) => ({
        title: item.title,
        url: item.link,
        description: `Score: ${item.score}, Answers: ${item.answer_count}`,
        source: 'Stack Overflow',
        relevance: 0.85,
        metadata: {
          score: item.score,
          answer_count: item.answer_count,
          tags: item.tags,
          is_answered: item.is_answered
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Stack Overflow search error:', error);
    return [];
  }
}

async function performWebSearch(query: string): Promise<SearchResult[]> {
  const searchPromises = [
    searchWikipedia(query),
    searchGitHub(query),
    searchHackerNews(query),
    searchReddit(query),
    searchStackOverflow(query)
  ];

  try {
    const results = await Promise.allSettled(searchPromises);
    const allResults: SearchResult[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allResults.push(...result.value);
      } else {
        console.error(`Search source ${index} failed:`, result.reason);
      }
    });

    // Sort by relevance and return top results
    return allResults
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 15);
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, session_id } = await req.json();
    console.log(`Processing search request for: "${query}"`);

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Perform the web search
    const searchResults = await performWebSearch(query.trim());
    
    // Store search results in database
    try {
      const { data: savedSearch, error: dbError } = await supabase
        .from('searches')
        .insert({
          query: query.trim(),
          results: searchResults,
          source: 'web',
          user_session: session_id,
          metadata: {
            result_count: searchResults.length,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
      } else {
        console.log('Search saved to database:', savedSearch.id);
      }
    } catch (dbError) {
      console.error('Failed to save search to database:', dbError);
    }

    // Return search results
    return new Response(
      JSON.stringify({
        success: true,
        query,
        results: searchResults,
        total_results: searchResults.length,
        sources: [...new Set(searchResults.map(r => r.source))],
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Search function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});