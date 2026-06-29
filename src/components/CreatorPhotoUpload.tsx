import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, Link2, Sparkles, FileImage, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreatorPhotoUploadProps {
  photo: string;
  onChange: (photo: string) => void;
}

// Validate and test if a given URL loads as an image
function testImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.referrerPolicy = 'no-referrer';
    img.src = url;
    setTimeout(() => resolve(false), 8000); // 8s timeout
  });
}

// Try to convert known page-links to direct image links
function tryConvertToDirectUrl(url: string): string {
  // ImgBB page link: https://ibb.co/XXXXX → can't reliably convert without API
  // ImgBB viewer link: https://imgbb.com/... → same
  // Pinterest: various gallery pages
  // Google Photos share link needs conversion
  // Return as-is; we rely on image load test instead
  return url.trim();
}

export default function CreatorPhotoUpload({ photo, onChange }: CreatorPhotoUploadProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(
    photo.startsWith('data:') || !photo ? 'file' : 'url'
  );
  const [dragActive, setDragActive] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [urlInput, setUrlInput] = useState(photo.startsWith('data:') ? '' : photo);
  const [urlStatus, setUrlStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [urlError, setUrlError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When photo prop changes from outside, sync urlInput
  useEffect(() => {
    if (!photo.startsWith('data:') && photo) {
      setUrlInput(photo);
    }
  }, [photo]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
    if (e.target.files && e.target.files[0]) compressAndLoadFile(e.target.files[0]);
  };

  const compressAndLoadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max_width = 150;
        const max_height = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > max_width) { height = Math.round((height * max_width) / width); width = max_width; }
        } else {
          if (height > max_height) { width = Math.round((width * max_height) / height); height = max_height; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
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
    setUrlInput('');
    setUrlStatus('idle');
    setUrlError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    setUrlStatus('idle');
    setUrlError('');
    onChange(''); // clear until validated

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) return;

    debounceRef.current = setTimeout(async () => {
      const converted = tryConvertToDirectUrl(val);
      setUrlStatus('testing');

      // Detect known page-link patterns that won't work as direct images
      const isImgBBPage = /^https?:\/\/(www\.)?ibb\.co\/[a-zA-Z0-9]+\/?$/.test(converted) && !converted.includes('i.ibb.co');
      const isPinterestPage = /^https?:\/\/(www\.)?pinterest\.com\/pin\//i.test(converted);
      const isGoogleDriveFile = /^https?:\/\/drive\.google\.com\/file\//i.test(converted);

      if (isImgBBPage) {
        setUrlStatus('error');
        setUrlError('This is an ImgBB page link — not a direct image. On ImgBB, right-click your image → "Open image in new tab" and copy THAT URL (starts with i.ibb.co).');
        return;
      }
      if (isPinterestPage) {
        setUrlStatus('error');
        setUrlError('Pinterest page links don\'t work. Right-click the image on Pinterest → "Copy image address" to get the direct image URL.');
        return;
      }
      if (isGoogleDriveFile) {
        setUrlStatus('error');
        setUrlError('Google Drive file links don\'t work directly. Upload to Imgur.com instead and paste the direct image URL here.');
        return;
      }

      const ok = await testImageUrl(converted);
      if (ok) {
        setUrlStatus('ok');
        onChange(converted);
      } else {
        setUrlStatus('error');
        setUrlError('Could not load this image. Make sure it\'s a DIRECT image URL (ending in .jpg, .png, .webp, etc.) and not a webpage link.');
      }
    }, 800);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
          Sister's Photograph
        </label>
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${uploadMode === 'file' ? 'bg-pink-500 text-white shadow font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Upload className="w-2.5 h-2.5" /> File Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 ${uploadMode === 'url' ? 'bg-pink-500 text-white shadow font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
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
          className={`relative border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${dragActive ? 'border-pink-500 bg-pink-500/10' : photo ? 'border-white/10 bg-black/20' : 'border-white/15 bg-black/40 hover:border-white/25 hover:bg-black/30'}`}
        >
          {compressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="w-6 h-6 text-pink-400 animate-spin" />
              <span className="text-xs text-slate-400 font-bold animate-pulse">Compressing photo...</span>
            </div>
          ) : photo ? (
            <div className="flex items-center gap-4 w-full">
              <div className="w-16 h-20 rounded border border-white/10 bg-slate-900 shrink-0 overflow-hidden relative shadow-lg">
                <img src={photo} alt="Sister preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                    Upload to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline text-yellow-300 hover:text-white">Imgur.com</a>, copy the <strong>direct image URL</strong>, then switch to <strong>Web URL</strong> mode above.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
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
                  Processed locally in your browser — private & secure.
                </p>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-2">
          {/* URL Input with live status icon */}
          <div className="relative">
            <input
              type="text"
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="Paste a DIRECT image link ending in .jpg / .png / .webp"
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

          {/* Live image preview when OK */}
          <AnimatePresence>
            {urlStatus === 'ok' && photo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3"
              >
                <img src={photo} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-[11px] font-bold text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Image loaded successfully!
                  </p>
                  <p className="text-[10px] text-green-300/70 mt-0.5">Sister will see this photo in the link. ✅</p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-auto p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
                <p className="text-[10px] text-red-300 leading-snug">{urlError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guidance box */}
          {urlStatus === 'idle' && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 space-y-1.5">
              <p className="text-[10px] font-bold text-blue-300">💡 How to get a direct image URL:</p>
              <ul className="text-[10px] text-slate-400 space-y-1 leading-snug">
                <li>• <strong className="text-slate-300">Imgur:</strong> Go to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">imgur.com/upload</a> → upload → right-click image → "Copy image address"</li>
                <li>• <strong className="text-slate-300">ImgBB:</strong> After upload, on your image page → right-click the image → "Open in new tab" → copy URL from address bar (starts with <code className="text-pink-300">i.ibb.co</code>)</li>
                <li>• <strong className="text-slate-300">Google Photos:</strong> Share → create link → doesn't work. Use Imgur instead.</li>
                <li>• The URL must end in <code className="text-green-300">.jpg</code>, <code className="text-green-300">.png</code>, <code className="text-green-300">.webp</code> etc.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
