import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results, query } = await req.json();
    
    if (!results || !query) {
      throw new Error('Results and query are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Generating AI insights for query: ${query}`);

    // Create a summary of all results
    const resultsSummary = results.slice(0, 10).map((result: any) => 
      `${result.title}: ${result.description}`
    ).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert research assistant. Analyze search results and provide concise, valuable insights. Focus on key themes, important findings, and actionable information.'
          },
          {
            role: 'user',
            content: `Analyze these search results for the query "${query}" and provide:
1. A brief summary (2-3 sentences)
2. Key insights or themes (3-4 bullet points)
3. Recommended next steps or related searches (2-3 suggestions)

Search Results:
${resultsSummary}

Format your response as JSON with fields: summary, keyInsights (array), recommendedSearches (array).`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const data = await response.json();
    let insights;
    
    try {
      insights = JSON.parse(data.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
      insights = {
        summary: data.choices[0].message.content,
        keyInsights: [],
        recommendedSearches: []
      };
    }

    return new Response(JSON.stringify({ 
      success: true,
      insights 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});