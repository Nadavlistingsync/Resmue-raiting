import { NextResponse } from 'next/server';
import { RatingService } from '@/lib/ratingService';
import { Category } from '@/lib/types';
import { googleSheets } from '@/lib/google-sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Incoming /api/rate-resume request:', body);
    const { resumeText, industry, nickname } = body;

    const missingFields = [];
    if (!resumeText) missingFields.push('resumeText');
    if (!industry) missingFields.push('industry');
    // nickname is optional

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Use a generated userId or fallback to nickname/anonymous
    const userId = nickname || 'anonymous';
    const ratingService = RatingService.getInstance();
    const rating = ratingService.rateResume(resumeText, userId);

    // Optionally, log the rating result for feedback loop
    console.log('Rating result:', rating);

    // Append to Google Sheets
    try {
      await googleSheets.appendRating({
        nickname: nickname || 'anonymous',
        industry: industry || '',
        total_score: rating.overallScore,
        presentation_scores: Object.fromEntries(
          Object.entries(rating.categories).map(([cat, val]) => [cat, val.score])
        ),
        substance_scores: Object.fromEntries(
          Object.entries(rating.categories).map(([cat, val]) => [cat, val.score])
        ),
        feedback: {}, // No feedback yet
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to append to Google Sheets:', err);
      // Do not throw, just log
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error('Error rating resume:', error);
    return NextResponse.json(
      { error: 'Failed to rate resume', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as Category;
    const userId = searchParams.get('userId');

    const ratingService = RatingService.getInstance();

    if (category) {
      const leaderboard = ratingService.getLeaderboard(category);
      return NextResponse.json(leaderboard);
    }

    if (userId) {
      const history = ratingService.getUserHistory(userId);
      return NextResponse.json(history);
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching leaderboard/history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 