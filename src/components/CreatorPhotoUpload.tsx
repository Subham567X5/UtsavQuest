import React, { useState, useRef, useEffect } from 'react';
import { Trash2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Image, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadImageToImgBB } from '../utils/imageUpload';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('VITE_IMGBB_KEY') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (photo && !photo.startsWith('data:')) {
      setUrlInput(photo);
      setUrlStatus('ok');
    } else {
      setUrlInput('');
      setUrlStatus('idle');
    }
  }, [photo]);

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setUrlStatus('idle');
    setUrlError('');
    setUploadError('');
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

  const processFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setUploadError('');
      setShowKeyInput(false);
      setUrlInput('');
      setUrlStatus('idle');
      setUrlError('');
      onChange('');
      pendingFileRef.current = file;

      try {
        const url = await uploadImageToImgBB(file);
        onChange(url);
        setUrlInput(url);
        setUrlStatus('ok');
      } catch (err: any) {
        if (err.message === 'INVALID_KEY') {
          setUploadError('ImgBB API key is missing or invalid. Please provide a valid key:');
          setShowKeyInput(true);
        } else {
          setUploadError(err.message || 'আপলোড ব্যর্থ হয়েছে।');
        }
      } finally {
        setIsUploading(false);
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="space-y-3 font-sans">
      <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider text-left">
        Sister's Photograph — Upload or Web Link
      </label>

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-pink-500 bg-pink-500/10' 
            : 'border-white/10 bg-slate-800/30 hover:border-purple-500/40 hover:bg-slate-800/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 py-1">
            <RefreshCw className="w-5 h-5 text-pink-400 animate-spin" />
            <p className="text-xs font-bold text-purple-200">
              ছবি আপলোড হচ্ছে... (Uploading...)
            </p>
          </div>
        ) : (
          <div className="text-center space-y-1 py-1">
            <Camera className="w-6 h-6 text-pink-400 mx-auto animate-pulse" />
            <p className="text-xs font-bold text-slate-200">
              সরাসরি ছবি আপলোড করতে এখানে ক্লিক/ড্রপ করুন
            </p>
            <p className="text-[10px] text-slate-400">
              Click or drag here to upload from device
            </p>
          </div>
        )}
      </div>

      {/* Upload Error banner */}
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <p className="text-[10px] text-red-300 text-left leading-snug">
              {uploadError}{' '}
              {showKeyInput && (
                <a 
                  href="https://api.imgbb.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-pink-400 underline hover:text-pink-300"
                >
                  (Get free API Key here)
                </a>
              )}
            </p>
            <button 
              type="button" 
              onClick={() => {
                setUploadError('');
                setShowKeyInput(false);
              }}
              className="text-[9px] bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30 transition-colors shrink-0"
            >
              বন্ধ করুন
            </button>
          </div>
          {showKeyInput && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste ImgBB API Key here"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!tempKey.trim()) return;
                  setIsUploading(true);
                  setUploadError('');
                  try {
                    if (pendingFileRef.current) {
                      const url = await uploadImageToImgBB(pendingFileRef.current, tempKey.trim());
                      onChange(url);
                      setUrlInput(url);
                      setUrlStatus('ok');
                      setShowKeyInput(false);
                    }
                  } catch (err: any) {
                    setUploadError(err.originalMessage || err.message || 'আপলোড ব্যর্থ হয়েছে।');
                  } finally {
                    setIsUploading(false);
                  }
                }}
                className="bg-pink-500 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-pink-600 transition-colors shrink-0"
              >
                সংরক্ষণ ও পুনরায় চেষ্টা
              </button>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-2 my-2 text-[10px] text-slate-500 font-bold justify-center">
        <span className="h-px bg-white/5 flex-1" />
        <span>অথবা ছবির URL দিন (OR PASTE URL)</span>
        <span className="h-px bg-white/5 flex-1" />
      </div>

      {/* URL Input */}
      <div className="relative">
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="ছবির direct link paste করো (.jpg / .png / .webp)"
          className={`w-full bg-black/40 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 font-sans transition-all ${
            urlStatus === 'ok' ? 'border-green-500/60 focus:ring-green-500' :
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
            {urlStatus === 'ok' && (
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
            className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3"
          >
            <img src={photo} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-1 text-left">
              <p className="text-[11px] font-bold text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ছবি successfully load হয়েছে!
              </p>
              <p className="text-[10px] text-green-300/70 mt-0.5">Sister এই ছবি link-এ দেখতে পাবে। ✅</p>
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
