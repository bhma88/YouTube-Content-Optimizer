import React, { useState, useEffect } from 'react';
import { generateKeywords, generateDescription } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { CopyIcon } from './icons/CopyIcon';
import { ArrowLeftIcon } from './icons/EditorIcons';

interface MetadataStepProps {
  selectedTitle: string;
  topic: string;
  onProceed: () => void;
  onBack: () => void;
}

export const MetadataStep: React.FC<MetadataStepProps> = ({ selectedTitle, topic, onProceed, onBack }) => {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
    const [isLoadingDescription, setIsLoadingDescription] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedKeywords, setCopiedKeywords] = useState(false);
    const [copiedDescription, setCopiedDescription] = useState(false);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                setError(null);
                setIsLoadingKeywords(true);
                setIsLoadingDescription(true);

                const fetchedKeywords = await generateKeywords(topic, selectedTitle);
                setKeywords(fetchedKeywords);
                setIsLoadingKeywords(false);

                const fetchedDescription = await generateDescription(topic, selectedTitle, fetchedKeywords);
                setDescription(fetchedDescription);
                setIsLoadingDescription(false);
            } catch (err: any) {
                setError(err.message || 'Failed to load metadata.');
                setIsLoadingKeywords(false);
                setIsLoadingDescription(false);
            }
        };

        fetchMetadata();
    }, [topic, selectedTitle]);

    const handleCopyKeywords = () => {
        navigator.clipboard.writeText(keywords.join(', '));
        setCopiedKeywords(true);
        setTimeout(() => setCopiedKeywords(false), 2000);
    };

    const handleCopyDescription = () => {
        navigator.clipboard.writeText(description);
        setCopiedDescription(true);
        setTimeout(() => setCopiedDescription(false), 2000);
    };
    
    const isLoading = isLoadingKeywords || isLoadingDescription;

    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-muted hover:text-white mb-6">
          <ArrowLeftIcon />
          Back to Titles
        </button>

        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Step 3: Optimize SEO Metadata</h2>
            <p className="text-lg text-brand-text-muted max-w-3xl mx-auto">Our SEO expert AI has generated keywords and a description to help your video get discovered.</p>
             <p className="font-semibold text-white mt-2">Selected Title: "{selectedTitle}"</p>
        </div>

        {error && <div className="text-center p-4 my-4 bg-red-800 text-white rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Description Section */}
            <div className="bg-brand-surface p-6 rounded-2xl shadow-2xl border border-white/10">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Generated Description</h3>
                    <button onClick={handleCopyDescription} disabled={isLoading || !description} className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-white disabled:opacity-50">
                        <CopyIcon />
                        {copiedDescription ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                {isLoadingDescription ? (
                     <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
                ) : (
                    <textarea
                        readOnly
                        value={description}
                        className="w-full h-48 bg-black/20 border border-white/20 rounded-md p-3 text-brand-text-muted resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                )}
            </div>
            
            {/* Keywords Section */}
            <div className="bg-brand-surface p-6 rounded-2xl shadow-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Generated Keywords</h3>
                    <button onClick={handleCopyKeywords} disabled={isLoading || keywords.length === 0} className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-white disabled:opacity-50">
                        <CopyIcon />
                        {copiedKeywords ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                {isLoadingKeywords ? (
                    <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, i) => (
                            <span key={i} className="bg-black/30 text-white text-sm font-medium px-3 py-1 rounded-full border border-white/10">{kw}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="mt-8 text-center">
            <button onClick={onProceed} disabled={isLoading} className="bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-bold py-3 px-8 rounded-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-brand-primary/50 transform hover:scale-105">
                Proceed to Thumbnail Creation
            </button>
        </div>

      </div>
    );
};