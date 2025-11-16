
import React, { useState, useCallback } from 'react';
import { TitleInputStep } from './components/TitleInputStep';
import { TitleSelectionStep } from './components/TitleSelectionStep';
import { MetadataStep } from './components/MetadataStep';
import { ThumbnailEditorStep } from './components/ThumbnailEditorStep';
import { GeneratedTitle, AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.TITLE_INPUT);
  const [topic, setTopic] = useState<string>('');
  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <header className="w-full p-4 bg-brand-gray-dark border-b border-brand-gray-light flex justify-between items-center">
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-brand-red" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 C3.326,4.648,2.648,5.326,2.418,6.186C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
        </svg>
        <h1 className="text-xl md:text-2xl font-bold text-white">YouTube Content Optimizer</h1>
      </div>
       {(step !== AppStep.TITLE_INPUT) && (
        <button onClick={handleRestart} className="text-sm bg-brand-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
          Start Over
        </button>
      )}
    </header>
  );

  const renderContent = () => {
    if (error) {
      return <div className="text-center p-8 text-red-400">{error}</div>;
    }
    if (isLoading) {
       return (
        <div className="flex flex-col items-center justify-center p-10">
          <svg className="animate-spin h-10 w-10 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        return <ThumbnailEditorStep selectedTitle={selectedTitle} topic={topic} onBack={handleBackToMetadata} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand-dark">
      {renderHeader()}
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;