import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { BASE_URL } from './src/app/tokens/base-url.token';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  // Proxy to Google Books API — keeps the API key server-side only
  server.get('/api/books', async (req, res) => {
    const apiKey = process.env['GOOGLE_BOOKS_API_KEY'] ?? '';
    const { q, maxResults, orderBy, printType } = req.query;

    const params = new URLSearchParams();
    if (q) params.set('q', String(q));
    if (maxResults) params.set('maxResults', String(maxResults));
    if (orderBy) params.set('orderBy', String(orderBy));
    if (printType) params.set('printType', String(printType));
    if (apiKey) params.set('key', apiKey);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?${params}`,
      );
      const data = await response.json();
      res.status(response.status).json(data);
    } catch {
      res.status(500).json({ error: 'Failed to fetch from Google Books API' });
    }
  });

  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const serverUrl = `${protocol}://${headers.host}`;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: BASE_URL, useValue: serverUrl },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
