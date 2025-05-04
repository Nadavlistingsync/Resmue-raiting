import { useState } from 'react';

interface FeedbackFormProps {
  resumeId: string;
  onClose: () => void;
}

export default function FeedbackForm({ resumeId, onClose }: FeedbackFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just close the form
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">How was your experience?</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 