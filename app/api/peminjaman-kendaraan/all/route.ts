import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'
import { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        id, nama, handphone, vehicleType, driver,
        startDate, startTime, endDate, endTime,
        purpose, status, createdAt, updatedAt
      FROM vehicle_rentals 
      ORDER BY startDate DESC, startTime DESC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch all vehicle rentals' },
      { status: 500 }
    )
  }
} 