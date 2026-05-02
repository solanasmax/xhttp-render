const http = require('http');
const https = require('https');

const TARGET_HOST = 'ari.titi2.sbs';
const TARGET_IP = '65.109.177.71';   // IP سرور تو

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const options = {
    hostname: TARGET_IP,              // استفاده از IP مستقیم
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      'Host': TARGET_HOST,            // هدر Host را نگه می‌داریم
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Connection': 'keep-alive'
    },
    rejectUnauthorized: false,        // دور زدن چک گواهی
    servername: TARGET_HOST
  };

  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`Backend Status: ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy Error:', err.message);
    res.writeHead(502);
    res.end('Relay Error');
  });

  req.pipe(proxyReq);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`XHTTP Relay running on port ${PORT}`);
});
