const http = require('http');
const { readFile } = require('fs');

const months = require('./months.json');

const staticContentTypes = {
 html: 'text/html',
 css: 'text/css',
 js: 'application/javascript',
 png: 'image/png',
 jpg: 'image/jpeg',
 gif: 'image/gif',
 svg: 'image/svg+xml',
 ico: 'image/x-icon',
 json: 'application/json',
 txt: 'text/plain',
 xml: 'application/xml',
 pdf: 'application/pdf',
 zip: 'application/zip',
 mp3: 'audio/mpeg',
 mp4: 'video/mp4',
 wav: 'audio/wav',
 woff: 'application/font-woff',
 woff2: 'application/font-woff2',
 ttf: 'application/font-ttf',
 jpeg: 'image/jpeg',
};

const staticExtensions = new Set(Object.keys(staticContentTypes));
const serverFiles = new Set(['/index.js', '/controller.js']);

http
 .createServer((req, res) => {
  if (req.url === '/') {
   readFile('./index.html', (err, data) => {
    if (err) {
     res.writeHead(500);
     res.end(err.message);
    } else {
     res.writeHead(200, { 'Content-Type': 'text/html' });
     res.end(data);
    }
   });
  } else if (serverFiles.has(req.url)) {
   res.writeHead(400);
   res.end('NO');
  } else {
   const filename = req.url.match(/\/(.*)$/);
   const extension = filename && filename[1].match(/\.([^.]+)$/);
   if (
    extension
    && staticExtensions.has(extension[1])
    && filename
    && filename[1].match(/^[^./]+\.[^./]+$/)
   ) {
    readFile(`./${filename[1]}`, (err, data) => {
     if (err) {
      if (err.code === 'ENOENT') {
       res.writeHead(404);
      } else {
       res.writeHead(500);
      }

      res.end(err.message);
      return;
     }

     const headers = {
      'Content-Type': staticContentTypes[extension[1]],
     };

     res.writeHead(200, headers);
     res.end(data);
    });
   } else if (req.url === '/time') {
    const now = new Date();
    res.writeHead(200);
    res.end(`The time is ${now.getHours()}:${now.getMinutes()}`);
   } else if (req.url === '/date') {
    const now = new Date();
    res.writeHead(200);
    res.end(`The date is ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
   } else {
    res.writeHead(404);
    res.end('404');
   }
  }
 })
 .listen(8080, () => console.log('server listening on port 8080'));
