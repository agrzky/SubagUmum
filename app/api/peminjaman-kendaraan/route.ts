import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'
import { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    let query = `
      SELECT 
        id, nama, handphone, vehicleType, driver,
        startDate, startTime, endDate, endTime,
        purpose, status, createdAt, updatedAt
      FROM vehicle_rentals 
    `

    if (month) {
      query += `WHERE DATE_FORMAT(startDate, '%Y-%m') = ? `
    }

    query += `ORDER BY startDate DESC, startTime DESC`

    const [rows] = await pool.query<RowDataPacket[]>(
      query,
      month ? [month] : []
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle rentals' },
      { status: 500 }
    )
  }
} 