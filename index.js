const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  const target = 'https://ari.titi2.sbs' + req.url;

  console.log(`Forwarding: ${req.method} ${req.url}`);

  https.get(target, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.error(err);
    res.writeHead(502);
    res.end('Proxy Error');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
