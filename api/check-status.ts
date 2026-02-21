import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { transactionId } = req.query;

  if (!transactionId || Array.isArray(transactionId)) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  try {
    const apiKey = process.env.BLACKCAT_API_KEY || "sk_live_f47fba8c5b13d3ec07a2051dc78fa80b403c3f5c1e56d5264e6342051b0c9c0a";

    const response = await fetch(`https://api.blackcatpagamentos.online/api/sales/${transactionId}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Blackcat API Status Error:", data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
