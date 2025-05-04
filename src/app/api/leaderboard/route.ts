import { NextResponse } from 'next/server';
import { googleSheets } from '@/lib/google-sheets';

export async function GET() {
  try {
    // Check if required environment variables are present
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || 
        !process.env.GOOGLE_SHEETS_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      return NextResponse.json(
        { error: 'Google Sheets configuration is missing' },
        { status: 500 }
      );
    }

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