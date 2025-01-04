import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/src/utils/db';
import type { VehicleRental } from '@/types/index';
import { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const rental: Partial<VehicleRental> = {
        nama: req.body.nama,
        handphone: req.body.handphone,
        vehicleType: req.body.vehicleType,
        driver: req.body.driver,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime,
        purpose: req.body.purpose,
        status: 'pending',
      };

      if (!rental.nama || !rental.vehicleType || !rental.startDate || !rental.endDate) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
      }

      const [result] = await pool.query<ResultSetHeader>('INSERT INTO vehicle_rentals SET ?', rental);
      
      res.status(201).json({ 
        success: true,
        message: 'Peminjaman kendaraan berhasil dibuat',
        data: { id: result.insertId, ...rental } 
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error creating rental' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 