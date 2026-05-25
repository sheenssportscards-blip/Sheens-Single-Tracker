export default function handler(req, res) {
  if (req.method === 'GET') {
    const challenge = req.query.challenge_code;
    return res.json({ challengeResponse: challenge });
  }
  if (req.method === 'POST') {
    console.log('Account deletion notification:', req.body);
    return res.status(200).end();
  }
  res.status(405).end();
}
