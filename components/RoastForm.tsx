import React, { useState, useRef } from 'react';
import { RoastRequest } from '../types';

interface RoastFormProps {
  onSubmit: (data: RoastRequest) => void;
  isLoading: boolean;
}

export const RoastForm: React.FC<RoastFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.type.startsWith('image/')) {
      setFile(f);
    } else {
      alert("Images only. We can't roast a PDF.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    onSubmit({ image: file, url });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-mono text-gray-400 uppercase tracking-widest">
          Website URL (Optional context)
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://my-shameful-startup.com"
          className="w-full bg-dark border border-border text-white p-4 font-mono focus:border-danger focus:ring-1 focus:ring-danger outline-none transition-all placeholder-gray-700"
        />
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer group
          ${dragActive ? 'border-danger bg-danger/5' : 'border-border hover:border-gray-500'}
          ${file ? 'border-solid border-green-500/50 bg-green-900/10' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleChange}
        />
        
        {file ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <p className="font-mono text-green-400">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">Ready to be destroyed.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pointer-events-none">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div>
              <p className="font-mono text-gray-300">Drop a screenshot here</p>
              <p className="text-xs text-gray-600 mt-2">or click to browse your hard drive of shame</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!file || isLoading}
        className={`
          w-full py-5 px-8 text-lg font-black uppercase tracking-widest transition-all clip-path-slant
          ${!file 
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
            : isLoading 
              ? 'bg-danger/50 text-white cursor-wait' 
              : 'bg-danger text-black hover:bg-red-500 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,42,0,0.5)]'
          }
        `}
      >
        {isLoading ? 'Consulting the Oracle of Hate...' : 'ROAST MY SITE'}
      </button>
    </form>
  );
};