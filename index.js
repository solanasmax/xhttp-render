const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  const targetUrl = 'https://ari.titi2.sbs' + req.url;

  console.log(`[${new Date().toISOString()}] Forward: ${req.method} ${req.url}`);

  https.get(targetUrl, (proxyRes) => {
    console.log(`Backend Status: ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error('Error:', err.message);
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`XHTTP Proxy running on port ${PORT}`);
});
