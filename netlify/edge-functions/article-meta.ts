import { Context } from "https://edge.netlify.com";

// User agents that indicate social media crawlers
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'WhatsApp',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'TelegramBot',
  'DiscordBot',
  'Googlebot',
  'bingbot',
  'Pinterestbot',
  'Redditbot',
];

// Check if request is from a social media crawler
function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(crawler => ua.includes(crawler.toLowerCase()));
}

// Extract article ID from URL
function getArticleId(url: string): string | null {
  const match = url.match(/\/articles\/([a-f0-9-]+)/i);
  return match ? match[1] : null;
}

// Fetch article data from Supabase
async function fetchArticle(articleId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    return null;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/articles?id=eq.${articleId}&is_published=eq.true&select=*`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch article:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate HTML with meta tags
function generateHtmlWithMeta(article: any, url: string): string {
  const title = article.title || "Menlifoot Article";
  const description = article.summary || article.content?.substring(0, 160) || "Read this article on Menlifoot";
  const image = article.thumbnail_url || "https://menlifoot.ca/og-image.png";
  const author = article.author || "Menlifoot";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Menlifoot</title>
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#000000" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400&display=swap" />

    <!-- SEO Meta Tags -->
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${escapeHtml(author)}" />
    <meta name="keywords" content="${escapeHtml((article.keywords || []).join(', '))}" />

    <!-- Open Graph (Facebook, WhatsApp, LinkedIn, etc.) -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Menlifoot" />
    ${article.published_at ? `<meta property="article:published_time" content="${article.published_at}" />` : ''}
    ${article.category ? `<meta property="article:section" content="${escapeHtml(article.category)}" />` : ''}
    ${author ? `<meta property="article:author" content="${escapeHtml(author)}" />` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Menlifoot" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />

    <link rel="canonical" href="${escapeHtml(url)}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent");

  // Only handle article pages
  const articleId = getArticleId(url.pathname);
  if (!articleId) {
    return; // Pass through to normal handling
  }

  // Only intercept for crawlers
  if (!isCrawler(userAgent)) {
    return; // Let regular users get the SPA
  }

  console.log(`Crawler detected: ${userAgent} for article ${articleId}`);

  // Fetch article data
  const article = await fetchArticle(articleId);

  if (!article) {
    console.log(`Article ${articleId} not found`);
    return; // Pass through to 404 handling
  }

  // Return HTML with proper meta tags
  const html = generateHtmlWithMeta(article, request.url);

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "cache-control": "public, max-age=3600", // Cache for 1 hour
    },
  });
};

export const config = { path: "/articles/*" };
