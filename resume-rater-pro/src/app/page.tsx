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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-4">
          Resume Rater Pro
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8 font-medium">
          Get expert feedback on your resume and improve your chances of landing your dream job
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <label htmlFor="resume" className="block text-lg font-semibold text-gray-800 mb-2">
              Resume Text
            </label>
            <p className="text-sm text-gray-600 mb-2">Paste your resume content below for analysis</p>
            <textarea
              id="resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
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
              <optgroup label="Technology & IT" className="font-semibold">
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science">Data Science & Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps">DevOps & SRE</option>
                <option value="AI ML">AI & Machine Learning</option>
              </optgroup>
              <optgroup label="Business & Finance" className="font-semibold">
                <option value="Investment Banking">Investment Banking</option>
                <option value="Management Consulting">Management Consulting</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Accounting">Accounting & Audit</option>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Risk Management">Risk Management</option>
              </optgroup>
              <optgroup label="Healthcare & Sciences" className="font-semibold">
                <option value="Medicine">Medicine & Surgery</option>
                <option value="Nursing">Nursing</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Healthcare Admin">Healthcare Administration</option>
                <option value="Research">Scientific Research</option>
              </optgroup>
              <optgroup label="Engineering" className="font-semibold">
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Electrical">Electrical Engineering</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Chemical">Chemical Engineering</option>
                <option value="Aerospace">Aerospace Engineering</option>
                <option value="Robotics">Robotics Engineering</option>
              </optgroup>
              <optgroup label="Creative & Design" className="font-semibold">
                <option value="UX Design">UX/UI Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Product Design">Product Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Brand Strategy">Brand Strategy</option>
              </optgroup>
              <optgroup label="Professional Services" className="font-semibold">
                <option value="Law">Legal</option>
                <option value="HR">Human Resources</option>
                <option value="Sales">Sales & Business Development</option>
                <option value="Project Management">Project Management</option>
                <option value="Operations">Operations Management</option>
                <option value="Supply Chain">Supply Chain & Logistics</option>
              </optgroup>
              <optgroup label="Other Fields" className="font-semibold">
                <option value="Education">Education & Teaching</option>
                <option value="Government">Government & Public Service</option>
                <option value="Nonprofit">Non-Profit & NGO</option>
                <option value="Sustainability">Environmental & Sustainability</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </optgroup>
            </select>
            {industry === 'Other' && (
              <input
                type="text"
                placeholder="Please specify your industry"
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                onChange={(e) => setCustomIndustry(e.target.value)}
              />
            )}
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

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {rating && (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900">
                Total Score: <span className="text-indigo-600">{rating.totalScore}/100</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Presentation Scores</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Formatting</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.presentation.formatting}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Action Verbs</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.presentation.actionVerbs}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Quantifiable Results</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.presentation.quantifiableResults}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Section Structure</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.presentation.sectionStructure}/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Substance Scores</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Impact</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.substance.impact}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Complexity</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.substance.complexity}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Leadership</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.substance.leadership}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Originality</span>
                    <span className="text-lg font-bold text-indigo-600">{rating.substance.originality}/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Presentation Feedback</h3>
                <ul className="space-y-3">
                  {rating.presentationFeedback.map((feedback, index) => (
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
                  {rating.substanceFeedback.map((feedback, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-700">{feedback}</span>
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
