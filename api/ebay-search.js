module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { token, query, condition, limit = 50 } = req.body;
  if (!token || !query) return res.status(400).json({ error: 'Missing params' });

  const condMap = { psa9: 'PSA 9', psa10: 'PSA 10', bgs95: 'BGS 9.5', raw: '' };
  const condSuffix = condMap[condition] || '';
  const fullQuery = condSuffix ? `${query} ${condSuffix}` : query;

  const params = new URLSearchParams({
    q: fullQuery,
    category_ids: '212',
    filter: 'buyingOptions:{FIXED_PRICE|AUCTION},conditions:{USED|UNGRADED|GRADED}',
    sort: 'endTimeSoonest',
    limit: limit.toString(),
    fieldgroups: 'MATCHING_ITEMS,EXTENDED'
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
};
