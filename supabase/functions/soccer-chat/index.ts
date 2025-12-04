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
            content: `You are Menlifoot's Soccer AI - a knowledgeable football companion. Your tone is casual, conversational, witty, and professional.

Your personality:
- You're genuinely passionate about football and enjoy good banter
- You speak naturally - like chatting with a friend who happens to know everything about soccer
- You're clever and can be witty, but never at the expense of being helpful
- Keep responses concise and insightful - get to the point

Your expertise:
- Match predictions and tactical analysis
- Player stats, comparisons, and career insights
- Transfer news and market analysis
- Football history, records, and memorable moments
- World Cup 2026 (USA, Mexico, Canada) - the upcoming expanded 48-team tournament
- All major leagues: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, and international football

Important: You only discuss soccer/football topics. If asked about something else, politely steer the conversation back to football.`
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
      reply: "Something went wrong on my end. Give it another shot!"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
