import React from 'react';
import { Send } from 'lucide-react';
import { getStoredClassifications, clearClassifications } from '../utils/storage';

interface SubmitButtonProps {
  classificationsCount: number;
  isShaken: boolean;
  onSubmit: () => void;
}

export function SubmitButton({ classificationsCount, isShaken, onSubmit }: SubmitButtonProps) {
  const shouldShow = classificationsCount >= 5 || isShaken;

  if (!shouldShow) return null;

  const handleSubmit = async () => {
    const storage = getStoredClassifications();

    try {
      // Here you would typically send the data to your backend
      console.log('Submitting classifications:', storage.classifications);

      // Clear the stored classifications after successful submission
      clearClassifications();

      alert('Classifications submitted successfully!');
      onSubmit();
    } catch (error) {
      console.error('Failed to submit classifications:', error);
      alert('Failed to submit classifications. Please try again.');
    }
  };

  return (
    <button
      onClick={handleSubmit}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-gradient-to-br from-purple-900/50 to-black border border-purple-800/50 hover:bg-black/70
                 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg
                 transition-all transform hover:scale-105 active:scale-95"
    >
      <Send className="w-5 h-5" />
      <span>Submit Classifications</span>
    </button>
  );
}
