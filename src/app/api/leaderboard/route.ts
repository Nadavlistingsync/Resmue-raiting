import { NextResponse } from 'next/server';
import { googleSheets } from '@/lib/google-sheets';

export async function GET() {
  try {
    const leaderboard = await googleSheets.getLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error in leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 