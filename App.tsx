
import React, { useState, useCallback } from 'react';
import { TitleInputStep } from './components/TitleInputStep';
import { TitleSelectionStep } from './components/TitleSelectionStep';
import { MetadataStep } from './components/MetadataStep';
import { ThumbnailEditorStep } from './components/ThumbnailEditorStep';
import { ThumbnailDownloaderModal } from './components/ThumbnailDownloaderModal';
import { GeneratedTitle, AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.TITLE_INPUT);
  const [topic, setTopic] = useState<string>('');
  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloaderOpen, setIsDownloaderOpen] = useState(false);

  const handleTitlesGenerated = useCallback((generatedTitles: GeneratedTitle[], originalTopic: string) => {
    setTitles(generatedTitles);
    setTopic(originalTopic);
    setStep(AppStep.TITLE_SELECTION);
    setIsLoading(false);
  }, []);

  const handleTitleSelected = useCallback((title: string) => {
    setSelectedTitle(title);
    setStep(AppStep.METADATA_OPTIMIZATION);
  }, []);

  const handleProceedToThumbnail = useCallback(() => {
    setStep(AppStep.THUMBNAIL_EDITOR);
  }, []);

  const handleRestart = useCallback(() => {
    setStep(AppStep.TITLE_INPUT);
    setTopic('');
    setTitles([]);
    setSelectedTitle('');
    setError(null);
  }, []);

  const handleBackToTitles = useCallback(() => {
    setStep(AppStep.TITLE_SELECTION);
    setSelectedTitle('');
  }, []);

  const handleBackToMetadata = useCallback(() => {
    setStep(AppStep.METADATA_OPTIMIZATION);
  }, []);


  const renderHeader = () => (
    <header className="w-full p-4 bg-brand-bg border-b border-white/10 shadow-lg flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* <!-- 3D Icon Start --> */}
        <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logo-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FF00FF" /> 
                    <stop offset="100%" stopColor="#8A2BE2" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                    <feOffset dx="0.5" dy="1" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#shadow)">
                <path fill="url(#logo-gradient)" d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 C3.326,4.648,2.648,5.326,2.418,6.186C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z"/>
                <path fill="#FFFFFF" d="M10,15.464V8.536L16,12L10,15.464z"/>
            </g>
        </svg>
        {/* <!-- 3D Icon End --> */}
        <h1 className="text-xl md:text-2xl font-bold text-white">YouTube Content Optimizer</h1>
      </div>
       <div className="flex items-center gap-2">
         <button onClick={() => setIsDownloaderOpen(true)} className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 duration-300">
            Download Thumbnail
          </button>
        {(step !== AppStep.TITLE_INPUT) && (
        <button onClick={handleRestart} className="text-sm bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary transition-all shadow-lg hover:shadow-brand-secondary/50 transform hover:scale-105 duration-300">
          Start Over
        </button>
      )}
      </div>
    </header>
  );

  const renderContent = () => {
    if (error) {
      return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    if (isLoading) {
       return (
        <div className="flex flex-col items-center justify-center p-10">
          <svg className="animate-spin h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Generating awesome titles...</p>
        </div>
      );
    }

    switch (step) {
      case AppStep.TITLE_INPUT:
        return <TitleInputStep onTitlesGenerated={handleTitlesGenerated} setIsLoading={setIsLoading} setError={setError} />;
      case AppStep.TITLE_SELECTION:
        return <TitleSelectionStep titles={titles} onTitleSelected={handleTitleSelected} topic={topic} />;
      case AppStep.METADATA_OPTIMIZATION:
        return <MetadataStep selectedTitle={selectedTitle} topic={topic} onProceed={handleProceedToThumbnail} onBack={handleBackToTitles} />;
      case AppStep.THUMBNAIL_EDITOR:
        return <ThumbnailEditorStep selectedTitle={selectedTitle} topic={topic} onBack={handleBackToMetadata} onOpenDownloader={() => setIsDownloaderOpen(true)} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  const renderFooter = () => (
      <footer className="w-full p-4 text-center text-brand-text-muted text-sm border-t border-white/10 mt-auto bg-brand-bg">
        <p>This service is 100% free and supported by the community.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="mailto:bhma1988@GMAIL.COM" className="hover:text-white transition-colors">Contact Us</a>
          <a href="https://buymeacoffee.com/bourahh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support Us ❤️</a>
        </div>
      </footer>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand-bg">
      {isDownloaderOpen && <ThumbnailDownloaderModal onClose={() => setIsDownloaderOpen(false)} />}
      {renderHeader()}
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow">
        {renderContent()}
      </main>
      {renderFooter()}
    </div>
  );
};

export default App;
