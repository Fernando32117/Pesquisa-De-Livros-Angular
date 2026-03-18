import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(.+)$/);
    if (!match) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const PORT = 3000;
const app = express();

app.get("/api/books", async (req, res) => {
  const apiKey = process.env["GOOGLE_BOOKS_API_KEY"] ?? "";
  const { q, maxResults, orderBy, printType } = req.query;

  const params = new URLSearchParams();
  if (q) params.set("q", String(q));
  if (maxResults) params.set("maxResults", String(maxResults));
  if (orderBy) params.set("orderBy", String(orderBy));
  if (printType) params.set("printType", String(printType));
  if (apiKey) params.set("key", apiKey);

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params}`,
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch from Google Books API" });
  }
});

app.listen(PORT, () => {
  console.log(`[api-dev-server] Rodando em http://localhost:${PORT}`);
});
