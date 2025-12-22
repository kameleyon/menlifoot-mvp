# Netlify Deployment Setup

This guide explains how to set up the Menlifoot MVP on Netlify with proper Open Graph meta tags for social media link previews.

## Environment Variables

In your Netlify dashboard (Site settings > Environment variables), add the following:

### Required Variables

```
SUPABASE_URL=https://tjotexujwnfltszqqovk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb3RleHVqd25mbHRzenFxb3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDYyNjUsImV4cCI6MjA4MDM4MjI2NX0.g4AkAsEdq3sCUaALv7usglM87kRPmtfyXTy4Q4nHhA0
```

These environment variables are used by the Netlify Edge Function to fetch article data and generate proper meta tags for social media crawlers.

## How It Works

### Edge Function for Social Media Previews

The `article-meta` Edge Function intercepts requests to `/articles/:id` from social media crawlers (Facebook, WhatsApp, Twitter, LinkedIn, etc.) and serves HTML with article-specific meta tags.

**For crawlers:**
- Detects user agents like `facebookexternalhit`, `WhatsApp`, `Twitterbot`, etc.
- Fetches article data from Supabase
- Returns HTML with proper Open Graph and Twitter Card meta tags
- Includes article title, description (from summary), and thumbnail image

**For regular users:**
- Passes through to the normal React SPA
- JavaScript dynamically updates meta tags for SEO

### Supported Crawlers

- Facebook (facebookexternalhit)
- WhatsApp
- Twitter/X (Twitterbot)
- LinkedIn (LinkedInBot)
- Slack (Slackbot)
- Telegram (TelegramBot)
- Discord (DiscordBot)
- Google (Googlebot)
- Bing (bingbot)
- Pinterest (Pinterestbot)
- Reddit (Redditbot)

## Testing

### Test with Social Media Debuggers

1. **Facebook Sharing Debugger:**
   - Visit: https://developers.facebook.com/tools/debug/
   - Enter your article URL: `https://menlifoot.ca/articles/YOUR_ARTICLE_ID`
   - Click "Debug" to see how Facebook sees your page

2. **Twitter Card Validator:**
   - Visit: https://cards-dev.twitter.com/validator
   - Enter your article URL
   - Preview how tweets will display

3. **LinkedIn Post Inspector:**
   - Visit: https://www.linkedin.com/post-inspector/
   - Enter your article URL
   - See the preview

### Test Locally with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Set environment variables
export SUPABASE_URL=https://tjotexujwnfltszqqovk.supabase.co
export SUPABASE_ANON_KEY=your_anon_key_here

# Run dev server with edge functions
netlify dev

# Test with curl (simulating Facebook crawler)
curl -H "User-Agent: facebookexternalhit/1.1" http://localhost:8888/articles/YOUR_ARTICLE_ID
```

## What Gets Shared

When someone shares an article link, the preview will show:

- **Title:** Article title
- **Description:** Article summary (or first 160 characters of content)
- **Image:** Article thumbnail (or default Menlifoot OG image)
- **Author:** Article author
- **Category:** Article category
- **Published Date:** When the article was published

## Troubleshooting

### Preview not updating

Social media platforms cache link previews. To force a refresh:

1. **Facebook:** Use the Sharing Debugger and click "Scrape Again"
2. **Twitter:** Use the Card Validator
3. **LinkedIn:** Use the Post Inspector

### Edge function not working

Check Netlify function logs:
```bash
netlify functions:list
netlify functions:log article-meta
```

### Environment variables not set

Verify in Netlify dashboard:
1. Go to Site settings
2. Environment variables
3. Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
4. Redeploy if you just added them

## Build Configuration

The `netlify.toml` file is configured to:
- Build command: `npm run build`
- Publish directory: `dist`
- Edge function: `article-meta` on path `/articles/*`
- SPA fallback for other routes

No additional configuration needed!
