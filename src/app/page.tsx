'use client';

import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import RewriteCard from '@/components/RewriteCard';
import FeedbackForm from '@/components/FeedbackForm';

interface ScoringResults {
  totalScore: number;
  scores: {
    content: number;
    formatting: number;
    merit: number;
    relevance: number;
  };
  feedback: {
    content: string[];
    formatting: string[];
    merit: string[];
    relevance: string[];
  };
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
  presentationFeedback: string[];
  substanceFeedback: string[];
  resumeId?: string;
}

const industries = [
  'Technology',
  'Finance',
  'Marketing',
  'Healthcare',
  'Education',
  'Engineering',
  'Design',
  'Other',
];

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [industry, setIndustry] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScoringResults | null>(null);
  const [rewrittenResume, setRewrittenResume] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          industry,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate resume');
      }

      const data = await response.json();
      // Map backend response to expected frontend structure
      const mapped = {
        totalScore: data.overallScore ?? 0,
        scores: {
          content: data.categories?.technical?.score ?? 0,
          formatting: data.categories?.experience?.score ?? 0,
          merit: data.categories?.education?.score ?? 0,
          relevance: data.categories?.projects?.score ?? 0,
        },
        feedback: {
          content: [],
          formatting: [],
          merit: [],
          relevance: [],
        },
        presentation: {
          formatting: data.categories?.technical?.score ?? 0,
          actionVerbs: data.categories?.['soft-skills']?.score ?? 0,
          quantifiableResults: data.categories?.projects?.score ?? 0,
          sectionStructure: data.categories?.experience?.score ?? 0,
        },
        substance: {
          impact: data.categories?.overall?.score ?? 0,
          complexity: data.categories?.education?.score ?? 0,
          leadership: data.categories?.['soft-skills']?.score ?? 0,
          originality: data.categories?.projects?.score ?? 0,
        },
        presentationFeedback: [],
        substanceFeedback: [],
        resumeId: data.id ?? null,
      };
      setResults(mapped);
      setResumeId(data.id ?? null);

      // Track successful resume rating
      if (typeof window !== 'undefined') {
        const analytics = (window as { va?: (event: string, data: unknown) => void }).va;
        analytics?.('resume_rated', {
          industry,
          totalScore: data.overallScore,
        });
      }
    } catch (error) {
      console.error('Error rating resume:', error);
      setError('An error occurred while rating your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewrite-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          industry,
          scoringResults: {
            presentation: results?.presentation,
            substance: results?.substance,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite resume');
      }

      const data = await response.json() as { rewrittenResume: string };
      setRewrittenResume(data.rewrittenResume);
      setShowFeedback(true);

      // Track successful resume rewrite
      if (typeof window !== 'undefined') {
        const analytics = (window as { va?: (event: string, data: unknown) => void }).va;
        analytics?.('resume_rewritten', {
          industry,
        });
      }
    } catch (error) {
      console.error('Error rewriting resume:', error);
      setError('An error occurred while rewriting your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (rewrittenResume) {
      navigator.clipboard.writeText(rewrittenResume);
    }
  };

  const handleDownload = () => {
    if (rewrittenResume) {
      const element = document.createElement('a');
      const file = new Blob([rewrittenResume], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'rewritten-resume.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <>
      <Analytics />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-4 mt-16">
            Resume Rater Pro
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8 font-medium">
            Get expert feedback on your resume and improve your chances of landing your dream job
          </p>

          {!results ? (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
              <div>
                <label htmlFor="resume" className="block text-lg font-semibold text-gray-800 mb-2">
                  Resume Text
                </label>
                <p className="text-sm text-gray-600 mb-2">Paste your resume content below for analysis</p>
                <textarea
                  id="resume"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base min-h-[200px]"
                  placeholder="Paste your resume text here..."
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-lg font-semibold text-gray-800 mb-2">
                  Industry (Optional)
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Analyzing...' : 'Rate My Resume'}
              </button>

              {error && (
                <div className="text-red-600 text-center">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Resume Score</h2>
                <div className="text-6xl font-extrabold text-indigo-600 mt-4">
                  {results.totalScore}/100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.entries(results.scores ?? {})).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 capitalize mb-2">
                      {category}
                    </h3>
                    <div className="text-4xl font-bold text-indigo-600 mb-4">
                      {score}/25
                    </div>
                    <ul className="space-y-2">
                      {results.feedback[category as keyof typeof results.feedback].map((tip, index) => (
                        <li key={index} className="text-gray-600">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setResults(null);
                    setResumeText('');
                    setIndustry('');
                  }}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Rate Another Resume
                </button>
              </div>
            </div>
          )}

          {showFeedback && resumeId && (
            <FeedbackForm
              resumeId={resumeId}
              onClose={() => setShowFeedback(false)}
            />
          )}
        </div>
      </main>
    </>
  );
} 