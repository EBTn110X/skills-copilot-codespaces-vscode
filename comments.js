// Create web server that can handle POST requests to /comments
// Request body will contain JSON string with keys 'name' and 'comment'
// Create a new comment object and add it to the comments array
// Send back a JSON object with the key 'status' and value 'success'

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/comments') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { name, comment } = JSON.parse(body);
      const newComment = { name, comment };
      fs.readFile('./comments.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end();
        } else {
          const comments = JSON.parse(data);
          comments.push(newComment);
          fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.end();
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'success' }));
            }
          });
        }
      });
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});