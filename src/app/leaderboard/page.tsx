'use client';

import React, { useEffect, useState } from 'react';

const categories = [
  { key: 'technical', label: 'Content' },
  { key: 'experience', label: 'Formatting' },
  { key: 'education', label: 'Merit' },
  { key: 'projects', label: 'Relevance' },
  { key: 'overall', label: 'Overall' },
];

export default function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/rate-resume?category=${selectedCategory}`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        setError('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>
        <div className="flex justify-center mb-6 gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedCategory === cat.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nickname</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.userId || entry.nickname || 'Anonymous'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.scores ? entry.scores[selectedCategory] : entry.total_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.lastUpdated || entry.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
} 