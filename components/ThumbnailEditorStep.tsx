
import React, { useState, useCallback, useRef } from 'react';
import { generateThumbnail, analyzeStyle, editThumbnail } from '../services/geminiService';
import { StyleAttributes, ImageData } from '../types';
import { ImageUploader } from './ImageUploader';
import { YoutubePreview } from './YoutubePreview';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ArrowLeftIcon, UndoIcon, RedoIcon, DownloadIcon } from './icons/EditorIcons';

interface ThumbnailEditorStepProps {
  selectedTitle: string;
  topic: string;
  onBack: () => void;
  onOpenDownloader: () => void;
}

export const ThumbnailEditorStep: React.FC<ThumbnailEditorStepProps> = ({ selectedTitle, topic, onBack, onOpenDownloader }) => {
  const [faceImage, setFaceImage] = useState<ImageData | null>(null);
  const [styleImages, setStyleImages] = useState<ImageData[]>([]);
  const [analyzedStyle, setAnalyzedStyle] = useState<StyleAttributes | null>(null);
  const [stylePrompt, setStylePrompt] = useState('');
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editCommand, setEditCommand] = useState('');

  const updateHistory = (newImage: string) => {
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(newImage);
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setGeneratedThumbnail(newImage);
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGeneratedThumbnail(editHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < editHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setGeneratedThumbnail(editHistory[newIndex]);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsLoading(true);
    setLoadingAction('Generating thumbnail...');
    try {
      const thumbnailB64 = await generateThumbnail(selectedTitle, topic, faceImage, stylePrompt);
      updateHistory(thumbnailB64);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalyzeStyle = async () => {
    if (styleImages.length === 0) return;
    setError(null);
    setIsLoading(true);
    setLoadingAction('Analyzing styles...');
    try {
        const attributes = await analyzeStyle(styleImages);
        setAnalyzedStyle(attributes);
        const prompt = `Apply a style similar to the references. Key characteristics:
-   Color Palette: ${attributes.palette.join(', ')}
-   Typography: ${attributes.typography}
-   Layout: ${attributes.layout}
-   Effects: ${attributes.effects}`;
        setStylePrompt(prompt);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommand.trim() || !generatedThumbnail) return;
     setError(null);
    setIsLoading(true);
    setLoadingAction('Applying edit...');
    try {
        const editedThumbnailB64 = await editThumbnail(generatedThumbnail, editCommand, selectedTitle, faceImage);
        updateHistory(editedThumbnailB64);
        setEditCommand('');
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (!generatedThumbnail) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedThumbnail}`;
    link.download = `${selectedTitle.replace(/\s+/g, '_').toLowerCase()}_thumbnail.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-brand-text-muted hover:text-white mb-6">
        <ArrowLeftIcon />
        Back to SEO Optimization
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Step 4: Copy a Style & Create Your Thumbnail</h2>
        <p className="text-lg text-brand-text-muted max-w-3xl mx-auto">Upload your photo, add style references, and use natural language to perfect your design.</p>
        <p className="font-semibold text-white mt-2">Selected Title: "{selectedTitle}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="bg-brand-surface p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">1. Upload Your Photo</h3>
            <ImageUploader onFilesUploaded={(files) => setFaceImage(files[0])} multiple={false} buttonText="Upload Face Photo" />
          </div>
          <div>
             <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">2. (Optional) Copy a Thumbnail's Style</h3>
              <button onClick={onOpenDownloader} className="text-sm bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/50 transform hover:scale-105 duration-300">
                  Download Thumbnail
              </button>
            </div>
            <ImageUploader onFilesUploaded={setStyleImages} multiple={true} buttonText="Upload Thumbnails to Copy Style" />
            {styleImages.length > 0 && (
                <button onClick={handleAnalyzeStyle} disabled={isLoading} className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500">
                Analyze Style
                </button>
            )}
          </div>
          {analyzedStyle && (
            <div className="text-sm bg-black/20 p-3 rounded-md border border-white/10">
                <h4 className="font-semibold mb-2">Detected Style:</h4>
                <p><strong>Palette:</strong> {analyzedStyle.palette.join(', ')}</p>
                <p><strong>Typography:</strong> {analyzedStyle.typography}</p>
                <p><strong>Layout:</strong> {analyzedStyle.layout}</p>
                <p><strong>Effects:</strong> {analyzedStyle.effects}</p>
            </div>
          )}
          <div>
             <button onClick={handleGenerate} disabled={isLoading || !faceImage} className="w-full bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-all duration-300 disabled:opacity-50 text-lg shadow-lg hover:shadow-brand-primary/50 transform hover:scale-105">
                Generate Thumbnail
            </button>
          </div>
          {generatedThumbnail && (
            <div>
              <h3 className="text-xl font-semibold mb-3">3. Edit with Text</h3>
              <form onSubmit={handleEdit} className="flex gap-2">
                 <input type="text" value={editCommand} onChange={e => setEditCommand(e.target.value)} placeholder="e.g., 'Make the text bigger'" className="flex-grow bg-black/20 border border-white/20 rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                 <button type="submit" disabled={isLoading || !editCommand.trim()} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-500">Apply</button>
              </form>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-video bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20 overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
                <LoadingSpinner />
                <p className="mt-3 text-white">{loadingAction}</p>
              </div>
            )}
            {generatedThumbnail ? (
              <img src={`data:image/png;base64,${generatedThumbnail}`} alt="Generated Thumbnail" className="w-full h-full object-contain" />
            ) : (
              <p className="text-brand-text-muted">Your thumbnail will appear here</p>
            )}
            {error && <div className="absolute bottom-2 left-2 right-2 p-2 bg-red-800 text-white text-sm rounded">{error}</div>}
          </div>

          {generatedThumbnail && (
             <div className="flex justify-between items-center bg-brand-surface p-3 rounded-lg border border-white/10">
              <div className="flex gap-2">
                <button onClick={handleUndo} disabled={historyIndex <= 0} className="flex items-center gap-1.5 p-2 rounded-md bg-black/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><UndoIcon /> Undo</button>
                <button onClick={handleRedo} disabled={historyIndex >= editHistory.length - 1} className="flex items-center gap-1.5 p-2 rounded-md bg-black/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><RedoIcon /> Redo</button>
              </div>
               <button onClick={handleDownload} className="flex items-center gap-2 p-2 rounded-md bg-brand-primary hover:bg-brand-secondary font-semibold transition-colors"><DownloadIcon /> Download</button>
            </div>
          )}
          
          <h3 className="text-xl font-semibold mt-4 text-center">YouTube Search Preview</h3>
          <YoutubePreview title={selectedTitle} thumbnailBase64={generatedThumbnail} />
        </div>
      </div>
    </div>
  );
};
