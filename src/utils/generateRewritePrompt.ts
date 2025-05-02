export interface RewritePromptInput {
  resumeText: string;
  industry: string;
  scoringResults: {
    presentation: {
      formatting: number;
      actionVerbs: number;
      quantifiableResults: number;
      sectionStructure: number;
    };
    substance: {
      impact: number;
      complexity: number;
      leadership: number;
      originality: number;
    };
  };
}

export function generateRewritePrompt({
  resumeText,
  industry,
  scoringResults,
}: RewritePromptInput): string {
  return `You are an expert resume writer specializing in ${industry} industry. 
Please rewrite the following resume to improve its impact and effectiveness:

Original Resume:
${resumeText}

Previous Scoring Results:
${JSON.stringify(scoringResults, null, 2)}

Please provide a complete rewritten version of the resume that:
1. Improves weak areas identified in the scoring
2. Uses stronger action verbs
3. Adds quantifiable results where possible
4. Enhances the overall structure and formatting
5. Maintains the original content while making it more impactful

Return the rewritten resume as plain text, maintaining the same general structure but with improved content.`;
} 