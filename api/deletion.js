import { createHash } from 'crypto';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code;
    const verificationToken = 'SheensTracker2026SheensTracker2026';
    const endpoint = 'https://sheens-single-tracker.vercel.app/api/deletion';

    const hash = createHash('sha256');
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpoint);
    const responseHash = hash.digest('hex');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ challengeResponse: responseHash });
  }
  if (req.method === 'POST') {
    return res.status(200).end();
  }
  res.status(405).end();
}
