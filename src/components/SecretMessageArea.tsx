import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Lock, Unlock, Sparkles, Heart } from 'lucide-react';

interface SecretMessageAreaProps {
  secretMessage: string;
  relation: string;
  playSuccess: () => void;
  playSparkle: () => void;
  lang?: 'en' | 'bn';
}

export default function SecretMessageArea({
  secretMessage,
  relation,
  playSuccess,
  playSparkle,
  lang = 'bn'
}: SecretMessageAreaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen || isRevealing) return;
    setIsRevealing(true);
    playSparkle();

    setTimeout(() => {
      setIsOpen(true);
      setIsRevealing(false);
      playSuccess();
    }, 1200);
  };

  const handleCloseEnvelope = () => {
    setIsOpen(false);
    playSparkle();
  };

  return (
    <div className="w-full max-w-sm mx-auto my-4 font-sans select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed Envelope Mode */
          <motion.div
            key="sealed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={handleOpenEnvelope}
            className="cursor-pointer group relative bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-2 border-amber-300 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center min-h-[160px]"
          >
            {/* Background envelope folds */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-amber-400/30" />
            <div className="absolute -inset-1 bg-[linear-gradient(45deg,rgba(180,83,9,0.03)_25%,transparent_25%,transparent_50%,rgba(180,83,9,0.03)_50%,rgba(180,83,9,0.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-60" />

            {/* Glowing sparkle under seal */}
            <div className="absolute w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

            {/* Wax Seal / Heart Button */}
            <motion.div
              animate={isRevealing ? { scale: [1, 1.2, 0.9, 1.3], rotate: [0, 15, -15, 0] } : {}}
              transition={{ repeat: isRevealing ? Infinity : 0, duration: 0.6 }}
              className="relative w-16 h-16 bg-gradient-to-br from-red-600 via-rose-600 to-red-800 rounded-full flex items-center justify-center shadow-lg border border-red-500 z-10"
            >
              <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              {/* Seal Ring */}
              <div className="absolute inset-1.5 border-2 border-dashed border-white/20 rounded-full" />
              
              {/* Small Lock overlay */}
              <div className="absolute -bottom-1 -right-1 bg-amber-500 border border-amber-600 p-1 rounded-full shadow">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </motion.div>

            {/* Labels */}
            <div className="mt-4 space-y-1 relative z-10">
              <span className="block text-xs font-black text-amber-900 uppercase tracking-widest font-sans">
                {lang === 'bn' ? '🤫 গোপন চিঠি আপনার জন্য' : '🤫 Secret Message for You'}
              </span>
              <span className="block text-[11px] text-amber-700/80 font-bold font-sans">
                {isRevealing 
                  ? (lang === 'bn' ? "মোমের সিল খোলা হচ্ছে... 💌" : "Breaking Wax Seal... 💌") 
                  : (lang === 'bn' ? "গোপন বার্তাটি পড়তে এখানে চাপুন 🤫" : "Click here to read the secret message 🤫")}
              </span>
            </div>

            {/* Interactive hover ribbon effect */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                {lang === 'bn' ? 'উন্মোচন করতে চাপুন' : 'Tap to Unveil'}
              </span>
            </div>
          </motion.div>
        ) : (
          /* Opened Envelope Letter Mode */
          <motion.div
            key="opened"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white border border-purple-500/30 p-6 rounded-2xl shadow-2xl overflow-hidden text-center"
          >
            {/* Shimmer background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5" />
            
            {/* Corner Flowers */}
            <div className="absolute top-2 left-2 text-pink-500/30 font-mono text-xs">❀</div>
            <div className="absolute top-2 right-2 text-pink-500/30 font-mono text-xs">❀</div>
            <div className="absolute bottom-2 left-2 text-pink-500/30 font-mono text-xs">❀</div>
            <div className="absolute bottom-2 right-2 text-pink-500/30 font-mono text-xs">❀</div>

            {/* Header */}
            <div className="flex items-center justify-center gap-1.5 mb-3 border-b border-purple-500/20 pb-2">
              <Unlock className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-widest text-pink-300 uppercase">
                {lang === 'bn' ? 'উন্মোচিত গোপন চিঠি' : 'Opened Secret Letter'}
              </span>
            </div>

            {/* Secret Message content */}
            <div className="py-4 px-1 min-h-[60px] flex items-center justify-center">
              <p className="text-sm sm:text-base text-yellow-100 font-serif leading-relaxed italic whitespace-pre-line text-justify hyphens-auto">
                "{secretMessage}"
              </p>
            </div>

            {/* Decoration */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[0.5px] bg-purple-500/30 w-12" />
              <Sparkles className="text-yellow-400 w-4 h-4 animate-spin-slow" />
              <div className="h-[0.5px] bg-purple-500/30 w-12" />
            </div>

            {/* Close back button */}
            <button
              onClick={handleCloseEnvelope}
              className="text-[10px] text-purple-300 hover:text-white font-bold bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/20 px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider"
            >
              {lang === 'bn' ? '🤫 গোপন চিঠিটি আবার বন্ধ করুন' : '🤫 Reseal Message'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
