import React from 'react';

interface RewriteCardProps {
  rewrittenResume: string;
  onCopy: () => void;
  onDownload: () => void;
}

export default function RewriteCard({
  rewrittenResume,
  onCopy,
  onDownload,
}: RewriteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rewritten Resume</h2>
        <div className="space-x-2">
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Download as TXT
          </button>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {rewrittenResume}
        </pre>
      </div>
    </div>
  );
} 