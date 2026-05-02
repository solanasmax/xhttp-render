const http = require('http');
const https = require('https');

const TARGET = 'https://ari.titi2.sbs';

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const url = new URL(req.url, TARGET);
  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: 'ari.titi2.sbs',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const proxyReq = https.request(url, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error(e);
    res.writeHead(502);
    res.end('Proxy Error');
  });

  req.pipe(proxyReq);
});

server.listen(process.env.PORT || 3000, () => {
  console.log('XHTTP Proxy running');
});
