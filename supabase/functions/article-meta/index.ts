import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Social media crawler User-Agent patterns
const CRAWLER_PATTERNS = [
  'facebookexternalhit',
  'Facebot',
  'WhatsApp',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return CRAWLER_PATTERNS.some(pattern => 
    userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("id");
    const userAgent = req.headers.get("user-agent");
    const baseUrl = "https://menlifoot.ca";

    console.log("Article meta request - ID:", articleId, "User-Agent:", userAgent);

    if (!articleId) {
      return new Response(JSON.stringify({ error: "Missing article ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If not a crawler, redirect to the SPA
    if (!isCrawler(userAgent)) {
      console.log("Not a crawler, redirecting to SPA");
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          "Location": `${baseUrl}/articles/${articleId}`,
        },
      });
    }

    console.log("Crawler detected, serving OG meta tags");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article, error } = await supabase
      .from("articles")
      .select("title, summary, content, thumbnail_url, author, published_at")
      .eq("id", articleId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!article) {
      console.log("Article not found");
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare meta content
    const title = article.title || "Menlifoot - Football News";
    const description = article.summary || 
      (article.content ? article.content.substring(0, 160).replace(/\s+/g, ' ').trim() + "..." : "Latest football news and updates");
    const imageUrl = article.thumbnail_url || `${baseUrl}/og-image.png`;
    const articleUrl = `${baseUrl}/articles/${articleId}`;
    const siteName = "Menlifoot";
    const author = article.author || "Menlifoot Team";
    const publishedTime = article.published_at || new Date().toISOString();

    // Return HTML with OG meta tags for crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(title)}</title>
  <meta name="title" content="${escapeHtml(title)}">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(author)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${siteName}">
  <meta property="article:published_time" content="${publishedTime}">
  <meta property="article:author" content="${escapeHtml(author)}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- WhatsApp specific -->
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  
  <!-- Redirect for browsers that somehow end up here -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
  <link rel="canonical" href="${articleUrl}">
</head>
<body>
  <p>Redirecting to <a href="${articleUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

    console.log("Returning HTML with OG tags for article:", title);

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error in article-meta function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
