import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/src/utils/db';
import { RowDataPacket } from 'mysql2';

interface TokenRow extends RowDataPacket {
  token: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query<TokenRow[]>('SELECT token FROM reports ORDER BY id DESC LIMIT 1');
      const lastToken = rows[0]?.token || '0000';
      
      const nextToken = (parseInt(lastToken, 10) + 1).toString().padStart(4, '0');
      
      res.status(200).json({ token: nextToken });
    } catch (error: unknown) {
      console.error('Failed to get token:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to get token' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 