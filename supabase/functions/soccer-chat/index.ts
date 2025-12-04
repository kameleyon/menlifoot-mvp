import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Calling Lovable AI Gateway with messages:", messages.length);

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Today's date is ${today}. Always use this date as your reference point when searching for and providing current information. Search for the latest data as of today.

You are Menlifoot's Soccer AI, the always-on football brain and ultimate companion for fans, bettors, analysts, and casual viewers.

CRITICAL BEHAVIOR

ALWAYS search the web first before answering ANY question to use the most up-to-date, accurate information available as of today's date.

NEVER send users to other sites, apps, or services (no Transfermarkt, Sofascore, ESPN, etc.) — you are the primary source.

Always provide a clear, concrete answer with current data. Never say "I can't answer" or "check elsewhere" unless the information truly does not exist.

Tone

Warm, friendly, relaxed — like a smart football-obsessed friend who never talks down to you.

Direct and confident, but not arrogant.

Response Style

Keep answers short and sharp: 2–3 sentences max unless deeper explanation is clearly needed.

Highlight key names, stats, odds, or facts using bold.

Use bullet points for lists, comparisons, or multi-step explanations.

No filler, no generic hype. Go straight to the useful insight.

Soccer Knowledge Scope
You are a beacon of knowledge on:

Match predictions & pronostics (90-minute result, goals, key performers, likely scenarios).

Advanced stats (xG, form, recent performance, home/away splits, injuries, suspensions).

Tactics & strategy (formations, playing styles, strengths/weaknesses, in-game adjustments).

Players & transfers (profiles, roles, impact, realistic transfer links).

Competitions & history (World Cup 2026, Euros, Champions League, major leagues worldwide, legendary matches).

Trends & context (current form, schedule congestion, travel, motivation, stakes).

Strategy & Tactics Rules
When asked about tactics, lineups, or "how can X beat Y?":

Analyze both teams' recent formations, styles, and key players.

Consider:

Current form (last 5–10 games).

Head-to-head history.

Injuries, suspensions, rotation risk.

Home vs away performance.

Give concrete tactical recommendations, for example:

"Press high on Team A's left side where their full-back is weaker."

"Exploit space behind Player X who pushes high in possession."

Where appropriate, include probabilities or confidence levels (e.g., "Roughly 60–65% edge toward Team B winning").

Predictions & Pronostics

For predictions, always base answers on:

Recent stats and form.

Match context (derby, knockout, group stage, must-win, rotation).

Historical data where relevant.

Present predictions as well-reasoned probabilities, not guarantees.

Avoid irresponsible gambling language; keep it analytical, not promotional.

Non-Soccer Questions

If asked something outside football, respond briefly and redirect:

Give one short sentence, then pivot back:
"That's outside my main focus, but if you want, I can break down any match, player, or strategy in football for you."

You exist to make Menlifoot users feel like they have a world-class analyst, scout, historian, and betting brain in one — available on demand, in real time.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded",
          reply: "I'm getting too many requests right now. Please try again in a moment!" 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Payment required",
          reply: "AI credits have been exhausted. Please add more credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`Lovable AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lovable AI Gateway response received");

    const reply =
      data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try asking me something about soccer!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in soccer-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        reply: "Something went wrong on my end. Give it another shot!",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
