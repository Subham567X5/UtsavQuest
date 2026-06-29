import React, { useState, useRef, useEffect } from 'react';
import { Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Image, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { compressImage } from '../utils/imageCompressor';

interface CreatorPhotoUploadProps {
  photo: string;
  onChange: (photo: string) => void;
}

function testImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.referrerPolicy = 'no-referrer';
    img.src = url;
    setTimeout(() => resolve(false), 8000);
  });
}

export default function CreatorPhotoUpload({ photo, onChange }: CreatorPhotoUploadProps) {
  const [urlInput, setUrlInput] = useState(photo.startsWith('data:') ? '' : photo);
  const [urlStatus, setUrlStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [urlError, setUrlError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (photo) {
      if (!photo.startsWith('data:')) {
        setUrlInput(photo);
      }
      setUrlStatus('ok');
    } else {
      setUrlStatus('idle');
    }
  }, [photo]);

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setUrlStatus('idle');
    setUrlError('');
  };

  const processFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        setCompressing(true);
        setUrlError('');
        const compressedBase64 = await compressImage(file);
        onChange(compressedBase64);
        setUrlStatus('ok');
        setUrlInput(''); // Clear URL input when local file is loaded
      } catch (err) {
        console.error("Compression failed:", err);
        setUrlStatus('error');
        setUrlError('ছবি প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      } finally {
        setCompressing(false);
      }
    }
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    setUrlStatus('idle');
    setUrlError('');
    onChange('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) return;

    debounceRef.current = setTimeout(async () => {
      const url = val.trim();
      setUrlStatus('testing');

      const isImgBBPage = /^https?:\/\/(www\.)?ibb\.co\/[a-zA-Z0-9]+\/?$/.test(url) && !url.includes('i.ibb.co');
      const isPinterestPage = /^https?:\/\/(www\.)?pinterest\.com\/pin\//i.test(url);
      const isGoogleDriveFile = /^https?:\/\/drive\.google\.com\/file\//i.test(url);

      if (isImgBBPage) {
        setUrlStatus('error');
        setUrlError('এটা ImgBB-এর page link — direct image নয়। imgbb.com-এ upload করে ছবিতে right-click → "Open image in new tab" করো, সেই URL-টা (i.ibb.co দিয়ে শুরু) copy করো।');
        return;
      }
      if (isPinterestPage) {
        setUrlStatus('error');
        setUrlError('Pinterest page link কাজ করে না। Pinterest-এ ছবিতে right-click → "Copy image address" দিয়ে direct link নাও।');
        return;
      }
      if (isGoogleDriveFile) {
        setUrlStatus('error');
        setUrlError('Google Drive link সরাসরি কাজ করে না। postimages.org বা imgbb.com-এ upload করো।');
        return;
      }

      const ok = await testImageUrl(url);
      if (ok) {
        setUrlStatus('ok');
        onChange(url);
      } else {
        setUrlStatus('error');
        setUrlError('এই link থেকে ছবি load হচ্ছে না। নিশ্চিত করো URL টা direct image link (.jpg/.png/.webp দিয়ে শেষ) — webpage link নয়।');
      }
    }, 800);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans text-left">
        Sister's Photograph — ছবি যোগ করো
      </label>

      {/* Quick Uploader Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
          dragActive 
            ? 'border-pink-500 bg-pink-500/10' 
            : 'border-white/10 hover:border-pink-500/40 bg-black/20 hover:bg-black/40'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {compressing ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
            <p className="text-xs font-bold text-purple-200">ছবি প্রসেস হচ্ছে...</p>
            <p className="text-[10px] text-slate-500">অপেক্ষা করো, সাইজ ছোট করা হচ্ছে</p>
          </div>
        ) : photo && photo.startsWith('data:') ? (
          <div className="flex flex-col items-center gap-1.5 py-1 text-center font-sans">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <p className="text-xs font-bold text-green-400">ছবি আপলোড সফল! (লোকাল ফাইল)</p>
            <p className="text-[10px] text-slate-400">কম্প্রেসড ছবি যুক্ত হয়েছে যা লিংকের সাথে শেয়ার হবে ✅</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="mt-1.5 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] hover:bg-red-500/30 transition-colors font-bold"
            >
              ছবি মুছে ফেলুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-center font-sans">
            <Upload className="w-6 h-6 text-pink-400 animate-pulse mb-1" />
            <p className="text-xs font-bold text-slate-300">ডিভাইস থেকে সরাসরি ছবি আপলোড করো</p>
            <p className="text-[10px] text-slate-500">এখানে ক্লিক করো অথবা ফাইলটি ড্র্যাগ অ্যান্ড ড্রপ করো (Quick & Offline!)</p>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest my-2 select-none">
        <div className="h-[1px] bg-white/5 flex-grow" />
        <span>অথবা direct link ব্যবহার করো</span>
        <div className="h-[1px] bg-white/5 flex-grow" />
      </div>

      {/* URL Input */}
      <div className="relative">
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="ছবির direct link paste করো (.jpg / .png / .webp)"
          className={`w-full bg-black/40 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 font-sans transition-all ${
            urlStatus === 'ok' && !photo.startsWith('data:') ? 'border-green-500/60 focus:ring-green-500' :
            urlStatus === 'error' ? 'border-red-500/60 focus:ring-red-500' :
            'border-white/10 focus:ring-pink-500'
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {urlStatus === 'testing' && (
              <motion.div key="testing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RefreshCw className="w-4 h-4 text-pink-400 animate-spin" />
              </motion.div>
            )}
            {urlStatus === 'ok' && !photo.startsWith('data:') && (
              <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
            {urlStatus === 'error' && (
              <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
                <XCircle className="w-4 h-4 text-red-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success preview */}
      <AnimatePresence>
        {urlStatus === 'ok' && photo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3 animate-fade-in"
          >
            <img src={photo} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-1 text-left">
              <p className="text-[11px] font-bold text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ছবি successfully load হয়েছে!
              </p>
              <p className="text-[10px] text-green-300/70 mt-0.5">
                {photo.startsWith('data:') 
                  ? 'কম্প্রেসড লোকাল ইমেজ (লিংক শেয়ার করলে সচল থাকবে)।' 
                  : 'Direct URL লিঙ্ক দিয়ে যুক্ত করা ইমেজ।'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {urlStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-300 leading-snug text-left">{urlError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guidance */}
      {urlStatus === 'idle' && !urlInput && (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-pink-400" /> Direct image link কীভাবে পাবে:
          </p>
          <ul className="text-[10px] text-slate-400 space-y-1 leading-snug text-left">
            <li>✅ <a
              href="https://postimages.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#86efac', textDecoration: 'underline', cursor: 'pointer', pointerEvents: 'auto' }}
              className="font-bold hover:opacity-80 transition-opacity"
            >postimages.org</a> → upload → "Direct link" copy করো</li>
            <li>✅ <a
              href="https://imgbb.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e2e8f0', textDecoration: 'underline', cursor: 'pointer', pointerEvents: 'auto' }}
              className="font-bold hover:opacity-80 transition-opacity"
            >imgbb.com</a> → upload → ছবিতে right-click → "Open in new tab" → URL copy</li>
            <li className="text-yellow-400/80">⚠️ URL-এর শেষে .jpg / .png / .webp থাকতে হবে</li>
          </ul>
        </div>
      )}
    </div>
  );
}
