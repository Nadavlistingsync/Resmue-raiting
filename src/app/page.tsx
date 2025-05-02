'use client';

import React, { useState } from 'react';
import ScoreCard from '@/components/ScoreCard';
import RewriteCard from '@/components/RewriteCard';

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
  const [results, setResults] = useState<any>(null);
  const [rewrittenResume, setRewrittenResume] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      const data = await response.json();
      setResults(data);
    } catch (err) {
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
            presentation: results.presentation,
            substance: results.substance,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite resume');
      }

      const data = await response.json();
      setRewrittenResume(data.rewrittenResume);
    } catch (err) {
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
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Resume Rater Pro
        </h1>

        {!results ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
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
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume Text
              </label>
              <textarea
                id="resume"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Rating...' : 'Rate My Resume'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <ScoreCard
              totalScore={results.totalScore}
              presentation={results.presentation}
              substance={results.substance}
              feedback={results.feedback}
            />

            {!rewrittenResume ? (
              <div className="text-center">
                <button
                  onClick={handleRewrite}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Rewriting...' : 'Unlock Full Rewrite'}
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
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </main>
  );
} 