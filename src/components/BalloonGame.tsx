import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Balloon } from '../types';
import { Heart, Sparkles, Star } from 'lucide-react';

interface BalloonGameProps {
  onComplete: (collectedWords: string[]) => void;
  playPop: () => void;
  playSuccess: () => void;
  relation?: string;
  lang?: 'en' | 'bn';
}

const BALLOON_COLORS = [
  'rgba(244, 63, 94, 0.8)',   // Rose
  'rgba(168, 85, 247, 0.8)',  // Purple
  'rgba(59, 130, 246, 0.8)',  // Blue
  'rgba(236, 72, 153, 0.8)',  // Pink
  'rgba(245, 158, 11, 0.8)',  // Amber
  'rgba(16, 185, 129, 0.8)',  // Emerald
  'rgba(6, 182, 212, 0.8)',   // Cyan
];

const BLESSING_WORDS_BN = [
  'সুস্বাস্থ্য', 'সাফল্য', 'স্বপ্নপূরণ', 'আনন্দ', 'দীর্ঘায়ু', 'হাসিখুশি', 'ভালোবাসা', 'শান্তি', 'প্রগতি', 'আশীর্বাদ', 'স্মৃতি', 'উন্নতি'
];

const BLESSING_WORDS_EN = [
  'Health', 'Success', 'Dreams', 'Joy', 'Long Life', 'Cheerful', 'Love', 'Peace', 'Progress', 'Blessing', 'Memories', 'Prosperity'
];

export default function BalloonGame({ 
  onComplete, 
  playPop, 
  playSuccess, 
  relation = 'sister',
  lang = 'bn'
}: BalloonGameProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const balloonIdCounter = useRef(0);

  const blessingWords = lang === 'bn' ? BLESSING_WORDS_BN : BLESSING_WORDS_EN;

  // Spawn balloons periodically
  useEffect(() => {
    if (gameFinished) return;

    const spawnInterval = setInterval(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || 360;
      
      const word = blessingWords[Math.floor(Math.random() * blessingWords.length)];
      const size = Math.floor(Math.random() * 20) + 70; // 70px to 90px diameter
      const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      
      const newBalloon: Balloon = {
        id: balloonIdCounter.current++,
        x: Math.random() * (width - size - 20) + 10,
        y: 450, // Spawn just below bottom
        speed: Math.random() * 1.5 + 1.2, // floating speed
        color,
        word,
        size,
        popped: false
      };

      setBalloons(prev => [...prev.slice(-20), newBalloon]); // limit array to avoid memory issues
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [gameFinished]);

  // Main game loop (floats balloons up)
  useEffect(() => {
    if (gameFinished) return;

    const updatePositions = () => {
      setBalloons(prev => {
        return prev
          .map(b => ({
            ...b,
            y: b.y - b.speed
          }))
          .filter(b => b.y > -150); // remove when floating out of sight
      });
      requestRef.current = requestAnimationFrame(updatePositions);
    };

    requestRef.current = requestAnimationFrame(updatePositions);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameFinished]);

  const handlePop = (id: number, word: string) => {
    if (gameFinished) return;

    playPop();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 10) {
        handleGameEnd();
      }
      return nextCount;
    });

    if (!collectedWords.includes(word)) {
      setCollectedWords(prev => [...prev, word]);
    }
  };

  const handleGameEnd = () => {
    setGameFinished(true);
    playSuccess();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center select-none w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-amber-500/10 -z-10 rounded-3xl" />

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-extrabold text-white font-sans flex items-center gap-1.5">
            {lang === 'bn' ? 'ধাপ ৩: বেলুন আশিস ফাটিয়ে দিন! 🎈' : 'Stage 3: Pop the Balloon Blessings! 🎈'}
          </h3>
          <div className="bg-purple-900/50 px-3 py-1 rounded-full text-xs font-bold text-pink-300 font-sans">
            {lang === 'bn' ? `ফাটানো হয়েছে: ${poppedCount} / ১০` : `Popped: ${poppedCount} / 10`}
          </div>
        </div>

        <p className="text-purple-200 text-xs mb-4 font-sans text-left leading-relaxed">
          {lang === 'bn' 
            ? `🎈 ভাসমান বেলুনগুলোর ভেতরে সুন্দর সুন্দর আশিস রয়েছে। বেলুনগুলো স্পর্শ করে ফাটিয়ে দিন এবং আপনার ${relation}-এর জন্য সুন্দর সব আশিস সংগ্রহ করুন!` 
            : `🎈 Floating balloons contain beautiful blessings. Tap to pop them and collect blessings for your ${relation}!`}
        </p>

        {/* Game Canvas Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-96 bg-black/30 rounded-2xl overflow-hidden border border-white/10 shadow-inner"
        >
          {/* Sky background inside mini-game */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-purple-950/40 to-pink-950/20" />
          
          {/* Subtle stars background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Star className="absolute top-10 left-12 text-white w-4 h-4" />
            <Star className="absolute top-24 right-16 text-white w-3 h-3" />
            <Star className="absolute top-64 left-24 text-white w-5 h-5 animate-pulse" />
          </div>

          <AnimatePresence>
            {!gameFinished && balloons.map((balloon) => {
              if (balloon.popped) return null;
              return (
                <motion.div
                  key={balloon.id}
                  className="absolute cursor-pointer flex flex-col items-center select-none"
                  style={{
                    left: balloon.x,
                    top: balloon.y,
                    width: balloon.size,
                    height: balloon.size * 1.2
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handlePop(balloon.id, balloon.word)}
                >
                  {/* Balloon Circle */}
                  <div 
                    className="relative rounded-full shadow-lg flex items-center justify-center text-white font-bold"
                    style={{
                      width: balloon.size,
                      height: balloon.size * 1.1,
                      backgroundColor: balloon.color,
                      boxShadow: `inset -8px -8px 15px rgba(0,0,0,0.15), 0 5px 15px ${balloon.color}`,
                    }}
                  >
                    {/* Highlight glare */}
                    <div className="absolute top-2 left-3 w-5 h-2 bg-white/40 rounded-full rotate-[-15deg]" />

                    {/* Blessing Word */}
                    <span className="text-xs tracking-tight font-sans text-center px-1 font-extrabold select-none pointer-events-none drop-shadow">
                      {balloon.word}
                    </span>
                  </div>

                  {/* Balloon Knot/Triangle */}
                  <div 
                    className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] -mt-[1px]"
                    style={{ borderBottomColor: balloon.color }}
                  />

                  {/* Balloon String */}
                  <svg className="w-2 h-16 pointer-events-none opacity-60" viewBox="0 0 10 50">
                    <path d="M5,0 Q8,15 3,30 T5,50" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
                  </svg>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Game Over Modal / Unlock Transition */}
          {gameFinished && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-purple-950/80 backdrop-blur-sm p-6"
            >
              <Sparkles className="text-yellow-300 w-16 h-16 mb-4 animate-bounce" />
              <h4 className="text-2xl font-black text-white mb-2 font-sans">
                {lang === 'bn' ? 'অসাধারণ! 🎉' : 'Excellent! 🎉'}
              </h4>
              <p className="text-purple-200 text-sm mb-6 max-w-xs font-sans leading-relaxed">
                {lang === 'bn' 
                  ? `আপনি আপনার ${relation}-এর জন্য ১০টি মিষ্টি আশিস সংগ্রহ করেছেন! এগুলো এখন শুভ জন্মদিনের স্ক্রলে যুক্ত হয়েছে!` 
                  : `You've collected 10 sweet blessings for your ${relation}! They are now packed inside the birthday scroll!`}
              </p>
              <button
                onClick={() => onComplete(collectedWords)}
                id="btn_finish_balloon_game"
                className="bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 text-white font-black py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 text-sm uppercase tracking-wider font-sans"
              >
                {lang === 'bn' ? 'ক্যাচার খেলায় এগিয়ে যান 🌟' : 'Proceed to Catcher Game 🌟'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Collected Blessings Tray */}
        <div className="mt-4 text-left">
          <span className="text-xs font-bold text-pink-300 font-sans block mb-1.5 uppercase tracking-wide">
            {lang === 'bn' ? 'সংগৃহীত আশিসসমূহ:' : 'Collected Blessings:'}
          </span>
          <div className="flex flex-wrap gap-1.5 min-h-[40px] bg-purple-950/20 p-2.5 rounded-xl border border-white/5">
            {collectedWords.length === 0 ? (
              <span className="text-xs text-purple-400 italic">
                {lang === 'bn' ? 'বেলুন ফাটিয়ে আশীর্বাদ সংগ্রহ করুন...' : 'Pop balloons to gather...'}
              </span>
            ) : (
              collectedWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-2.5 py-1 text-xs text-purple-100 flex items-center gap-1 font-sans font-medium"
                >
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> {word}
                </motion.span>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
