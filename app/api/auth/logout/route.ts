import { NextResponse } from 'next/server';

export async function POST() {
  // Hapus cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('user');
  
  return response;
} 