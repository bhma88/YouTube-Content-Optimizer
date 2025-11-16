import React, { useState, useCallback, useRef } from 'react';
import { ImageData } from '../types';
import { UploadIcon, TrashIcon } from './icons/EditorIcons';

interface ImageUploaderProps {
  onFilesUploaded: (files: ImageData[]) => void;
  multiple: boolean;
  buttonText: string;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesUploaded, multiple, buttonText }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // FIX: Explicitly type `fileList` as `File[]` to ensure TypeScript correctly infers the type of `file`
    // in the loop below, resolving errors where `file` was treated as `unknown`.
    const fileList: File[] = Array.from(files);
    const imageDataArray: ImageData[] = [];
    const newPreviews: string[] = [];
    const newNames: string[] = [];
    
    for (const file of fileList) {
        if (file.type.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            imageDataArray.push({ base64, name: file.name });
            newPreviews.push(URL.createObjectURL(file));
            newNames.push(file.name);
        }
    }
    
    if (multiple) {
        setPreviews(prev => [...prev, ...newPreviews]);
        setImageNames(prev => [...prev, ...newNames]);
    } else {
        setPreviews(newPreviews);
        setImageNames(newNames);
    }

    onFilesUploaded(imageDataArray);
  }, [onFilesUploaded, multiple]);

  const handleRemoveImage = (index: number) => {
    // This is a simplified removal for UI only.
    // A full implementation would require lifting state up and managing the file list in the parent.
    // For this app's purpose, re-uploading is sufficient.
    setPreviews([]);
    setImageNames([]);
    onFilesUploaded([]);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 bg-brand-gray-dark border-2 border-dashed border-brand-gray-medium p-4 rounded-md text-gray-400 hover:bg-brand-gray-medium hover:text-white transition-colors"
      >
        <UploadIcon />
        {buttonText}
      </button>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <img src={src} alt={imageNames[index]} className="w-full h-20 object-cover rounded-md" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleRemoveImage(index)} className="text-white p-1 rounded-full bg-red-600 hover:bg-red-700">
                    <TrashIcon />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
