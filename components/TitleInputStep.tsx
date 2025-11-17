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
    } catch (err: any)
 {
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center max-w-5xl mx-auto p-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary" style={{ textShadow: '0 4px 25px rgba(138, 43, 226, 0.4)' }}>AI-Powered YouTube SEO & Thumbnail Suite</h2>
      <p className="text-lg text-brand-text-muted mb-10">
        Instantly generate viral titles, SEO-optimized descriptions, and keywords. <span className="font-bold text-white">Copy any thumbnail's style</span> and create stunning, high-converting thumbnails. Our powerful suite is 100% free.
      </p>
      
      <div className="max-w-3xl mx-auto mb-12 bg-brand-surface p-8 rounded-2xl shadow-2xl border border-white/10">
        <h3 className="text-2xl font-bold mb-4">Start Here: What's Your Video About?</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'How to learn React in 2024'"
            className="flex-grow bg-black/30 border border-white/20 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow duration-300 focus:shadow-[0_0_20px_rgba(138,43,226,0.6)]"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-primary/50 transform hover:scale-105"
            disabled={!topic.trim()}
          >
            Generate Titles
          </button>
        </form>
      </div>

      <div className="my-12 max-w-4xl mx-auto">
        <div className="w-full h-24 bg-brand-surface border border-dashed border-white/20 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Advertisement Space</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
        <div className="bg-brand-surface p-6 rounded-xl border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-primary/70 hover:shadow-lg hover:shadow-brand-primary/20">
          <h3 className="text-xl font-bold text-brand-primary mb-2">1. Generate Titles</h3>
          <p className="text-brand-text-muted">Start with a topic, and our AI generates 20 viral, click-worthy titles optimized for YouTube's algorithm.</p>
        </div>
        <div className="bg-brand-surface p-6 rounded-xl border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-primary/70 hover:shadow-lg hover:shadow-brand-primary/20">
          <h3 className="text-xl font-bold text-brand-primary mb-2">2. Optimize Metadata</h3>
          <p className="text-brand-text-muted">Receive expert-level SEO keywords and a compelling video description to rank higher in search.</p>
        </div>
        <div className="bg-brand-surface p-6 rounded-xl border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-primary/70 hover:shadow-lg hover:shadow-brand-primary/20">
          <h3 className="text-xl font-bold text-brand-primary mb-2">3. Copy Style & Create</h3>
          <p className="text-brand-text-muted">Download any thumbnail, upload it as a style reference, and our AI will create a unique thumbnail in the same style.</p>
        </div>
      </div>

      <div className="mt-16 text-left max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="bg-brand-surface p-4 rounded-lg group border border-white/10 transition-all hover:border-white/20">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              How can I copy the style of another YouTube thumbnail?
              <span className="transition-transform transform group-open:rotate-180 text-brand-primary">▼</span>
            </summary>
            <p className="mt-3 text-brand-text-muted">It's easy! First, use the 'Download Thumbnail' button in the header to save the thumbnail from any YouTube video URL to your computer. Then, when you get to the thumbnail creation step, upload that saved image in the 'Copy a Style' section. Our AI will analyze its colors, fonts, and layout to create a new, unique thumbnail for you in that style.</p>
          </details>
          <details className="bg-brand-surface p-4 rounded-lg group border border-white/10 transition-all hover:border-white/20">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Is this service really free?
              <span className="transition-transform transform group-open:rotate-180 text-brand-primary">▼</span>
            </summary>
            <p className="mt-3 text-brand-text-muted">Yes, our YouTube Content Optimizer is 100% free to use. It's supported by our community. If you find it helpful, you can support our work with a coffee donation!</p>
          </details>
          <details className="bg-brand-surface p-4 rounded-lg group border border-white/10 transition-all hover:border-white/20">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              How does the AI thumbnail generation work?
               <span className="transition-transform transform group-open:rotate-180 text-brand-primary">▼</span>
            </summary>
            <p className="mt-3 text-brand-text-muted">Our AI analyzes your title, topic, and optional style references to create a unique, eye-catching thumbnail. You can upload a photo of your face to be included and then use simple text commands to make edits until it's perfect.</p>
          </details>
          <details className="bg-brand-surface p-4 rounded-lg group border border-white/10 transition-all hover:border-white/20">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Why is a good thumbnail so important?
               <span className="transition-transform transform group-open:rotate-180 text-brand-primary">▼</span>
            </summary>
            <p className="mt-3 text-brand-text-muted">A thumbnail is the first thing viewers see. A great thumbnail increases your Click-Through Rate (CTR), telling YouTube's algorithm that your video is engaging. This leads to more impressions, views, and channel growth.</p>
          </details>
           <details className="bg-brand-surface p-4 rounded-lg group border border-white/10 transition-all hover:border-white/20">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
              Do you store my uploaded images?
               <span className="transition-transform transform group-open:rotate-180 text-brand-primary">▼</span>
            </summary>
            <p className="mt-3 text-brand-text-muted">No. Your privacy is important. Uploaded images are sent to the AI model for processing and are not stored on our servers. The entire process is secure and private.</p>
          </details>
        </div>
      </div>

    </div>
  );
};