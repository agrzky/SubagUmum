import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/src/utils/db'; // Pastikan jalur ini benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM reports');
      res.status(200).json(rows);
    } catch {
      res.status(500).json({ error: 'Error fetching reports' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 