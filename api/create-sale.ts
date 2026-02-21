import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    const apiKey = process.env.BLACKCAT_API_KEY || "sk_live_f47fba8c5b13d3ec07a2051dc78fa80b403c3f5c1e56d5264e6342051b0c9c0a";

    console.log("Receiving payload:", JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.blackcatpagamentos.online/api/sales/create-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Blackcat API Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
