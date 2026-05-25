export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { appId, certId } = req.body;
  if (!appId || !certId) return res.status(400).json({ error: 'Missing credentials' });

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fbuy.item.summary%20https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fsell.fulfillment.readonly'
  });

  const data = await response.json();
  if (!response.ok) return res.status(401).json({ error: data.error_description || 'Auth failed' });
  return res.status(200).json(data);
}
