import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const LANGUAGES = ['en', 'fr', 'es', 'ht'];

async function translateToLanguage(
  openrouterApiKey: string,
  title: string,
  subtitle: string | null,
  summary: string | null,
  content: string,
  keywords: string[],
  fromLanguage: string,
  toLanguage: string
): Promise<{
  title: string;
  subtitle: string | null;
  summary: string | null;
  content: string;
  keywords: string[];
}> {
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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openrouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://menlifoot.ca',
      'X-Title': 'Menlifoot Translation'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        { role: 'system', content: 'You are a professional translator specializing in sports journalism. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter error for ${toLanguage}:`, errorText);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const translatedText = data.choices[0].message.content;
  
  // Parse the JSON response
  let cleanedText = translatedText.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.slice(7);
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.slice(3);
  }
  if (cleanedText.endsWith('```')) {
    cleanedText = cleanedText.slice(0, -3);
  }
  
  const translated = JSON.parse(cleanedText.trim());
  
  return {
    title: translated.title || title,
    subtitle: translated.subtitle || subtitle,
    summary: translated.summary || summary,
    content: translated.content || content,
    keywords: translated.keywords || keywords
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      articleId, 
      title, 
      subtitle, 
      summary, 
      content, 
      keywords, 
      originalLanguage 
    } = await req.json();

    if (!articleId) {
      throw new Error('articleId is required');
    }

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get target languages (all except original)
    const targetLanguages = LANGUAGES.filter(lang => lang !== originalLanguage);
    
    console.log(`Starting translation of article ${articleId} from ${originalLanguage} to:`, targetLanguages);

    const results: Record<string, any> = {};
    const errors: string[] = [];

    // Translate to each target language sequentially to avoid rate limits
    for (const targetLang of targetLanguages) {
      try {
        console.log(`Translating to ${targetLang}...`);
        
        const translated = await translateToLanguage(
          openrouterApiKey,
          title,
          subtitle,
          summary,
          content,
          keywords || [],
          originalLanguage,
          targetLang
        );

        // Save to database
        const { error: upsertError } = await supabase
          .from('article_translations')
          .upsert({
            article_id: articleId,
            language: targetLang,
            title: translated.title,
            subtitle: translated.subtitle,
            summary: translated.summary,
            content: translated.content,
            keywords: translated.keywords
          }, {
            onConflict: 'article_id,language'
          });

        if (upsertError) {
          console.error(`Error saving ${targetLang} translation:`, upsertError);
          errors.push(`Failed to save ${targetLang} translation`);
        } else {
          console.log(`Successfully translated and saved ${targetLang}`);
          results[targetLang] = 'success';
        }

        // Small delay between translations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        errors.push(`Failed to translate to ${targetLang}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results[targetLang] = 'failed';
      }
    }

    return new Response(JSON.stringify({ 
      success: errors.length === 0,
      results,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Batch translation error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
