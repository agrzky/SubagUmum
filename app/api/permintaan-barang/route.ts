import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'
import { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    let query = `
      SELECT 
        id,
        nama,
        department,
        itemType,
        description,
        status,
        tanggal,
        createdAt,
        updatedAt
      FROM item_requests 
    `

    if (month) {
      query += `WHERE DATE_FORMAT(tanggal, '%Y-%m') = ? `
    }

    query += `ORDER BY tanggal DESC`

    const [rows] = await pool.query<RowDataPacket[]>(
      query,
      month ? [month] : []
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nama, department, itemType, description } = body

    const [result] = await pool.query(
      `INSERT INTO item_requests (
        nama, 
        department, 
        itemType, 
        description, 
        status, 
        tanggal
      ) VALUES (?, ?, ?, ?, 'pending', CURDATE())`,
      [nama, department, itemType, description]
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    )
  }
} 