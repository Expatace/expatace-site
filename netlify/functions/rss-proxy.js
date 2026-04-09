// Netlify serverless function to proxy RSS feeds (CORS workaround)
const fetch = require('node-fetch');
const { parseString } = require('xml2js');

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const url = event.queryStringParameters?.url;
  const num = parseInt(event.queryStringParameters?.num) || 5;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' })
    };
  }

  try {
    // Fetch the RSS feed
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ExpatAce RSS Reader/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();

    // Parse XML to JSON
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          resolve({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to parse RSS feed' })
          });
          return;
        }

        try {
          // Extract items from RSS feed
          const items = result.rss?.channel?.[0]?.item || result.feed?.entry || [];
          const limitedItems = items.slice(0, num);

          // Transform to simple format
          const articles = limitedItems.map(item => ({
            title: item.title?.[0] || item.title?._ || '',
            link: item.link?.[0]?._ || item.link?.[0] || item.id?.[0] || '',
            pubDate: item.pubDate?.[0] || item.published?.[0] || '',
            description: item.description?.[0] || item.summary?.[0] || ''
          }));

          resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(articles)
          });
        } catch (err) {
          resolve({
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to process feed data' })
          });
        }
      });
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
