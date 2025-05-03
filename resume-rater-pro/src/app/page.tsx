'use client';

import { useState } from 'react';

interface RatingResponse {
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
}

interface ErrorResponse {
  message: string;
}

export default function Home() {
  const [resume, setResume] = useState('');
  const [industry, setIndustry] = useState('Tech');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState<RatingResponse | null>(null);
  const [customIndustry, setCustomIndustry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRating(null);

    try {
      const response = await fetch('/api/rate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          industry: industry === 'Other' ? customIndustry : industry,
          nickname,
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || 'Failed to rate resume');
      }

      const data: RatingResponse = await response.json();
      setRating(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Resume Rater Pro
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Resume Text
            </label>
            <textarea
              id="resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={10}
              placeholder="Paste your resume text here..."
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white font-semibold text-gray-800"
            >
              <optgroup label="Technology" className="font-semibold">
                <option value="Software Development">Software Development</option>
                <option value="Data Science">Data Science & Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Product Management">Product Management</option>
              </optgroup>
              <optgroup label="Business" className="font-semibold">
                <option value="Finance">Finance & Banking</option>
                <option value="Marketing">Marketing & Advertising</option>
                <option value="Sales">Sales</option>
                <option value="Consulting">Business Consulting</option>
                <option value="HR">Human Resources</option>
              </optgroup>
              <optgroup label="Healthcare" className="font-semibold">
                <option value="Medical">Medical Practice</option>
                <option value="Nursing">Nursing</option>
                <option value="Healthcare Admin">Healthcare Administration</option>
                <option value="Biotech">Biotechnology</option>
                <option value="Pharma">Pharmaceutical</option>
              </optgroup>
              <optgroup label="Engineering" className="font-semibold">
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Electrical">Electrical Engineering</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Chemical">Chemical Engineering</option>
                <option value="Aerospace">Aerospace Engineering</option>
              </optgroup>
              <optgroup label="Creative" className="font-semibold">
                <option value="Design">Design</option>
                <option value="Media">Media & Entertainment</option>
                <option value="Content">Content Creation</option>
                <option value="Advertising">Advertising</option>
                <option value="Arts">Fine Arts</option>
              </optgroup>
              <optgroup label="Other" className="font-semibold">
                <option value="Education">Education</option>
                <option value="Government">Government</option>
                <option value="NonProfit">Non-Profit</option>
                <option value="Legal">Legal</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
            {industry === 'Other' && (
              <input
                type="text"
                placeholder="Please specify your industry"
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setCustomIndustry(e.target.value)}
              />
            )}
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname (optional)
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter a nickname for your rating"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Rate My Resume'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {rating && (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Total Score: {rating.totalScore}/100
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Presentation Scores</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Formatting</span>
                    <span className="font-medium">{rating.presentation.formatting}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Action Verbs</span>
                    <span className="font-medium">{rating.presentation.actionVerbs}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantifiable Results</span>
                    <span className="font-medium">{rating.presentation.quantifiableResults}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Section Structure</span>
                    <span className="font-medium">{rating.presentation.sectionStructure}/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Substance Scores</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Impact</span>
                    <span className="font-medium">{rating.substance.impact}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity</span>
                    <span className="font-medium">{rating.substance.complexity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leadership</span>
                    <span className="font-medium">{rating.substance.leadership}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Originality</span>
                    <span className="font-medium">{rating.substance.originality}/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Presentation Feedback</h3>
                <ul className="space-y-2">
                  {rating.presentationFeedback.map((feedback, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Substance Feedback</h3>
                <ul className="space-y-2">
                  {rating.substanceFeedback.map((feedback, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
