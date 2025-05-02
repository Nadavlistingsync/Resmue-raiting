import React from 'react';

interface LeaderboardEntry {
  nickname: string;
  industry: string;
  total_score: number;
  created_at: string;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Nickname</th>
            <th className="py-3 px-4 text-left">Industry</th>
            <th className="py-3 px-4 text-left">Score</th>
            <th className="py-3 px-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              className={`${
                entry.isCurrentUser
                  ? 'bg-blue-50 font-medium'
                  : index % 2 === 0
                  ? 'bg-white'
                  : 'bg-gray-50'
              }`}
            >
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{entry.nickname}</td>
              <td className="py-3 px-4">{entry.industry}</td>
              <td className="py-3 px-4">{entry.total_score}</td>
              <td className="py-3 px-4">
                {new Date(entry.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 