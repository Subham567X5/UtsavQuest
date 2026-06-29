import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Hourglass, Lock, Unlock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  onComplete?: () => void;
  title?: string;
  relation?: string;
  lockMode?: boolean;
}

export default function CountdownTimer({ 
  targetDate, 
  onComplete, 
  title = "Birthday Celebration Countdown", 
  relation = "sister",
  lockMode = false
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOver: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        if (onComplete) onComplete();
        return true; // Over
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      return false;
    };

    // Run once initially
    const wasOver = calculateTime();
    if (wasOver) return;

    const interval = setInterval(() => {
      calculateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  const { days, hours, minutes, seconds, isOver } = timeLeft;

  // Render individual time segment block with layout animation
  const renderTimeBlock = (value: number, label: string, colorClass: string) => {
    // Pad values
    const paddedValue = value.toString().padStart(2, '0');
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Neon Glow backdrop */}
          <div className={`absolute inset-0 blur-lg opacity-40 rounded-2xl ${colorClass}`} />
          
          <div className="relative bg-black/50 border border-white/10 rounded-2xl w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center font-mono text-xl sm:text-3xl font-black text-white shadow-lg overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={paddedValue}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                className="absolute"
              >
                {paddedValue}
              </motion.span>
            </AnimatePresence>
            
            {/* Split fold line */}
            <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-1/2 pointer-events-none" />
          </div>
        </div>
        <span className="text-[10px] sm:text-xs text-purple-300 uppercase tracking-widest mt-2 font-bold font-sans">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-purple-950/25 backdrop-blur-md rounded-3xl p-6 border border-purple-500/10 shadow-2xl relative overflow-hidden select-none text-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
      
      {/* Title Header with Lock/Unlock Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {lockMode ? (
          isOver ? (
            <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/20">
              <Unlock className="w-4 h-4 animate-pulse" />
            </div>
          ) : (
            <div className="p-1.5 bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/20 animate-pulse">
              <Lock className="w-4 h-4" />
            </div>
          )
        ) : (
          <Hourglass className="text-pink-400 w-4 h-4 animate-spin-slow" />
        )}
        <h3 className="text-sm font-bold text-purple-100 font-sans tracking-wide">
          {title}
        </h3>
      </div>

      {isOver ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-4 space-y-2"
        >
          <div className="flex justify-center">
            <Sparkles className="text-yellow-300 w-12 h-12 animate-bounce" />
          </div>
          <p className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-200">
            {lockMode ? "🔓 Quest is Unlocked! Let's Celebrate! 🎉" : "✨ The Big Day is Here! 🎈"}
          </p>
          <p className="text-[11px] text-purple-300 font-sans max-w-xs mx-auto">
            The countdown has concluded successfully. You can now unwrap the ultimate birthday greeting!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {/* Ticking Grid */}
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {renderTimeBlock(days, "Days", "bg-indigo-500")}
            <span className="text-lg sm:text-2xl font-bold text-purple-400 font-mono -mt-6">:</span>
            {renderTimeBlock(hours, "Hours", "bg-pink-500")}
            <span className="text-lg sm:text-2xl font-bold text-purple-400 font-mono -mt-6">:</span>
            {renderTimeBlock(minutes, "Mins", "bg-purple-500")}
            <span className="text-lg sm:text-2xl font-bold text-purple-400 font-mono -mt-6">:</span>
            {renderTimeBlock(seconds, "Secs", "bg-rose-500")}
          </div>

          {/* Bengali status message */}
          {lockMode && (
            <p className="text-[11px] text-pink-300 bg-pink-950/40 py-1.5 px-3 rounded-full inline-flex items-center gap-1.5 border border-pink-500/10 font-sans mx-auto">
              🔒 এই ম্যাজিকাল কোয়েস্টটি কাউন্টডাউন শেষ হলে আনলক হবে!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
