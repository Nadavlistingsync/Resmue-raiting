import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateRewritePrompt } from '@/utils/generateRewritePrompt';

// Initialize OpenAI client with optional API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

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