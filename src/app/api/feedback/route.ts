import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from "@sentry/nextjs";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRoleKey
);

export async function POST(request: Request) {
  try {
    const { resumeId, rating, comment } = await request.json();

    if (!resumeId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          resume_id: resumeId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
} 