// RAG Doctor — Vercel serverless proxy
// Keeps the Anthropic API key server-side, never exposed to the browser.

const DAILY_LIMIT = 150; // max calls per day across all users
const callLog = {}; // in-memory, resets on cold start (fine for free tier)

function getToday() {
  return new Date().toISOString().slice(0, 10); // "2026-05-06"
}

export default async function handler(req, res) {
  // CORS — allow your GitHub Pages domain and localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Daily rate limit
  const today = getToday();
  callLog[today] = (callLog[today] || 0) + 1;
  if (callLog[today] > DAILY_LIMIT) {
    return res.status(429).json({
      error: `Daily demo limit reached (${DAILY_LIMIT} calls). Try again tomorrow or use your own API key.`
    });
  }

  // Check key exists
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const body = req.body;

    // Validate required fields
    if (!body?.messages || !body?.model) {
      return res.status(400).json({ error: 'Missing required fields: model, messages' });
    }

    // Forward to Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    // Pass usage stats through so frontend can show cost
    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
