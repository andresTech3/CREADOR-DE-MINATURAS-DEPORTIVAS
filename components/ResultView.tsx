import React, { useState } from 'react';
import { Download, RefreshCw, Wand2, X } from 'lucide-react';
import { editImageWithFlash } from '../services/geminiService';

interface ResultViewProps {
  imageUrl: string;
  onClose: () => void;
  onRegenerate: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ imageUrl, onClose, onRegenerate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `vs-cover-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsLoadingEdit(true);
    try {
        const base64 = currentImageUrl.split(',')[1];
        const newImage = await editImageWithFlash(base64, editPrompt);
        setCurrentImageUrl(newImage);
        setEditPrompt('');
        setIsEditing(false);
    } catch (e) {
        alert("Failed to edit image. Try again.");
    } finally {
        setIsLoadingEdit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Area */}
        <div className="flex-1 bg-black flex items-center justify-center p-4 relative overflow-auto">
            {isLoadingEdit && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span className="text-yellow-400 font-bold tracking-widest animate-pulse">EDITING...</span>
                </div>
            )}
          <img 
            src={currentImageUrl} 
            alt="Generated VS Cover" 
            className="max-w-full max-h-full object-contain shadow-2xl" 
          />
        </div>

        {/* Sidebar Controls */}
        <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col p-6 gap-6 overflow-y-auto">
            <div>
                <h3 className="text-xl text-white font-bold display-font tracking-wide mb-1">Result Options</h3>
                <p className="text-slate-400 text-xs">Refine or save your creation.</p>
            </div>

            <button 
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
                <Download className="w-5 h-5" />
                Download
            </button>
            
            <div className="h-px bg-slate-800 my-2"></div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <label className="text-slate-300 text-sm font-medium uppercase tracking-wide">AI Magic Edit</label>
                
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700"
                    >
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        Refine with Text
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <textarea 
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder='e.g., "Add rain effect", "Make it retro"'
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-24"
                        />
                         <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleEdit}
                                disabled={!editPrompt.trim()}
                                className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase rounded-lg"
                            >
                                Apply
                            </button>
                        </div>
                         <p className="text-[10px] text-slate-500">Powered by Gemini 2.5 Flash Image</p>
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <button 
                    onClick={onRegenerate}
                    className="w-full py-3 px-4 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Original
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};