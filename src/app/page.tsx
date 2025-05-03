'use client';

import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import * as Sentry from "@sentry/nextjs";
import RewriteCard from '@/components/RewriteCard';
import FeedbackForm from '@/components/FeedbackForm';

interface ScoringResults {
  totalScore: number;
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
    setError(null);

    try {
      const response = await fetch('/api/rate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          industry,
          nickname,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate resume');
      }

      const data = (await response.json()) as ScoringResults;
      setResults(data);
      setResumeId(data.resumeId ?? null);

      // Track successful resume rating
      if (typeof window !== 'undefined') {
        const analytics = (window as { va?: (event: string, data: unknown) => void }).va;
        analytics?.('resume_rated', {
          industry,
          totalScore: data.totalScore,
        });
      }
    } catch (error) {
      Sentry.captureException(error);
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
        analytics?.('event', 'resume_rewritten', {
          industry,
        });
      }
    } catch (error) {
      Sentry.captureException(error);
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
                  Industry
                </label>
                <p className="text-sm text-gray-600 mb-2">Select the industry that best matches your career focus</p>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base font-medium"
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nickname" className="block text-lg font-semibold text-gray-800 mb-2">
                  Nickname (optional)
                </label>
                <p className="text-sm text-gray-600 mb-2">Choose a nickname to appear on the leaderboard</p>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  placeholder="Enter a nickname for your rating"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resume...
                  </span>
                ) : (
                  'Rate My Resume'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900">
                  Total Score: <span className="text-indigo-600">{results.totalScore}/100</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Presentation Scores</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Formatting</span>
                      <span className="text-lg font-bold text-indigo-600">{results.presentation.formatting}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Action Verbs</span>
                      <span className="text-lg font-bold text-indigo-600">{results.presentation.actionVerbs}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Quantifiable Results</span>
                      <span className="text-lg font-bold text-indigo-600">{results.presentation.quantifiableResults}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Section Structure</span>
                      <span className="text-lg font-bold text-indigo-600">{results.presentation.sectionStructure}/10</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Substance Scores</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Impact</span>
                      <span className="text-lg font-bold text-indigo-600">{results.substance.impact}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Complexity</span>
                      <span className="text-lg font-bold text-indigo-600">{results.substance.complexity}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Leadership</span>
                      <span className="text-lg font-bold text-indigo-600">{results.substance.leadership}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Originality</span>
                      <span className="text-lg font-bold text-indigo-600">{results.substance.originality}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Presentation Feedback</h3>
                  <ul className="space-y-3">
                    {results.presentationFeedback.map((feedback: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span className="text-gray-700">{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Substance Feedback</h3>
                  <ul className="space-y-3">
                    {results.substanceFeedback.map((feedback: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span className="text-gray-700">{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {!rewrittenResume ? (
                <div className="text-center">
                  <button
                    onClick={handleRewrite}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Rewriting Resume...
                      </span>
                    ) : (
                      'Unlock Full Rewrite'
                    )}
                  </button>
                </div>
              ) : (
                <RewriteCard
                  rewrittenResume={rewrittenResume}
                  onCopy={handleCopy}
                  onDownload={handleDownload}
                />
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium">{error}</p>
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