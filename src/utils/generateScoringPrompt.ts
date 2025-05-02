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
  "presentation": {
    "formatting": number (0-25),
    "actionVerbs": number (0-25),
    "quantifiableResults": number (0-25),
    "sectionStructure": number (0-25)
  },
  "substance": {
    "impact": number (0-25),
    "complexity": number (0-25),
    "leadership": number (0-25),
    "originality": number (0-25)
  },
  "feedback": {
    "presentation": string[] (3-5 tips),
    "substance": string[] (3-5 tips)
  }
}

Be critical but constructive in your feedback. Focus on actionable improvements.`;
} 