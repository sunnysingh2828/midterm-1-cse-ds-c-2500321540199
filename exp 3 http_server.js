const http = require('http');

const Port = 3001;

const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end('Hello, World!');
});

server.listen(Port, () => {
    console.log(`Server running at http://localhost:${Port}/`);
});