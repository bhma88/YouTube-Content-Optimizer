
import React, { useState } from 'react';
import { generateTitles } from '../services/geminiService';
import { GeneratedTitle } from '../types';

interface TitleInputStepProps {
  onTitlesGenerated: (titles: GeneratedTitle[], topic: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const TitleInputStep: React.FC<TitleInputStepProps> = ({ onTitlesGenerated, setIsLoading, setError }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const titles = await generateTitles(topic);
      onTitlesGenerated(titles, topic);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Step 1: Generate Click-Worthy Titles</h2>
      <p className="text-lg text-gray-400 mb-8">Enter a topic or a rough idea for your video, and our AI will craft 20 engaging titles for you.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., 'How to learn React in 2024'"
          className="flex-grow bg-brand-gray-light border border-brand-gray-medium rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
        />
        <button
          type="submit"
          className="bg-brand-red text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-500"
          disabled={!topic.trim()}
        >
          Generate Titles
        </button>
      </form>
    </div>
  );
};
