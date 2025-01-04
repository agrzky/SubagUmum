import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(
      'UPDATE vehicle_rentals SET status = ? WHERE id = ?',
      ['rejected', params.id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to reject vehicle rental' },
      { status: 500 }
    )
  }
} 