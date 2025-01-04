import { NextResponse } from 'next/server';
import pool from '@/src/utils/db';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: userData
    });

    response.cookies.set({
      name: 'user',
      value: JSON.stringify(userData),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
} 