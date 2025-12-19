import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languageNames: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ht: 'Haitian Creole'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, subtitle, summary, content, keywords, fromLanguage, toLanguage } = await req.json();

    // If same language, return original content
    if (fromLanguage === toLanguage) {
      return new Response(JSON.stringify({ 
        title, 
        subtitle, 
        summary, 
        content,
        keywords 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fromLangName = languageNames[fromLanguage] || fromLanguage;
    const toLangName = languageNames[toLanguage] || toLanguage;

    const prompt = `You are a professional translator. Translate the following article content from ${fromLangName} to ${toLangName}. 
Maintain the original meaning, tone, and style. For sports/football terminology, use the appropriate terms in the target language.

IMPORTANT: Return ONLY a valid JSON object with these exact keys (no markdown, no code blocks, just raw JSON):
{
  "title": "translated title",
  "subtitle": "translated subtitle or null",
  "summary": "translated summary or null", 
  "content": "translated content",
  "keywords": ["translated", "keywords", "array"]
}

Article to translate:
Title: ${title}
${subtitle ? `Subtitle: ${subtitle}` : ''}
${summary ? `Summary: ${summary}` : ''}
Content: ${content}
${keywords && keywords.length > 0 ? `Keywords: ${keywords.join(', ')}` : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional translator specializing in sports journalism. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    // Parse the JSON response
    let translated;
    try {
      // Clean up potential markdown code blocks
      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      translated = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error('Failed to parse translation response:', translatedText);
      // Return original if parsing fails
      translated = { title, subtitle, summary, content, keywords };
    }

    return new Response(JSON.stringify(translated), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
