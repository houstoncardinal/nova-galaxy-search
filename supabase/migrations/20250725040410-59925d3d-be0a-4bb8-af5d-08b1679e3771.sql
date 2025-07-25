-- Create searches table for storing search history and results
CREATE TABLE public.searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  results JSONB,
  source TEXT NOT NULL DEFAULT 'web',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_session TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this is a public search engine)
CREATE POLICY "Anyone can view searches" 
ON public.searches 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create searches" 
ON public.searches 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_searches_query ON public.searches(query);
CREATE INDEX idx_searches_created_at ON public.searches(created_at DESC);

-- Create search_sources table for managing different search sources
CREATE TABLE public.search_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  url_pattern TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_sources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view search sources" 
ON public.search_sources 
FOR SELECT 
USING (true);

-- Insert default search sources
INSERT INTO public.search_sources (name, description, url_pattern) VALUES
('DuckDuckGo', 'Privacy-focused search engine', 'https://api.duckduckgo.com/?q={query}&format=json&no_redirect=1&skip_disambig=1'),
('Wikipedia', 'Free encyclopedia', 'https://en.wikipedia.org/api/rest_v1/page/summary/{query}'),
('GitHub', 'Code repositories', 'https://api.github.com/search/repositories?q={query}'),
('Reddit', 'Social discussions', 'https://www.reddit.com/search.json?q={query}'),
('HackerNews', 'Tech news', 'https://hn.algolia.com/api/v1/search?query={query}');