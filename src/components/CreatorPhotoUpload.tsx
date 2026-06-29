import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Link2, Sparkles, FileImage, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface CreatorPhotoUploadProps {
  photo: string;
  onChange: (photo: string) => void;
}

export default function CreatorPhotoUpload({ photo, onChange }: CreatorPhotoUploadProps) {
  // If the photo is a Base64 data URL, default to file mode; otherwise, if it exists, use URL mode
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(
    photo.startsWith('data:') || !photo ? 'file' : 'url'
  );
  const [dragActive, setDragActive] = useState(false);
  const [compressing, setCompressing] = useState(false);
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
      compressAndLoadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      compressAndLoadFile(e.target.files[0]);
    }
  };

  const compressAndLoadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max size for thumbnail to keep URL ultra short (fits perfectly in standard 2000-8000 chars url limits)
        const max_width = 150;
        const max_height = 200; // Polaroid-friendly aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > max_width) {
            height = Math.round((height * max_width) / width);
            width = max_width;
          }
        } else {
          if (height > max_height) {
            width = Math.round((width * max_height) / height);
            height = max_height;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill background white in case of transparent PNGs
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Compress as high-efficiency JPEG with 0.65 quality to save size while maintaining lovely look
          const base64 = canvas.toDataURL('image/jpeg', 0.65);
          onChange(base64);
        }
        setCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
          Sister's Photograph
        </label>
        
        {/* Toggle between Upload and URL modes */}
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              uploadMode === 'file' 
                ? 'bg-pink-500 text-white shadow font-extrabold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-2.5 h-2.5" /> File Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${
              uploadMode === 'url' 
                ? 'bg-pink-500 text-white shadow font-extrabold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-2.5 h-2.5" /> Web URL
          </button>
        </div>
      </div>

      {uploadMode === 'file' ? (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !photo && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${
            dragActive 
              ? 'border-pink-500 bg-pink-500/10' 
              : photo 
                ? 'border-white/10 bg-black/20' 
                : 'border-white/15 bg-black/40 hover:border-white/25 hover:bg-black/30'
          }`}
        >
          {compressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
              <span className="text-xs text-slate-400 font-bold animate-pulse">Compressing photo...</span>
            </div>
          ) : photo ? (
            <div className="flex items-center gap-4 w-full">
              {/* Thumbnail preview */}
              <div className="w-16 h-20 rounded border border-white/10 bg-slate-900 shrink-0 overflow-hidden relative shadow-lg">
                <img 
                  src={photo} 
                  alt="Sister preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-extrabold text-pink-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Photo added locally!
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-normal">
                  Preview only — this device can see it.
                </p>
                <div className="mt-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-2 py-1.5">
                  <p className="text-[10px] text-yellow-400 font-bold leading-snug">
                    ⚠️ Sister won't see this photo in the link!
                  </p>
                  <p className="text-[10px] text-yellow-300/70 leading-snug mt-0.5">
                    Upload the photo to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline text-yellow-300 hover:text-white">Imgur.com</a>, copy the direct image link, then switch to <strong>Web URL</strong> mode above.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 py-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">
                  Drag & drop her photo here or <span className="text-pink-400 hover:underline">Browse file</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal max-w-xs mx-auto">
                  Images are processed locally inside your browser—no servers, 100% private and portable!
                </p>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <input
            type="text"
            value={photo.startsWith('data:') ? '' : photo}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste a direct image link (e.g., from Imgur, Pinterest, Facebook, etc.)"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-sans transition-all"
          />
          <p className="text-[10px] text-slate-500 leading-normal">
            💡 Direct link to her photo if you already have it hosted online.
          </p>
        </div>
      )}
    </div>
  );
}
