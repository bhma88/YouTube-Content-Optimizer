
import React from 'react';

interface YoutubePreviewProps {
  thumbnailBase64: string | null;
  title: string;
}

export const YoutubePreview: React.FC<YoutubePreviewProps> = ({ thumbnailBase64, title }) => {
  return (
    <div className="bg-brand-surface p-4 rounded-lg w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-3">
        {/* Placeholder for other videos */}
        <div className="w-full aspect-video bg-white/10 rounded-lg opacity-50"></div>

        {/* The Actual Preview */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-video bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
            {thumbnailBase64 ? (
              <img src={`data:image/png;base64,${thumbnailBase64}`} alt="Thumbnail Preview" className="w-full h-full object-cover" />
            ) : (
               <div className="text-brand-text-muted">Thumbnail</div>
            )}
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 bg-gray-500 rounded-full flex-shrink-0 mt-1"></div>
            <div className="flex-grow">
              <h4 className="text-white font-medium text-sm leading-tight line-clamp-2">{title}</h4>
              <p className="text-brand-text-muted text-xs mt-1">Your Channel Name</p>
              <p className="text-brand-text-muted text-xs">1 view • Just now</p>
            </div>
          </div>
        </div>

        {/* Placeholder for other videos */}
        <div className="w-full aspect-video bg-white/10 rounded-lg opacity-50 mt-4"></div>
      </div>
    </div>
  );
};