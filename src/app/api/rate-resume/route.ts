import { NextResponse } from 'next/server';
import { RatingService } from '@/lib/ratingService';
import { Category } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { resumeText, userId } = await request.json();

    if (!resumeText || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ratingService = RatingService.getInstance();
    const rating = ratingService.rateResume(resumeText, userId);

    return NextResponse.json(rating);
  } catch (error) {
    console.error('Error rating resume:', error);
    return NextResponse.json(
      { error: 'Failed to rate resume' },
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