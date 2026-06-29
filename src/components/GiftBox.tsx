import { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, Heart } from 'lucide-react';
import { translations } from '../utils/translations';

interface GiftBoxProps {
  onUnwrap: () => void;
  playSparkle: () => void;
  playSuccess: () => void;
  lang?: 'en' | 'bn';
  relation?: string;
}

export default function GiftBox({ 
  onUnwrap, 
  playSparkle, 
  playSuccess, 
  lang = 'bn', 
  relation = 'sister' 
}: GiftBoxProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const t = translations[lang];

  const handleOpen = () => {
    if (isOpened) return;
    
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    playSparkle();

    if (nextCount >= 3) {
      setIsOpened(true);
      playSuccess();
      setTimeout(() => {
        onUnwrap();
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
      >
        {/* Sparkly background dust */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-amber-500/10 -z-10" />

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-sans flex items-center justify-center gap-2">
          {lang === 'bn' 
            ? `${relation}-এর বার্থডে সারপ্রাইজ! ` 
            : `${relation ? relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase() : 'Celebrant'}'s Birthday Surprise! `}
          <Sparkles className="text-yellow-300 animate-pulse w-6 h-6 shrink-0" />
        </h1>
        <p className="text-purple-200 text-sm mb-8 font-sans leading-relaxed">
          {t.giftDesc}
        </p>

        {/* Gift Box Container */}
        <div className="relative w-64 h-64 mx-auto my-10 flex items-center justify-center cursor-pointer" onClick={handleOpen}>
          {/* Confetti / Burst elements on click */}
          {clickCount > 0 && !isOpened && (
            <motion.div 
              key={clickCount}
              className="absolute pointer-events-none"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-2">
                <Heart className="text-pink-400 fill-pink-400 w-8 h-8" />
                <Sparkles className="text-yellow-300 w-8 h-8" />
                <Heart className="text-purple-400 fill-purple-400 w-8 h-8" />
              </div>
            </motion.div>
          )}

          {/* Interactive SVG / CSS Gift Box */}
          <motion.div
            className="w-48 h-48 relative flex items-center justify-center"
            animate={
              isOpened
                ? { scale: [1, 1.2, 0.9, 0], rotate: [0, 10, -10, 0] }
                : {
                    rotate: clickCount > 0 ? [0, -15, 15, -10, 10, 0] : [0, 2, -2, 2, 0],
                    scale: clickCount > 0 ? [1, 1.08, 0.95, 1] : 1
                  }
            }
            transition={{
              duration: isOpened ? 1.2 : 0.5,
              repeat: isOpened ? 0 : (clickCount > 0 ? 0 : Infinity),
              repeatDelay: 2
            }}
          >
            {/* Box Lid */}
            <motion.div 
              className="absolute top-4 w-44 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-md z-20 flex justify-center"
              animate={isOpened ? { y: -120, x: 50, rotate: 45, opacity: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Lid Ribbon Knot */}
              <div className="absolute -top-6 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-amber-300">
                <div className="w-10 h-10 bg-amber-500 rounded-full border border-amber-400" />
              </div>
              <div className="absolute -top-3 left-10 w-8 h-6 bg-amber-400 rounded-full transform -rotate-45" />
              <div className="absolute -top-3 right-10 w-8 h-6 bg-amber-400 rounded-full transform rotate-45" />
            </motion.div>

            {/* Lid Stripe vertical */}
            <div className="absolute top-4 w-6 h-12 bg-amber-400 z-21" />

            {/* Box Body */}
            <div className="absolute bottom-4 w-40 h-32 bg-gradient-to-r from-purple-700 to-pink-600 rounded-b-xl shadow-lg border-t-2 border-purple-500 flex items-center justify-center overflow-hidden z-10">
              {/* Vertical Ribbon Stripe */}
              <div className="absolute top-0 bottom-0 w-6 bg-amber-400 left-1/2 transform -translate-x-1/2" />
              {/* Horizontal Ribbon Stripe */}
              <div className="absolute left-0 right-0 h-6 bg-amber-400 top-1/2 transform -translate-y-1/2" />

              {/* Glowing core */}
              <div className="absolute inset-0 bg-radial-gradient from-white/30 to-transparent animate-pulse pointer-events-none" />

              {/* Sparkle icons embedded */}
              <Sparkles className="absolute text-yellow-300/30 w-12 h-12 top-4 left-4" />
              <Heart className="absolute text-pink-300/30 w-10 h-10 bottom-4 right-4 fill-pink-300/10" />
            </div>
          </motion.div>
        </div>

        {/* Clicks tracker / Tap feedback */}
        <div className="mt-4">
          <p className="text-xs text-purple-300 uppercase font-mono tracking-wider mb-2">
            {!isOpened 
              ? (lang === 'bn' ? `ট্যাপ পাওয়ার: ${clickCount} / ৩` : `Tap power: ${clickCount} / 3`) 
              : (lang === 'bn' ? "জাদু উন্মোচন হচ্ছে..." : "Unwrapping Magic...")}
          </p>
          <div className="w-48 h-2.5 bg-black/30 rounded-full mx-auto overflow-hidden border border-white/10 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (clickCount / 3) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Sweet instruction label */}
        <motion.div 
          className="mt-6 text-sm text-amber-200 font-sans italic"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {clickCount === 0 
            ? (lang === 'bn' ? "👉 উপহার বাক্সে ক্লিক বা স্পর্শ করুন! 👈" : "👉 Click the gift box! 👈") 
            : clickCount === 1 
              ? (lang === 'bn' ? "চলতে থাকুন! 🎁" : "Keep going! 🎁") 
              : clickCount === 2 
                ? (lang === 'bn' ? "আর মাত্র একটি ট্যাপ! ✨" : "One more tap! ✨") 
                : (lang === 'bn' ? "দারুণ! 🎉" : "Yay! 🎉")}
        </motion.div>
      </motion.div>
    </div>
  );
}
