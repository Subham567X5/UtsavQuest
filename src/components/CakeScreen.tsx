import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

interface CakeScreenProps {
  onComplete: () => void;
  playSparkle: () => void;
  playSuccess: () => void;
  playBdaySong: () => void;
  stopBdaySong: () => void;
  lang?: 'en' | 'bn';
}

export default function CakeScreen({ 
  onComplete, 
  playSparkle, 
  playSuccess,
  playBdaySong,
  stopBdaySong,
  lang = 'bn'
}: CakeScreenProps) {
  const [litCandles, setLitCandles] = useState<boolean[]>([false, false, false, false, false]);
  const [isBlown, setIsBlown] = useState(false);
  const [showWishMessage, setShowWishMessage] = useState(false);
  
  // Cake cutting states
  const [showCutInterface, setShowCutInterface] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [isCuttingActive, setIsCuttingActive] = useState(false);

  useEffect(() => {
    // Automatically play Happy Birthday song when the Cake page opens
    playBdaySong();
    return () => {
      stopBdaySong();
    };
  }, []);

  const toggleCandle = (index: number) => {
    if (isBlown) return;
    if (litCandles[index]) return; // Once lit, stays lit for now

    const nextLit = [...litCandles];
    nextLit[index] = true;
    setLitCandles(nextLit);
    playSparkle();

    // If all are lit, trigger wish mode
    if (nextLit.every(candle => candle)) {
      setTimeout(() => {
        setShowWishMessage(true);
      }, 500);
    }
  };

  const handleBlow = () => {
    setIsBlown(true);
    playSuccess();
    // Transition to the Cake Cutting screen after blowing candles
    setTimeout(() => {
      setShowCutInterface(true);
    }, 1800);
  };

  const handleCutCake = () => {
    if (isCut || isCuttingActive) return;
    setIsCuttingActive(true);
    playSparkle();

    // Animate slicing action, then trigger slice separation
    setTimeout(() => {
      setIsCut(true);
      setIsCuttingActive(false);
      playSuccess();
    }, 1000);
  };

  const allLit = litCandles.every(candle => candle);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-amber-500/10 -z-10 rounded-3xl" />

        <AnimatePresence mode="wait">
          {!showCutInterface ? (
            /* PHASE 1 & 2: LIGHTING CANDLES & BLOWING WISH */
            <motion.div
              key="lighting-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 font-sans flex items-center justify-center gap-2">
                {lang === 'bn' ? 'ধাপ ২: জন্মদিনের কেক মোমবাতি জ্বালান! 🎂' : 'Step 2: Light the Birthday Cake! 🎂'}
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm mb-6 font-sans">
                {!allLit 
                  ? (lang === 'bn' ? '৫টি মোমবাতির প্রতিটিতে ক্লিক বা স্পর্শ করে সেগুলো জ্বালিয়ে দিন!' : 'Tap on each of the 5 candles to light them up!') 
                  : (lang === 'bn' ? 'সব মোমবাতি জ্বলে উঠেছে! চোখ বন্ধ করো এবং মনের সবচেয়ে মিষ্টি ইচ্ছেটা ভাবো!' : 'All candles are lit! Close your eyes and make a beautiful wish!')}
              </p>

              {/* Cake Container */}
              <div className="relative h-60 w-full flex flex-col justify-end items-center mb-6">
                
                {/* Candles */}
                <div className="flex justify-between w-48 px-4 absolute bottom-28 z-20">
                  {litCandles.map((isLit, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-110 ${isLit ? '' : 'animate-bounce'}`}
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: '2s' }}
                      onClick={() => toggleCandle(i)}
                    >
                      {/* Flame */}
                      <div className="h-8 w-4 relative flex items-end justify-center">
                        <AnimatePresence>
                          {isLit && !isBlown && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ 
                                opacity: [0.8, 1, 0.9, 1], 
                                scale: [1, 1.2, 0.9, 1.1],
                                y: [0, -2, 0]
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 0.6,
                                ease: "easeInOut"
                              }}
                              className="w-4 h-6 bg-gradient-to-t from-red-500 via-amber-500 to-yellow-300 rounded-full shadow-[0_0_12px_#ef4444]"
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Candle Stick */}
                      <div className="w-2.5 h-10 bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-500 rounded-t-sm shadow-inner relative overflow-hidden">
                        {/* Stripes on candle */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.4)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0.4)_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cake Body SVG */}
                <svg className="w-56 h-32 drop-shadow-xl z-10" viewBox="0 0 200 120">
                  {/* Tier 2 (Top Tier) */}
                  <rect x="40" y="30" width="120" height="40" rx="6" fill="#f43f5e" />
                  {/* Top Frosting Drips */}
                  <path d="M 40 35 C 50 45, 60 45, 70 35 C 80 45, 90 45, 100 35 C 110 45, 120 45, 130 35 C 140 45, 150 45, 160 35 L 160 30 L 40 30 Z" fill="#fff1f2" />
                  
                  {/* Decorative Stars / Dots on Tier 2 */}
                  <circle cx="60" cy="55" r="3" fill="#fbbf24" />
                  <circle cx="85" cy="50" r="3" fill="#a78bfa" />
                  <circle cx="115" cy="52" r="3" fill="#60a5fa" />
                  <circle cx="140" cy="55" r="3" fill="#34d399" />

                  {/* Tier 1 (Base Tier) */}
                  <rect x="20" y="70" width="160" height="45" rx="8" fill="#ec4899" />
                  {/* Base Frosting */}
                  <path d="M 20 75 C 35 85, 50 85, 65 75 C 80 85, 95 85, 110 75 C 125 85, 140 85, 155 75 C 170 85, 180 85, 180 75 L 180 70 L 20 70 Z" fill="#fdf2f8" />
                  
                  {/* Multi hearts on base tier */}
                  <path d="M 40 92 C 38 88, 32 88, 30 92 C 28 96, 35 101, 40 104 C 45 101, 52 96, 50 92 C 48 88, 42 88, 40 92 Z" fill="#f43f5e" />
                  <path d="M 100 92 C 98 88, 92 88, 90 92 C 88 96, 95 101, 100 104 C 105 101, 112 96, 110 92 C 108 88, 102 88, 100 92 Z" fill="#a78bfa" />
                  <path d="M 160 92 C 158 88, 152 88, 150 92 C 148 96, 155 101, 160 104 C 165 101, 172 96, 170 92 C 168 88, 162 88, 160 92 Z" fill="#3b82f6" />
                  
                  {/* Cake Plate */}
                  <ellipse cx="100" cy="115" rx="90" ry="8" fill="#e2e8f0" />
                  <ellipse cx="100" cy="113" rx="85" ry="6" fill="#cbd5e1" />
                </svg>

                {/* Glow backdrop behind unlit cake */}
                {allLit && !isBlown && (
                  <motion.div
                    className="absolute w-64 h-48 bg-amber-400/20 blur-3xl rounded-full bottom-10 z-0"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </div>

              {/* Blowing / Make a wish triggers */}
              <div className="min-h-[120px] flex items-center justify-center">
                <AnimatePresence>
                  {showWishMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-4 w-full"
                    >
                      <div className="bg-purple-900/40 p-3 sm:p-4 rounded-2xl border border-purple-500/30 text-purple-100 text-xs leading-relaxed font-sans flex flex-col items-center gap-2">
                        <Heart className="text-pink-400 fill-pink-400 animate-pulse w-4 h-4" />
                        <span className="text-center font-medium leading-relaxed">
                          {lang === 'bn' 
                            ? 'চোখ বন্ধ করো, মনে মনে তোমার মনের সবচেয়ে সুন্দর মিষ্টি ইচ্ছেটা ভাবো... ঈশ্বরের কাছে প্রার্থনা করি তোমার সব স্বপ্ন যেন সত্যি হয়! 🎂💜✨' 
                            : 'Close your eyes, think of your sweetest, most beautiful wish... I pray that all your dreams come true! 🎂💜✨'}
                        </span>
                      </div>

                      {!isBlown ? (
                        <button
                          onClick={handleBlow}
                          id="btn_blow_candles"
                          className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-extrabold py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wider font-sans flex items-center justify-center gap-2"
                        >
                          {lang === 'bn' ? '💨 ইচ্ছা পূরণ হোক ও ফু দিন!' : '💨 Make a Wish & Blow!'}
                        </button>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          className="text-yellow-300 font-extrabold text-sm sm:text-base py-2 font-sans flex items-center justify-center gap-2"
                        >
                          {lang === 'bn' ? '✨ শুভকামনা স্বর্গে পাঠানো হয়েছে! 🎉' : '✨ Wish Sent to Heaven! 🎉'}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Counter of lit candles */}
              {!allLit && (
                <div className="text-[10px] text-purple-300 uppercase font-mono tracking-wider">
                  {lang === 'bn' ? `জ্বালানো মোমবাতি: ${litCandles.filter(c => c).length} / ৫` : `Lit candles: ${litCandles.filter(c => c).length} / 5`}
                </div>
              )}
            </motion.div>
          ) : (
            /* PHASE 3: VIRTUAL CAKE CUTTING (কেক কাটা) */
            <motion.div
              key="cutting-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1 font-sans flex items-center justify-center gap-2">
                {lang === 'bn' ? 'ধাপ ২.৫: জন্মদিনের কেক কাটুন! 🍰🔪' : 'Step 2.5: Cut the Birthday Cake! 🍰🔪'}
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm mb-4 font-sans">
                {isCut 
                  ? (lang === 'bn' ? 'একটি সুন্দর মিষ্টি কেকের টুকরো বিশেষ করে আপনার জন্য কাটা হয়েছে! 😋' : 'A sweet piece has been sliced especially for you! 😋') 
                  : (lang === 'bn' ? 'কেকটি কাটার জন্য কেকের উপর ক্লিক করুন অথবা নিচের বোতামটি চাপুন!' : 'Tap on the cake or click the button below to cut the birthday cake!')}
              </p>

              {/* Interactive Cut Canvas Area */}
              <div 
                onClick={handleCutCake}
                className="relative h-64 w-full flex justify-center items-center bg-black/20 rounded-2xl border border-white/5 cursor-pointer overflow-hidden group"
                title={lang === 'bn' ? 'কেক কাটার জন্য যেকোনো জায়গায় ক্লিক করুন!' : 'Click anywhere to cut the cake!'}
              >
                {/* Dotted slicing line across the center */}
                {!isCut && (
                  <motion.div 
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute w-0.5 h-44 bg-dashed border-l-2 border-dashed border-pink-400/80 z-20 left-1/2 transform -translate-x-1/2 top-10 pointer-events-none"
                  />
                )}

                {/* Cake SVG which visually shows slice moving if cut */}
                <div className="relative flex items-center justify-center w-full h-full z-10 select-none">
                  <motion.div
                    animate={isCut ? { x: -20, rotate: -2 } : {}}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="absolute left-12 sm:left-16"
                  >
                    {/* Main cut cake representation */}
                    <svg className="w-48 h-28 drop-shadow-xl" viewBox="0 0 200 120">
                      {/* Tier 2 left part */}
                      <path d="M 40 30 L 100 30 L 100 70 L 40 70 Z" fill="#f43f5e" />
                      <path d="M 40 35 C 50 45, 60 45, 70 35 C 80 45, 90 45, 100 35 L 100 30 L 40 30 Z" fill="#fff1f2" />
                      <circle cx="60" cy="55" r="3" fill="#fbbf24" />
                      <circle cx="85" cy="50" r="3" fill="#a78bfa" />
                      
                      {/* Tier 1 left part */}
                      <path d="M 20 70 L 100 70 L 100 115 L 20 115 Z" fill="#ec4899" />
                      <path d="M 20 75 C 35 85, 50 85, 65 75 C 80 85, 95 85, 100 75 L 100 70 L 20 70 Z" fill="#fdf2f8" />
                      <path d="M 40 92 C 38 88, 32 88, 30 92 C 28 96, 35 101, 40 104 C 45 101, 52 96, 50 92 Z" fill="#f43f5e" />
                      <path d="M 100 92 C 98 88, 92 88, 90 92 C 88 96, 95 101, 100 104 C 105 101, 112 96, 110 92 Z" fill="#a78bfa" fillOpacity={0.5} />
                      
                      {/* Plate left part */}
                      <ellipse cx="100" cy="115" rx="90" ry="8" fill="#e2e8f0" />
                      <ellipse cx="100" cy="113" rx="85" ry="6" fill="#cbd5e1" />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={isCut ? { x: 25, y: 15, rotate: 6, scale: 1.05 } : {}}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                    className="absolute right-12 sm:right-16"
                  >
                    {/* Right part / cut piece of the cake */}
                    <svg className="w-48 h-28 drop-shadow-xl" viewBox="0 0 200 120">
                      {/* Tier 2 right part */}
                      <path d="M 100 30 L 160 30 rx 6 L 160 70 L 100 70 Z" fill="#f43f5e" />
                      <path d="M 100 35 C 110 45, 120 45, 130 35 C 140 45, 150 45, 160 35 L 160 30 L 100 30 Z" fill="#fff1f2" />
                      <circle cx="115" cy="52" r="3" fill="#60a5fa" />
                      <circle cx="140" cy="55" r="3" fill="#34d399" />

                      {/* Tier 1 right part */}
                      <path d="M 100 70 L 180 70 rx 8 L 180 115 L 100 115 Z" fill="#ec4899" />
                      <path d="M 100 75 C 110 85, 125 85, 140 85, 155 75 C 170 85, 180 85, 180 75 L 180 70 L 100 70 Z" fill="#fdf2f8" />
                      <path d="M 160 92 C 158 88, 152 88, 150 92 C 148 96, 155 101, 160 104 C 165 101, 172 96, 170 92 Z" fill="#3b82f6" />

                      {/* Plate right part */}
                      <ellipse cx="100" cy="115" rx="90" ry="8" fill="#e2e8f0" fillOpacity={0} />
                    </svg>
                  </motion.div>
                </div>

                {/* Animated Knife Element */}
                <AnimatePresence>
                  {!isCut && (
                    <motion.div
                      initial={{ y: -60, x: -10, rotate: -45, opacity: 0 }}
                      animate={isCuttingActive 
                        ? { y: [0, 80, 50], x: [0, 0, 0], rotate: [0, 15, 0], opacity: 1 } 
                        : { y: 0, x: 0, rotate: -15, opacity: 1 }
                      }
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: isCuttingActive ? 0.8 : 0.4,
                        ease: "easeInOut"
                      }}
                      className="absolute top-10 left-1/2 transform -translate-x-1/2 -mt-10 z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    >
                      {/* Cute Metallic Knife SVG */}
                      <svg className="w-16 h-32" viewBox="0 0 60 120">
                        {/* Blade */}
                        <path d="M 25 15 L 35 10 L 35 75 L 25 80 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
                        <path d="M 30 12 L 35 10 L 35 75 L 30 77 Z" fill="#ffffff" /> {/* Shiny bevel */}
                        {/* Guard */}
                        <rect x="20" y="78" width="18" height="6" rx="2" fill="#d97706" />
                        {/* Wooden Handle */}
                        <rect x="25" y="84" width="8" height="30" rx="3" fill="#78350f" />
                        {/* Ribbon bow on knife */}
                        <circle cx="29" cy="81" r="3" fill="#f43f5e" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sparkling effects after cutting */}
                {isCut && (
                  <motion.div
                    className="absolute inset-0 bg-pink-500/10 pointer-events-none flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1 }}
                  >
                    <Sparkles className="text-yellow-300 w-16 h-16 animate-spin-slow" />
                  </motion.div>
                )}

                {/* Tap to cut hover overlay hint */}
                {!isCut && !isCuttingActive && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-[10px] text-pink-300 font-bold font-sans tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === 'bn' ? '👈 কাটার জন্য কেকের ওপর স্পর্শ করুন!' : '👈 Tap Cake To Cut!'}
                  </div>
                )}
              </div>

              {/* Action buttons & feedback */}
              <div className="space-y-4">
                {!isCut ? (
                  <button
                    onClick={handleCutCake}
                    disabled={isCuttingActive}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-extrabold py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wider font-sans flex items-center justify-center gap-2"
                  >
                    🔪 {isCuttingActive 
                      ? (lang === 'bn' ? 'কেক কাটা হচ্ছে...' : 'Cutting Cake...') 
                      : (lang === 'bn' ? 'কেকটি কাটুন! 🔪' : 'Slice the Cake!')}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-amber-500/10 p-3 sm:p-4 rounded-2xl border border-amber-500/30 text-amber-200 text-xs leading-relaxed font-sans flex flex-col items-center gap-1.5">
                      <span className="font-extrabold text-sm text-yellow-300 flex items-center gap-1">
                        {lang === 'bn' ? '🍰 কেক কাটা সম্পন্ন হয়েছে! 🎉' : '🍰 Cake Sliced! 🎉'}
                      </span>
                      <span>
                        {lang === 'bn' 
                          ? 'কেকের সুবাস চমৎকার! চলুন এবার সুন্দর আশীর্বাদ সংগ্রহ করতে এগিয়ে যাই।' 
                          : "The cake smells absolutely delicious! Let's continue to gather lovely blessings."}
                      </span>
                    </div>

                    <button
                      onClick={onComplete}
                      className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-extrabold py-3.5 px-6 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wider font-sans flex items-center justify-center gap-2 animate-pulse"
                    >
                      {lang === 'bn' ? '😋 কেক খেয়ে পরবর্তী ধাপে যান! 🌟' : '😋 Eat Cake & Proceed! 🌟'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

