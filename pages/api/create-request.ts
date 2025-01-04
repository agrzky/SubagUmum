import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/src/utils/db';
import type { ItemRequest } from '@/types/index';
import { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const request: Partial<ItemRequest> = {
        nama: req.body.nama,
        department: req.body.department,
        tanggal: req.body.tanggal,
        itemType: req.body.itemType,
        description: req.body.description,
        status: 'pending',
      };

      // Validasi data
      if (!request.nama || !request.department || !request.itemType || !request.description) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
      }

      const [result] = await pool.query<ResultSetHeader>('INSERT INTO item_requests SET ?', request);
      res.status(201).json({ 
        success: true,
        message: 'Permintaan barang berhasil dibuat',
        data: { id: result.insertId, ...request } 
      });
    } catch (error: unknown) {
      console.error('Error creating request:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error creating request' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 