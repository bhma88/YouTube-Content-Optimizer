import React, { useState, useEffect, useCallback } from 'react';
import { CloseIcon, DownloadIcon } from './icons/EditorIcons';

interface ThumbnailDownloaderModalProps {
  onClose: () => void;
}

interface Thumbnail {
  quality: string;
  url: string;
}

export const ThumbnailDownloaderModal: React.FC<ThumbnailDownloaderModalProps> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  const extractVideoId = (inputUrl: string): string | null => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = inputUrl.match(regExp);
    return match ? match[1] : null;
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setThumbnails([]);

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError('Invalid YouTube URL. Please check the link and try again.');
      return;
    }

    const qualities = [
      { quality: 'Maximum (1280x720)', name: 'maxresdefault' },
    ];

    const fetchedThumbnails = qualities.map(({ quality, name }) => ({
      quality,
      url: `https://img.youtube.com/vi/${videoId}/${name}.jpg`,
    }));
    
    setThumbnails(fetchedThumbnails);
  };

  // Handle Escape key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-2xl p-6 m-4 relative animate-fade-in border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-text-muted hover:text-white"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-white">Download YouTube Thumbnail</h2>
        <p className="text-brand-text-muted mb-6">Paste the URL of any YouTube video below to get its thumbnail in all available sizes.</p>

        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-grow bg-black/20 border border-white/20 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="submit"
            className="bg-brand-primary text-white font-bold py-3 px-6 rounded-md hover:bg-brand-secondary transition-colors"
          >
            Fetch
          </button>
        </form>

        {error && <div className="text-red-400 text-center p-3 bg-red-900/50 rounded-md">{error}</div>}

        {thumbnails.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">Result</h3>
            <div className="flex justify-center">
              {thumbnails.map((thumb) => (
                <div key={thumb.quality} className="bg-black/20 p-3 rounded-lg w-full max-w-md border border-white/10">
                  <img src={thumb.url} alt={`${thumb.quality} thumbnail`} className="w-full aspect-video object-cover rounded-md mb-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-brand-text-muted">{thumb.quality}</span>
                    <a
                      href={thumb.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <DownloadIcon />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};