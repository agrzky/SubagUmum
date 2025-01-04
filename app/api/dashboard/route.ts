import { NextResponse } from 'next/server';
import pool from '@/src/utils/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [reports] = await pool.query<RowDataPacket[]>('SELECT * FROM reports');
    const [requests] = await pool.query<RowDataPacket[]>('SELECT * FROM item_requests');
    const [rentals] = await pool.query<RowDataPacket[]>('SELECT * FROM vehicle_rentals');

    return NextResponse.json({
      reports,
      requests,
      rentals
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 