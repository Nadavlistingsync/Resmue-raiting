import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateRewritePrompt } from '@/utils/generateRewritePrompt';
// import { supabase } from '@/lib/supabase';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resumeText, industry, scoringResults } = await request.json();

    if (!resumeText || !industry || !scoringResults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = generateRewritePrompt({
      resumeText,
      industry,
      scoringResults,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
    });

    const rewrittenResume = completion.choices[0].message.content;

    return NextResponse.json({ rewrittenResume });
  } catch (error) {
    console.error('Error in rewrite-resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 