import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/src/utils/db';
import type { Report } from '@/types/index';
import formidable from 'formidable';
import path from 'path';
import { ResultSetHeader } from 'mysql2';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    try {
      const [fields, files] = await form.parse(req);
      
      const report: Partial<Report> = {
        token: fields.token?.[0],
        nama: fields.nama?.[0],
        status: 'pending',
        tanggal: fields.tanggal?.[0],
        lokasi: fields.lokasi?.[0],
        lokasiSpesifik: fields.lokasiSpesifik?.[0],
        keterangan: fields.keterangan?.[0],
        gambar: files.file?.[0]?.newFilename || null,
      };

      // Validasi data
      if (!report.nama || !report.status || !report.tanggal || !report.lokasi) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
      }

      const [result] = await pool.query<ResultSetHeader>('INSERT INTO reports SET ?', report);
      
      res.status(201).json({ 
        success: true,
        message: 'Laporan berhasil dibuat',
        data: { id: result.insertId, ...report } 
      });
    } catch (error: unknown) {
      console.error('Error creating report:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error creating report' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 