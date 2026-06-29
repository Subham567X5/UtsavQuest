import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PolaroidUploadProps {
  onImageLoaded: (url: string) => void;
  savedUrl?: string;
  recipientMode?: boolean;
  relationLabel?: string;
  lang?: 'en' | 'bn';
}

export default function PolaroidUpload({ 
  onImageLoaded, 
  savedUrl, 
  recipientMode = false, 
  relationLabel = 'Sister',
  lang = 'bn'
}: PolaroidUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    if (recipientMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (recipientMode) return;
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageLoaded(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (recipientMode) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (recipientMode) return;
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (recipientMode) return;
    fileInputRef.current?.click();
  };

  // Human relation label helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const formattedRelation = capitalize(relationLabel);

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      {/* Casing Frame: Polaroid style */}
      <motion.div
        initial={{ rotate: -5, scale: 0.9, y: 15, opacity: 0 }}
        animate={{ rotate: -3, scale: 0.95, y: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 1.2, bounce: 0.3 }}
        whileHover={recipientMode ? { rotate: -1, scale: 1.01 } : { rotate: 0, scale: 1.02 }}
        className="bg-white p-4 pb-12 rounded-lg shadow-2xl border border-gray-100 max-w-[280px] w-full relative group transform transition-transform duration-300"
      >
        {/* Golden Clip or Pushpin holding the Polaroid */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-amber-200 rounded-full shadow border border-yellow-300 flex items-center justify-center">
            <div className="w-3 h-3 bg-red-600 rounded-full shadow-inner" />
          </div>
          <div className="w-0.5 h-3 bg-gray-400/80 -mt-1" />
        </div>

        {/* Polaroid Inner Photo Container */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative aspect-[3/4] bg-neutral-900 border border-neutral-800 rounded overflow-hidden flex flex-col items-center justify-center transition-all ${dragActive && !recipientMode ? 'ring-4 ring-pink-400 ring-offset-2' : ''}`}
        >
          {savedUrl ? (
            <>
              {/* Actual photo loaded by client */}
              <img 
                src={savedUrl} 
                alt="Birthday Celebrant" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Replace trigger overlay on hover (only if NOT in recipient mode) */}
              {!recipientMode && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer" onClick={onButtonClick}>
                  <RefreshCw className="text-white w-8 h-8 mb-2 animate-spin-slow" />
                  <span className="text-white text-xs font-bold font-sans">
                    {lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Photograph'}
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Custom highly-polished fallback illustration of a sweet sister */
            <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-pink-900/40 to-indigo-950 flex flex-col items-center justify-between p-4 relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <Sparkles className="text-yellow-300 w-4 h-4 animate-pulse" />
              </div>

              {/* Custom SVG Portrait */}
              <div className="w-full flex justify-center items-center flex-1">
                <svg className="w-40 h-40 drop-shadow-lg" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbcfe8" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                    <linearGradient id="sareeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#f3f4f6" />
                      <stop offset="100%" stopColor="#e5e7eb" />
                    </linearGradient>
                  </defs>
                  {/* Outer glowing halo */}
                  <circle cx="60" cy="55" r="38" fill="rgba(236, 72, 153, 0.15)" />
                  <circle cx="60" cy="55" r="30" fill="rgba(168, 85, 247, 0.1)" />

                  {/* Dark long hair background */}
                  <path d="M 32,55 C 30,22 90,22 88,55 C 88,85 85,98 85,98 L 35,98 C 35,98 32,85 32,55 Z" fill="#111827" />

                  {/* Neck */}
                  <rect x="54" y="65" width="12" height="15" rx="3" fill="#fed7aa" />

                  {/* Face */}
                  <ellipse cx="60" cy="52" rx="18" ry="21" fill="#ffedd5" />

                  {/* Hair Front Bangs */}
                  <path d="M 42,42 C 45,34 55,36 60,40 C 65,36 75,34 78,42 C 81,46 79,50 79,50 L 41,50 C 41,50 39,46 42,42 Z" fill="#111827" />

                  {/* Cute Bindi on Forehead */}
                  <circle cx="60" cy="45" r="2" fill="#dc2626" />

                  {/* Smile */}
                  <path d="M 54,60 Q 60,65 66,60" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Eyes */}
                  <circle cx="53" cy="51" r="2" fill="#1f2937" />
                  <circle cx="67" cy="51" r="2" fill="#1f2937" />
                  <path d="M 50,48 Q 53,46 56,48" fill="none" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 64,48 Q 67,46 70,48" fill="none" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Traditional Jhumka Earrings */}
                  <path d="M 41,56 L 41,62 L 38,65 L 44,65 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
                  <path d="M 79,56 L 79,62 L 76,65 L 82,65 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

                  {/* Traditional Lal Par Sada Saree draping */}
                  {/* Blouse (Red) */}
                  <path d="M 38,78 C 38,78 45,72 60,74 C 75,72 82,78 82,78 L 82,105 L 38,105 Z" fill="#dc2626" />
                  
                  {/* White Saree Base */}
                  <path d="M 42,85 C 48,82 72,82 78,85 L 86,110 L 34,110 Z" fill="url(#sareeGrad)" />
                  
                  {/* Red Border Saree drape (Lal Par) */}
                  <path d="M 42,85 C 50,85 54,100 58,110 L 46,110 Z" fill="#dc2626" />
                  <path d="M 78,85 C 70,85 66,100 62,110 L 74,110 Z" fill="#dc2626" />
                  
                  {/* Gold border piping */}
                  <path d="M 42,85 C 50,85 54,100 58,110" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
                  <path d="M 78,85 C 70,85 66,100 62,110" fill="none" stroke="#fbbf24" strokeWidth="0.8" />

                  {/* Traditional gold necklace */}
                  <path d="M 50,68 Q 60,74 70,68" fill="none" stroke="#fbbf24" strokeWidth="2" />
                </svg>
              </div>

              {/* Upload CTA block (Hide completely if in recipientMode) */}
              {!recipientMode ? (
                <div 
                  onClick={onButtonClick}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 z-10"
                >
                  <Camera className="text-pink-300 w-4 h-4 animate-pulse" />
                  <span className="text-[10px] text-purple-100 font-bold tracking-tight font-sans">
                    {lang === 'bn' ? 'এখানে তার ছবি ড্রপ/আপলোড করুন!' : 'Drop/Upload Her Photo Here!'}
                  </span>
                </div>
              ) : (
                <div className="text-center pb-1 text-[10px] text-purple-200 font-bold font-sans flex items-center gap-1">
                  <Sparkles className="text-yellow-400 w-3 h-3 animate-spin" /> {lang === 'bn' ? 'বিশেষ করে তোমার জন্য! ✨' : 'Especially For You!'}
                </div>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Cursive text decoration on Polaroid card margin */}
        <div className="text-center mt-3 flex flex-col items-center">
          <p className="font-serif text-sm italic font-extrabold text-neutral-800 leading-none select-none tracking-wide">
            {lang === 'bn' 
              ? `আমাদের মিষ্টি ${relationLabel.toLowerCase() === 'sister' ? 'বোন' : relationLabel} 💜` 
              : `Our Sweet ${formattedRelation} 💜`}
          </p>
          <p className="text-[9px] text-gray-400 font-sans tracking-widest mt-1 select-none uppercase">
            {recipientMode 
              ? (lang === 'bn' ? 'শুভ জন্মদিন! 🎉' : 'Happy Birthday! 🎉') 
              : savedUrl 
                ? (lang === 'bn' ? 'ছবি লোড হয়েছে' : 'LOADED LOCALLY') 
                : (lang === 'bn' ? 'ছবি যোগ করতে এখানে ক্লিক করুন' : 'CLICK TO ADD REAL PHOTO')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
