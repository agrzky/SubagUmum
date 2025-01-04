import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'
import { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        id,
        DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as created_at,
        nama as reporter_name,
        keterangan as description,
        lokasi as location,
        lokasiSpesifik as specific_location,
        status,
        gambar as image
      FROM reports 
      WHERE token = ?
      LIMIT 1
    `, [token])

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Laporan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report status' },
      { status: 500 }
    )
  }
} 