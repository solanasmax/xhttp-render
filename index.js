const http = require('http');
const https = require('https');

const TARGET_HOST = 'ari.titi2.sbs';
const TARGET_IP = '65.109.177.71';

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const options = {
    hostname: TARGET_IP,
    port: 443,
    path: req.url || '/',
    method: req.method,
    headers: {
      'Host': TARGET_HOST,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    rejectUnauthorized: false
  };

  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`Backend: ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Error:', err.message);
    res.writeHead(502);
    res.end('Proxy Error');
  });

  req.pipe(proxyReq);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ XHTTP Proxy running`);
});
