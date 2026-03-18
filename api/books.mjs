export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY ?? "";
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
}
