export interface ScoringPromptInput {
  resumeText: string;
  industry: string;
}

export function generateScoringPrompt({ resumeText, industry }: ScoringPromptInput): string {
  return `You are an expert resume reviewer specializing in ${industry} industry. 
Please analyze the following resume and provide a detailed scoring breakdown:

Resume:
${resumeText}

Please provide a JSON response with the following structure:
{
  "totalScore": number (0-100),
  "scores": {
    "content": number (0-25),
    "formatting": number (0-25),
    "merit": number (0-25),
    "relevance": number (0-25)
  },
  "feedback": {
    "content": string[] (3-5 tips),
    "formatting": string[] (3-5 tips),
    "merit": string[] (3-5 tips),
    "relevance": string[] (3-5 tips)
  }
}

Scoring Criteria:
1. Content (25 points): Evaluate if experiences are clear, relevant, and well-written
2. Formatting (25 points): Assess if the layout is clean, readable, and professional
3. Merit (25 points): Rate the impressiveness of accomplishments and qualifications
4. Relevance (25 points): Judge how well the resume is tailored to the role/industry

Be critical but constructive in your feedback. Focus on actionable improvements.`;
} 