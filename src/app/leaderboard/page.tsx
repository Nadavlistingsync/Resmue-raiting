'use client';

import React, { useEffect, useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';

interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  industry: string;
  created_at: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Resume Rater Pro Leaderboard
        </h1>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        ) : (
          <LeaderboardTable entries={entries} />
        )}
      </div>
    </main>
  );
} 