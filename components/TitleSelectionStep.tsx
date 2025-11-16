
import React, { useState } from 'react';
import { GeneratedTitle } from '../types';
import { CopyIcon } from './icons/CopyIcon';

interface TitleSelectionStepProps {
  titles: GeneratedTitle[];
  topic: string;
  onTitleSelected: (title: string) => void;
}

export const TitleSelectionStep: React.FC<TitleSelectionStepProps> = ({ titles, topic, onTitleSelected }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Step 2: Choose Your Favorite Title</h2>
        <p className="text-lg text-gray-400">Here are 20 titles for your video about "<span className="font-semibold text-white">{topic}</span>". Select one to create a thumbnail.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {titles.map((item, index) => (
          <div key={index} className="bg-brand-gray-light p-4 rounded-lg flex flex-col justify-between border border-transparent hover:border-brand-red transition-all">
            <p className="text-base mb-4">{item.title}</p>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(item.title, index)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                <CopyIcon />
                {copiedIndex === index ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => onTitleSelected(item.title)}
                className="bg-brand-red text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Select & Create Thumbnail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
