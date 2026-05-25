export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, query, condition, limit = 20 } = req.body;
  if (!token || !query) return res.status(400).json({ error: 'Missing params' });

  // Build filter string
  const filters = ['buyingOptions:{FIXED_PRICE}'];
  if (condition === 'raw')   filters.push('conditions:{UNGRADED}');
  if (condition === 'psa9')  filters.push('conditions:{GRADED}');
  if (condition === 'psa10') filters.push('conditions:{GRADED}');

  const params = new URLSearchParams({
    q: query + (condition === 'psa9' ? ' PSA 9' : condition === 'psa10' ? ' PSA 10' : condition === 'bgs95' ? ' BGS 9.5' : ''),
    category_ids: '212',  // Sports Trading Cards
    filter: filters.join(','),
    sort: 'endTimeSoonest',
    limit: limit.toString(),
  });

  const response = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      }
    }
  );

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);
  return res.status(200).json(data);
}
