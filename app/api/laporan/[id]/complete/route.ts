import { NextResponse } from 'next/server'
import pool from '@/src/utils/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(
      'UPDATE reports SET status = ? WHERE id = ?',
      ['resolved', params.id]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to complete report' },
      { status: 500 }
    )
  }
} 