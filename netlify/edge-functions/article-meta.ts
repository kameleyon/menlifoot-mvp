import type { Config, Context } from "@netlify/edge-functions";

const BOT_UA_SUBSTRINGS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "whatsapp",
  "telegrambot",
  "discordbot",
  "pinterest",
  "embedly",
  "googlebot",
  "bingbot",
];

function isCrawler(userAgent: string | null): boolean {
  const ua = (userAgent || "").toLowerCase();
  return BOT_UA_SUBSTRINGS.some((s) => ua.includes(s));
}

function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return ch;
    }
  });
}

function absolutize(maybeUrl: string, origin: string): string {
  try {
    return new URL(maybeUrl, origin).toString();
  } catch {
    return maybeUrl;
  }
}

type ArticleMeta = {
  title: string;
  description: string;
  image: string | null;
};

async function fetchArticleMeta(articleId: string): Promise<ArticleMeta> {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://tjotexujwnfltszqqovk.supabase.co";
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars");
  }

  const endpoint = new URL(`${SUPABASE_URL}/rest/v1/articles`);
  endpoint.searchParams.set("id", `eq.${articleId}`);
  endpoint.searchParams.set("is_published", "eq.true");
  endpoint.searchParams.set("select", "title,summary,content,thumbnail_url,author,published_at");
  endpoint.searchParams.set("limit", "1");

  const res = await fetch(endpoint.toString(), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase REST error: ${res.status} ${await res.text()}`);
  }

  const rows = (await res.json()) as any[];
  const row = rows?.[0] ?? {};

  const title = row.title ?? "Menlifoot";
  const description = row.summary ?? 
    (row.content ? row.content.substring(0, 160).replace(/\s+/g, ' ').trim() + "..." : "Latest soccer insights on Menlifoot.");
  const image = row.thumbnail_url ?? null;

  return { title, description, image };
}

function buildOgHtml(opts: {
  canonical: string;
  title: string;
  description: string;
  image: string;
  author?: string;
  publishedTime?: string;
}): string {
  const canonical = escapeHtml(opts.canonical);
  const title = escapeHtml(opts.title);
  const description = escapeHtml(opts.description);
  const image = escapeHtml(opts.image);
  const author = escapeHtml(opts.author || "Menlifoot Team");
  const publishedTime = opts.publishedTime || new Date().toISOString();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="canonical" href="${canonical}" />

<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="author" content="${author}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="Menlifoot" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:secure_url" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${title}" />
<meta property="article:published_time" content="${publishedTime}" />
<meta property="article:author" content="${author}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />

<meta http-equiv="refresh" content="0;url=${canonical}" />
</head>
<body>
<p>Redirecting to <a href="${canonical}">${title}</a>...</p>
</body>
</html>`;
}

export default async function handler(req: Request, _context: Context) {
  const userAgent = req.headers.get("user-agent");
  
  // Humans: return undefined to continue normal request chain (SPA loads)
  if (!isCrawler(userAgent)) {
    return undefined;
  }

  console.log("Crawler detected:", userAgent);

  const url = new URL(req.url);
  
  // Expecting /articles/:id
  const parts = url.pathname.split("/").filter(Boolean);
  const articleId = parts.length >= 2 ? parts[1] : null;
  
  if (!articleId) {
    return undefined;
  }

  const canonical = new URL(`/articles/${articleId}`, url.origin).toString();

  // Fallbacks
  let title = "Menlifoot";
  let description = "Latest soccer insights on Menlifoot.";
  let image = new URL("/og-image.png", url.origin).toString();
  let author = "Menlifoot Team";
  let publishedTime = new Date().toISOString();

  try {
    const meta = await fetchArticleMeta(articleId);
    title = meta.title || title;
    description = meta.description || description;

    if (meta.image) {
      image = absolutize(meta.image, url.origin);
    }
  } catch (e) {
    console.error("article-meta edge error:", e);
  }

  console.log("Returning OG HTML for:", title);

  return new Response(buildOgHtml({ canonical, title, description, image, author, publishedTime }), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=600",
    },
  });
}

export const config: Config = {
  path: "/articles/*",
};
