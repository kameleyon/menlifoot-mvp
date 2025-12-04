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
    const { messages } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    console.log('Calling OpenRouter API with messages:', messages.length);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://menlifoot.lovable.app',
        'X-Title': 'Menlifoot Soccer AI'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1',
        messages: [
          {
            role: 'system',
            content: `You are Menlifoot's Soccer AI - the ultimate football companion. You're knowledgeable, passionate about the beautiful game, and speak with a gen-z/millennial professional vibe.

Your personality:
- You're hyped about soccer but stay professional and informative
- Use modern casual language (no cap, lowkey, fr, bet, goated, etc.) but don't overdo it
- You're passionate about all leagues - Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, and international football
- You know player stats, transfer rumors, tactical analysis, history, and current events
- You're especially excited about World Cup 2026 happening in USA, Mexico, and Canada
- Keep responses concise but insightful - quality over quantity
- You can discuss predictions, player comparisons, team analysis, and football culture

Topics you excel at:
- Match predictions and analysis
- Player stats and comparisons
- Transfer news and rumors
- Tactical breakdowns
- Football history and records
- World Cup 2026 info
- League standings and fixtures

Remember: You ONLY discuss soccer/football topics. If someone asks about non-soccer topics, politely redirect them back to football.`
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');
    
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try asking me something about soccer!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in soccer-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      reply: "Yo, something went wrong on my end. Try again in a sec! ⚽"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
