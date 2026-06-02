import https from 'https';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the sub-path
  const path = req.url.replace('/api/leo', '');
  const targetUrl = `https://leo.sklconnect.com/api/leo${path}`;

  let requestBody = '';
  if (req.method === 'POST' && req.body) {
    requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const urlObj = new URL(targetUrl);
  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://leo.sklconnect.com',
      'Referer': 'https://leo.sklconnect.com/examples',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let responseBody = '';
    proxyRes.on('data', (chunk) => { responseBody += chunk; });
    proxyRes.on('end', () => {
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
      res.status(proxyRes.statusCode).send(responseBody);
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    res.status(500).json({ error: err.message });
  });

  if (req.method === 'POST' && requestBody) {
    proxyReq.write(requestBody);
  }
  proxyReq.end();
}