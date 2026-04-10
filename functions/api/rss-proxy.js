/**
 * Cloudflare Pages Function: RSS Proxy
 * 
 * Fetches RSS feeds from external sources and returns parsed JSON.
 * This bypasses CORS restrictions and provides a consistent API for the news page.
 * 
 * URL: /api/rss-proxy
 * Query params:
 *   - url: RSS feed URL to fetch (required)
 *   - num: Number of items to return (default: 8, max: 20)
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Get query parameters
  const feedUrl = url.searchParams.get('url');
  const numItems = Math.min(parseInt(url.searchParams.get('num') || '8'), 20);
  
  // Validate feed URL
  if (!feedUrl) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Missing url parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
  };
  
  // Handle OPTIONS request (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  try {
    // Fetch the RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ExpatAce/1.0 (RSS Reader; +https://expatace.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Feed fetch failed: ${response.status} ${response.statusText}`);
    }
    
    const xml = await response.text();
    
    // Parse RSS/Atom feed
    const items = parseRSS(xml, numItems);
    
    return new Response(
      JSON.stringify({ status: 'ok', items }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('RSS Proxy Error:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Failed to fetch or parse RSS feed',
        error: error.message 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Parse RSS/Atom XML and extract items
 */
function parseRSS(xml, limit = 8) {
  const items = [];
  
  // Check if it's Atom or RSS
  const isAtom = xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"');
  
  if (isAtom) {
    // Parse Atom feed
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xml)) !== null && items.length < limit) {
      const entry = match[1];
      
      const title = extractTag(entry, 'title');
      const link = extractAtomLink(entry);
      const summary = extractTag(entry, 'summary') || extractTag(entry, 'content');
      const published = extractTag(entry, 'published') || extractTag(entry, 'updated');
      const thumbnail = extractMediaThumbnail(entry) || extractAtomImage(entry);
      
      if (title && link) {
        items.push({
          title: decodeHtml(stripTags(title)),
          link,
          description: decodeHtml(stripTags(summary)),
          pubDate: published,
          thumbnail
        });
      }
    }
  } else {
    // Parse RSS 2.0 feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const item = match[1];
      
      const title = extractTag(item, 'title');
      const link = extractTag(item, 'link');
      const description = extractTag(item, 'description');
      const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date');
      const thumbnail = extractMediaThumbnail(item) || extractEnclosureImage(item);
      
      if (title && link) {
        items.push({
          title: decodeHtml(stripTags(title)),
          link,
          description: decodeHtml(stripTags(description)),
          pubDate,
          thumbnail
        });
      }
    }
  }
  
  return items;
}

/**
 * Extract content between XML tags
 */
function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = regex.exec(xml);
  return match ? match[1].trim() : '';
}

/**
 * Extract Atom link href
 */
function extractAtomLink(xml) {
  const match = /<link[^>]+href=["']([^"']+)["']/i.exec(xml);
  return match ? match[1] : '';
}

/**
 * Extract Atom image
 */
function extractAtomImage(xml) {
  // Try icon or logo
  const icon = extractTag(xml, 'icon');
  if (icon) return icon;
  
  const logo = extractTag(xml, 'logo');
  if (logo) return logo;
  
  // Try to find image in content
  const content = extractTag(xml, 'content');
  return extractImageFromHtml(content);
}

/**
 * Extract media:thumbnail or media:content
 */
function extractMediaThumbnail(xml) {
  // media:thumbnail url
  let match = /<media:thumbnail[^>]+url=["']([^"']+)["']/i.exec(xml);
  if (match) return match[1];
  
  // media:content url (image type)
  match = /<media:content[^>]+type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']/i.exec(xml);
  if (match) return match[1];
  
  match = /<media:content[^>]+url=["']([^"']+)["'][^>]+type=["']image\/[^"']*["']/i.exec(xml);
  if (match) return match[1];
  
  return null;
}

/**
 * Extract image from enclosure tag
 */
function extractEnclosureImage(xml) {
  const match = /<enclosure[^>]+type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']/i.exec(xml);
  if (match) return match[1];
  
  const match2 = /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\/[^"']*["']/i.exec(xml);
  if (match2) return match2[1];
  
  return null;
}

/**
 * Extract first image from HTML content
 */
function extractImageFromHtml(html) {
  if (!html) return null;
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  return match ? match[1] : null;
}

/**
 * Strip HTML tags
 */
function stripTags(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Decode HTML entities
 */
function decodeHtml(str) {
  if (!str) return '';
  
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' '
  };
  
  return str.replace(/&[^;]+;/g, match => entities[match] || match);
}
