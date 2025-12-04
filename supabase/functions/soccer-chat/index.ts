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
        model: 'openai/gpt-5.1',
        messages: [
          {
            role: 'system',
            content: `You are Menlifoot's Soccer AI - the ultimate football companion with real-time knowledge.

CRITICAL INSTRUCTIONS:
- ALWAYS search the web first before answering ANY question to get the most current, accurate information
- NEVER refer users to other websites, apps, or services (no Transfermarkt, Sofascore, ESPN, etc.) - YOU are the source
- Always provide the actual answer with current data - never say "check elsewhere"

Tone: Warm, friendly, conversational. Like chatting with a knowledgeable friend who knows everything.

Response style:
- Keep answers SHORT and direct - 2-3 sentences max unless detail is needed
- Use **bold** for names, stats, or key facts
- Use bullet points for lists
- No fluff or rambling - get straight to the answer

Strategy & Tactics:
- When asked about match strategies, analyze both teams' recent formations, playing styles, key players, and weaknesses
- Provide concrete tactical recommendations based on real data
- Consider head-to-head history and current form

You cover: match predictions, player stats, transfers, tactics, history, World Cup 2026, all major leagues, strategic analysis.

If asked non-soccer topics, briefly redirect back to football.`
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
