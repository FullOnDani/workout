import { kv } from '@vercel/kv';

const VALID_PEOPLE = ['daniel', 'ire'];

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { person } = req.query;
    if (!VALID_PEOPLE.includes(person)) {
      return res.status(400).json({ error: 'Invalid person' });
    }
    try {
      const dates = await kv.smembers(`checkins:${person}`);
      if (!dates || dates.length === 0) {
        return res.status(200).json({});
      }
      const keys = dates.map((d) => `checkin:${person}:${d}`);
      const values = await kv.mget(...keys);
      const result = {};
      dates.forEach((d, i) => {
        if (values[i]) result[d] = values[i];
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load check-ins' });
    }
  }

  if (method === 'POST') {
    const { person, date, entry } = req.body || {};
    if (!VALID_PEOPLE.includes(person) || !date || !entry) {
      return res.status(400).json({ error: 'Missing person, date, or entry' });
    }
    try {
      await kv.set(`checkin:${person}:${date}`, entry);
      await kv.sadd(`checkins:${person}`, date);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save check-in' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${method} not allowed` });
}
