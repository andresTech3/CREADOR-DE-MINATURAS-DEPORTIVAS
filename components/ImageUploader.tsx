import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils/imageUtils';

interface ImageUploaderProps {
  label: string;
  onImageSelect: (base64: string | null) => void;
  selectedImage: string | null;
  side: 'left' | 'right';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelect, selectedImage, side }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onImageSelect(base64);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const base64 = await fileToBase64(e.dataTransfer.files[0]);
      onImageSelect(base64);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const borderColor = isDragging ? 'border-yellow-400' : 'border-slate-700';
  const bgColor = isDragging ? 'bg-slate-800' : 'bg-slate-900';

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed ${borderColor} ${bgColor} rounded-xl transition-all cursor-pointer overflow-hidden group hover:border-slate-500`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      {selectedImage ? (
        <>
          <img 
            src={`data:image/png;base64,${selectedImage}`} 
            alt="Uploaded" 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
          />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-center font-bold uppercase tracking-wider text-sm ${side === 'left' ? 'text-blue-400' : 'text-red-400'}`}>
            {label}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-300 transition-colors p-4 text-center">
          <div className={`p-4 rounded-full bg-slate-800 mb-3 ${side === 'left' ? 'group-hover:bg-blue-900/30' : 'group-hover:bg-red-900/30'}`}>
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="font-medium text-sm">Click to upload {label}</p>
          <p className="text-xs opacity-60 mt-1">or drag & drop</p>
        </div>
      )}
    </div>
  );
};