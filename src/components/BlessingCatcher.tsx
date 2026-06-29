import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FallingItem } from '../types';
import { Heart, Gift, Sparkles, AlertCircle, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

interface BlessingCatcherProps {
  onComplete: (score: number) => void;
  playSparkle: () => void;
  playSuccess: () => void;
  lang?: 'en' | 'bn';
}

const ITEM_TYPES: ('heart' | 'gift' | 'flower' | 'cake' | 'star' | 'stress')[] = [
  'heart', 'flower', 'heart', 'stress', 'gift', 'star', 'cake', 'stress'
];

export default function BlessingCatcher({ 
  onComplete, 
  playSparkle, 
  playSuccess,
  lang = 'bn'
}: BlessingCatcherProps) {
  const [basketX, setBasketX] = useState(150); // percentage or pixels
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const itemIdCounter = useRef(0);
  const basketXRef = useRef(150);

  // Sync ref with state for use in animation frame
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Handle pointer/mouse move to drag basket
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameFinished || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const boundedX = Math.max(25, Math.min(rect.width - 25, x));
    setBasketX(boundedX);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameFinished) return;
      const step = 20;
      if (e.key === 'ArrowLeft') {
        setBasketX(prev => Math.max(30, prev - step));
      } else if (e.key === 'ArrowRight') {
        if (!containerRef.current) return;
        setBasketX(prev => Math.min(containerRef.current!.clientWidth - 30, prev + step));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameFinished]);

  // On-screen tap buttons for mobile
  const moveBasket = (direction: 'left' | 'right') => {
    if (gameFinished || !containerRef.current) return;
    const step = 40;
    if (direction === 'left') {
      setBasketX(prev => Math.max(30, prev - step));
    } else {
      setBasketX(prev => Math.min(containerRef.current!.clientWidth - 30, prev + step));
    }
  };

  // Game tick loop
  useEffect(() => {
    if (gameFinished) return;

    // Spawn items
    const spawnTimer = setInterval(() => {
      if (!containerRef.current || gameFinished) return;
      const width = containerRef.current.clientWidth;
      
      const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
      const size = type === 'cake' || type === 'gift' ? 32 : 24;
      const speed = Math.random() * 2 + 2; // falling speed
      
      const newItem: FallingItem = {
        id: itemIdCounter.current++,
        x: Math.random() * (width - 40) + 20,
        y: -40,
        type,
        size,
        speed,
        angle: Math.random() * 360
      };

      setItems(prev => [...prev, newItem]);
    }, 1000);

    // Update positions & detect collisions
    const updateLoop = () => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      
      setItems(prev => {
        const updated: FallingItem[] = [];
        
        prev.forEach(item => {
          const nextY = item.y + item.speed;
          
          // Basket collision check (basket is at y ~ bottom of container)
          const basketY = containerHeight - 40;
          const isAtBasketY = nextY >= basketY - 15 && nextY <= basketY + 15;
          const currentBasketX = basketXRef.current;
          
          const distanceX = Math.abs(item.x - currentBasketX);
          const collided = isAtBasketY && distanceX < 45;

          if (collided) {
            playSparkle();
            
            // Score calculations
            setScore(prevScore => {
              let scoreGain = 10;
              if (item.type === 'gift' || item.type === 'cake') scoreGain = 20;
              if (item.type === 'star') scoreGain = 30;
              if (item.type === 'stress') scoreGain = -15;

              const nextScore = Math.max(0, prevScore + scoreGain);
              
              if (nextScore >= 100) {
                setTimeout(() => {
                  setGameFinished(true);
                  playSuccess();
                }, 10);
              }
              return nextScore;
            });
            // Don't keep item in falling array (popped)
          } else if (nextY < containerHeight) {
            // Keep falling
            updated.push({
              ...item,
              y: nextY,
              angle: item.angle + 1
            });
          }
        });
        
        return updated;
      });

      animationRef.current = requestAnimationFrame(updateLoop);
    };

    animationRef.current = requestAnimationFrame(updateLoop);

    return () => {
      clearInterval(spawnTimer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameFinished]);

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
            {lang === 'bn' ? 'ধাপ ৪: আশীর্বাদ কুড়িয়ে নিন! 🧺' : 'Stage 4: Catch the Blessings! 🧺'}
          </h3>
          <div className="bg-purple-900/50 px-3 py-1 rounded-full text-xs font-bold text-yellow-300 font-sans">
            {lang === 'bn' ? `স্কোর: ${score} / ১০০` : `Score: ${score} / 100`}
          </div>
        </div>

        <p className="text-purple-200 text-xs mb-4 font-sans text-left leading-relaxed">
          {lang === 'bn' 
            ? '🧺 ঝুড়িটি নাড়াতে টেনে নিয়ে যান বা নিচের বোতামে স্পর্শ করুন। হৃদয় ❤️, উপহার 🎁 ও ফুল 🌸 কুড়িয়ে নিন। দুঃখের মেঘ 🌧️ এড়িয়ে চলুন!' 
            : '🧺 Drag or tap buttons to move the basket. Catch Hearts ❤️, Gifts 🎁, and Flowers 🌸. Avoid the Worries/Clouds 🌧️!'}
        </p>

        {/* Game Canvas Box */}
        <div 
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-80 bg-black/45 rounded-2xl overflow-hidden border border-white/10 shadow-inner touch-none cursor-ew-resize"
        >
          {/* Internal gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/55 to-purple-950/35" />

          {/* Falling items */}
          <AnimatePresence>
            {!gameFinished && items.map((item) => (
              <motion.div
                key={item.id}
                className="absolute pointer-events-none"
                style={{
                  left: item.x - item.size / 2,
                  top: item.y,
                  transform: `rotate(${item.angle}deg)`,
                }}
              >
                {item.type === 'heart' && (
                  <span className="text-2xl drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]">❤️</span>
                )}
                {item.type === 'flower' && (
                  <span className="text-2xl drop-shadow-[0_2px_8px_rgba(236,72,153,0.4)]">🌸</span>
                )}
                {item.type === 'gift' && (
                  <span className="text-3xl drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">🎁</span>
                )}
                {item.type === 'cake' && (
                  <span className="text-3xl drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">🎂</span>
                )}
                {item.type === 'star' && (
                  <span className="text-2xl drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]">⭐</span>
                )}
                {item.type === 'stress' && (
                  <span className="text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">🌧️</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Basket */}
          <div
            className="absolute bottom-4 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{
              left: basketX - 45, // center basket
              width: 90,
            }}
          >
            {/* Visual Basket Bag */}
            <div className="relative w-20 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-b-2xl border-t-4 border-amber-400 shadow-lg flex items-center justify-center">
              {/* Basket weave lines */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.1)_55%,transparent_55%)] bg-[length:15px_15px]" />
              <ShoppingBag className="text-white/45 w-5 h-5" />
            </div>
            {/* Basket handle */}
            <div className="w-14 h-6 border-4 border-amber-400 border-b-0 rounded-t-full -mt-15 -z-10" />
          </div>

          {/* Score Target Meter inside canvas */}
          <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, score)}%` }}
            />
          </div>

          {/* Game Over Modal */}
          {gameFinished && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-purple-950/85 backdrop-blur-md p-6"
            >
              <Sparkles className="text-yellow-300 w-16 h-16 mb-4 animate-bounce" />
              <h4 className="text-2xl font-black text-white mb-2 font-sans">
                {lang === 'bn' ? 'চমৎকার! 🎉' : 'Wonderful! 🎉'}
              </h4>
              <p className="text-purple-200 text-sm mb-6 max-w-xs font-sans leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনি প্রচুর শুভকামনা ও ইতিবাচক শক্তি সংগ্রহ করেছেন! জন্মদিনের চমৎকার শুভেচ্ছা স্ক্রলটি এখন দেখার জন্য প্রস্তুত!' 
                  : "You've gathered enough blessings and positive energy! The grand birthday wishing scroll is now ready for reveal!"}
              </p>
              <button
                onClick={() => onComplete(score)}
                id="btn_open_reveal"
                className="bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 text-white font-black py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 text-sm uppercase tracking-wider font-sans"
              >
                {lang === 'bn' ? 'শুভেচ্ছা স্ক্রলটি মেলুন! 📜💜' : 'Reveal Grand Wish! 📜💜'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Mobile On-screen Controls */}
        <div className="flex justify-between items-center mt-4 gap-4">
          <button
            onPointerDown={() => moveBasket('left')}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 py-3 rounded-xl flex items-center justify-center text-white transition-all shadow"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-[10px] text-purple-300 uppercase font-mono tracking-wider">
            {lang === 'bn' ? 'টেনে নিয়ে যান অথবা বোতাম ব্যবহার করুন' : 'Drag Screen or use Buttons'}
          </span>
          <button
            onPointerDown={() => moveBasket('right')}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/10 py-3 rounded-xl flex items-center justify-center text-white transition-all shadow"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
