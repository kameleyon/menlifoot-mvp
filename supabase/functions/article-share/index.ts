// Article Share Edge Function for rich link previews on social media
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://menlifoot.ca";
const SITE_NAME = "Menlifoot";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const TWITTER_HANDLE = "@Menlifoot";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateDescription(text: string, maxLength = 160): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength - 3).trim() + "...";
}

Deno.serve(async (req) => {
  console.log("Article share function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("id");
    console.log("Requested article ID:", articleId);

    if (!articleId) {
      console.log("Missing article ID");
      return new Response("Missing article ID", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article, error } = await supabase
      .from("articles")
      .select("title, summary, content, thumbnail_url, author, published_at, category")
      .eq("id", articleId)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
    }

    if (error || !article) {
      console.log("Article not found, redirecting to homepage");
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: SITE_URL,
        },
      });
    }

    const description = truncateDescription(article.summary || article.content);
    const imageUrl = article.thumbnail_url || DEFAULT_OG_IMAGE;
    const articleUrl = `${SITE_URL}/articles/${articleId}`;

    console.log(`Generating OG preview for article: ${article.title}`);
    console.log(`Image URL: ${imageUrl}`);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(article.title)} | ${SITE_NAME}</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${escapeHtml(article.title)}">
    <meta name="description" content="${escapeHtml(description)}">
    ${article.author ? `<meta name="author" content="${escapeHtml(article.author)}">` : ""}
    
    <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:title" content="${escapeHtml(article.title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:locale" content="en_US">
    ${article.published_at ? `<meta property="article:published_time" content="${article.published_at}">` : ""}
    ${article.author ? `<meta property="article:author" content="${escapeHtml(article.author)}">` : ""}
    ${article.category ? `<meta property="article:section" content="${escapeHtml(article.category)}">` : ""}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${articleUrl}">
    <meta name="twitter:title" content="${escapeHtml(article.title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="${TWITTER_HANDLE}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${articleUrl}">
    
    <!-- Redirect to actual article after meta tags are read -->
    <meta http-equiv="refresh" content="0;url=${articleUrl}">
    <script>window.location.href = "${articleUrl}";</script>
    
    <style>
      body { font-family: system-ui, sans-serif; padding: 20px; text-align: center; }
      a { color: #0066cc; }
    </style>
</head>
<body>
    <p>Redirecting to <a href="${articleUrl}">${escapeHtml(article.title)}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=7200",
      },
    });
  } catch (error) {
    console.error("Error generating article share page:", error);
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: SITE_URL,
      },
    });
  }
});
