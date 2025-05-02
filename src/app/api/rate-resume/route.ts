import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateScoringPrompt } from '@/utils/generateScoringPrompt';
import { supabase } from '@/lib/supabase';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resumeText, industry, nickname } = await request.json();

    if (!resumeText || !industry || !nickname) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = generateScoringPrompt({ resumeText, industry });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to Supabase
    const { error } = await supabase
      .from('resume_ratings')
      .insert({
        nickname,
        industry,
        total_score: result.totalScore,
        presentation_scores: result.presentation,
        substance_scores: result.substance,
        feedback: result.feedback,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in rate-resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 