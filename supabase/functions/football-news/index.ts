import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NEWS_API_BASE = 'https://newsapi.org/v2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const newsItems: any[] = [];

    // Build search queries based on category
    const queries: Record<string, string> = {
      worldcup: 'FIFA World Cup 2026 OR "World Cup qualification" OR "World Cup qualifier"',
      transfers: 'football transfer OR soccer transfer OR player signing',
      champions: 'Champions League OR UEFA Champions League',
      matches: 'Premier League OR La Liga OR Bundesliga OR Serie A match',
      injuries: 'football injury OR soccer player injured',
      all: 'football OR soccer OR Premier League OR Champions League OR World Cup',
    };

    const searchQuery = queries[category] || queries.all;

    console.log(`Fetching news for category: ${category}, query: ${searchQuery}`);

    // Fetch from NewsAPI - everything endpoint for comprehensive results
    const newsResponse = await fetch(
      `${NEWS_API_BASE}/everything?` + new URLSearchParams({
        q: searchQuery,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: String(Math.min(limit, 100)),
      }),
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY,
        },
      }
    );

    const newsData = await newsResponse.json();

    if (newsData.status === 'error') {
      console.error('NewsAPI error:', newsData.message);
      throw new Error(newsData.message || 'Failed to fetch news');
    }

    if (newsData.articles) {
      console.log(`Found ${newsData.articles.length} articles`);
      
      newsData.articles.forEach((article: any, index: number) => {
        // Determine category based on content
        let articleCategory = 'Football News';
        const titleLower = (article.title || '').toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const content = titleLower + ' ' + descLower;

        if (content.includes('world cup') || content.includes('qualifier') || content.includes('qualification')) {
          articleCategory = 'World Cup 2026';
        } else if (content.includes('transfer') || content.includes('signing') || content.includes('deal')) {
          articleCategory = 'Transfer News';
        } else if (content.includes('champions league') || content.includes('ucl')) {
          articleCategory = 'Champions League';
        } else if (content.includes('premier league')) {
          articleCategory = 'Premier League';
        } else if (content.includes('la liga') || content.includes('laliga')) {
          articleCategory = 'La Liga';
        } else if (content.includes('bundesliga')) {
          articleCategory = 'Bundesliga';
        } else if (content.includes('serie a')) {
          articleCategory = 'Serie A';
        } else if (content.includes('injur')) {
          articleCategory = 'Injury Report';
        }

        newsItems.push({
          id: `news-${index}-${Date.now()}`,
          category: articleCategory,
          title: article.title || 'Untitled',
          excerpt: article.description || article.content?.substring(0, 200) || '',
          content: article.content || article.description || '',
          date: article.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          image: article.urlToImage,
          type: category === 'worldcup' ? 'worldcup' : 
                category === 'transfers' ? 'transfer' :
                category === 'champions' ? 'champions' :
                category === 'injuries' ? 'injury' : 'news',
          source: article.source?.name || 'Unknown',
          url: article.url,
          author: article.author,
        });
      });
    }

    // Sort by date
    newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Returning ${newsItems.length} news items`);

    return new Response(JSON.stringify({ 
      success: true, 
      news: newsItems.slice(0, limit),
      total: newsData.totalResults || newsItems.length,
      categories: ['worldcup', 'transfers', 'champions', 'matches', 'injuries']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching football news:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
