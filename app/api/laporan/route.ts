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
        DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as report_date,
        nama as reporter_name,
        keterangan as description,
        lokasi as location,
        lokasiSpesifik as specific_location,
        status,
        gambar as image,
        token,
        createdAt,
        updatedAt
      FROM reports 
    `

    if (month) {
      query += `WHERE DATE_FORMAT(createdAt, '%Y-%m') = ? `
    }

    query += `ORDER BY createdAt DESC`

    const [rows] = await pool.query<RowDataPacket[]>(
      query,
      month ? [month] : []
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nama, keterangan, lokasi, lokasiSpesifik, gambar } = body

    const [result] = await pool.query(
      'INSERT INTO reports (nama, keterangan, lokasi, lokasiSpesifik, gambar) VALUES (?, ?, ?, ?, ?)',
      [nama, keterangan, lokasi, lokasiSpesifik, gambar]
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
} 