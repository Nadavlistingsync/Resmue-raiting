import React from 'react';

interface ScoreCardProps {
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
  feedback: {
    presentation: string[];
    substance: string[];
  };
}

export default function ScoreCard({
  totalScore,
  presentation,
  substance,
  feedback,
}: ScoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Resume Score</h2>
        <div className="text-6xl font-bold text-blue-600">{totalScore}/100</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Presentation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Formatting</span>
                <span>{presentation.formatting}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(presentation.formatting / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Action Verbs</span>
                <span>{presentation.actionVerbs}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(presentation.actionVerbs / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Quantifiable Results</span>
                <span>{presentation.quantifiableResults}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(presentation.quantifiableResults / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Section Structure</span>
                <span>{presentation.sectionStructure}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(presentation.sectionStructure / 25) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Substance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Impact</span>
                <span>{substance.impact}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(substance.impact / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Complexity</span>
                <span>{substance.complexity}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(substance.complexity / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Leadership</span>
                <span>{substance.leadership}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(substance.leadership / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Originality</span>
                <span>{substance.originality}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(substance.originality / 25) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Presentation Tips</h4>
            <ul className="list-disc list-inside space-y-2">
              {feedback.presentation.map((tip, index) => (
                <li key={index} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Substance Tips</h4>
            <ul className="list-disc list-inside space-y-2">
              {feedback.substance.map((tip, index) => (
                <li key={index} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 