import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Zap, Drum } from 'lucide-react';
import { AudioEngine } from './AudioEngine';
import { translations } from '../utils/translations';

interface DrumPadProps {
  audioEngine?: AudioEngine;
  playKick: () => void;
  playSnare: () => void;
  playHihat: () => void;
  playCrash: () => void;
  playTom: (pitch: 'high' | 'mid' | 'low') => void;
  playDrumRoll: (duration: number) => void;
  lang?: 'en' | 'bn';
}

interface StrikeEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

const DRUM_COLORS: Record<string, string> = {
  'kick': 'from-pink-500/80 to-purple-600/80',
  'snare': 'from-red-500/80 to-rose-600/80',
  'hihat': 'from-amber-400/80 to-yellow-500/80',
  'crash': 'from-yellow-300/80 to-orange-400/80',
  'high-tom': 'from-cyan-400/80 to-blue-500/80',
  'mid-tom': 'from-indigo-400/80 to-indigo-600/80',
  'floor-tom': 'from-emerald-400/80 to-teal-600/80',
};

export default function DrumPad({
  audioEngine,
  playKick,
  playSnare,
  playHihat,
  playCrash,
  playTom,
  playDrumRoll,
  lang = 'bn'
}: DrumPadProps) {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [effects, setEffects] = useState<StrikeEffect[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const t = translations[lang];

  // Trigger visual strike feedback only (for automatic play to avoid recursive loops)
  const triggerVisualOnly = (padId: string) => {
    const color = DRUM_COLORS[padId] || 'from-pink-500/80 to-purple-600/80';
    setActivePad(padId);
    
    const newEffect: StrikeEffect = {
      id: Date.now() + Math.random(),
      x: Math.random() * 40 + 30, // center-ish percentage
      y: Math.random() * 40 + 30,
      color
    };
    setEffects(prev => [...prev, newEffect].slice(-10));
    
    setTimeout(() => {
      setActivePad(current => current === padId ? null : current);
    }, 100);
  };

  // Listen for automatic backing track drum triggers
  useEffect(() => {
    if (audioEngine) {
      audioEngine.registerDrumCallback((drumId) => {
        triggerVisualOnly(drumId);
      });
      return () => {
        audioEngine.registerDrumCallback(null);
      };
    }
  }, [audioEngine]);

  // Trigger drum strike
  const strike = (padId: string, triggerFn: () => void, color: string) => {
    setActivePad(padId);
    triggerFn();
    
    // Add visual ripple effect
    const newEffect: StrikeEffect = {
      id: Date.now() + Math.random(),
      x: Math.random() * 40 + 30, // center-ish percentage
      y: Math.random() * 40 + 30,
      color
    };
    setEffects(prev => [...prev, newEffect].slice(-10)); // Keep last 10
    
    setTimeout(() => {
      setActivePad(current => current === padId ? null : current);
    }, 100);
  };

  // Listen for keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.repeat) return; // Prevent continuous triggering

      // Skip keyboard triggers if typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (key) {
        case 'b':
        case ' ': // spacebar
          strike('kick', playKick, 'from-pink-500/80 to-purple-600/80');
          e.preventDefault();
          break;
        case 's':
          strike('snare', playSnare, 'from-red-500/80 to-rose-600/80');
          break;
        case 'h':
          strike('hihat', playHihat, 'from-amber-400/80 to-yellow-500/80');
          break;
        case 'c':
          strike('crash', playCrash, 'from-yellow-300/80 to-orange-400/80');
          break;
        case 't':
          strike('high-tom', () => playTom('high'), 'from-cyan-400/80 to-blue-500/80');
          break;
        case 'g':
          strike('mid-tom', () => playTom('mid'), 'from-indigo-400/80 to-indigo-600/80');
          break;
        case 'f':
          strike('floor-tom', () => playTom('low'), 'from-emerald-400/80 to-teal-600/80');
          break;
        case 'r':
          handleTriggerDrumRoll();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playKick, playSnare, playHihat, playCrash, playTom]);

  const handleTriggerDrumRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDrumRoll(1.5);
    setTimeout(() => {
      setIsRolling(false);
    }, 1600);
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden select-none">
      
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Drum className="text-pink-400 w-6 h-6 animate-pulse" />
          <div className="text-left">
            <h3 className="text-lg font-black text-white font-sans flex items-center gap-1.5">
              {t.drumTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {t.drumDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerDrumRoll}
          disabled={isRolling}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 ${
            isRolling 
              ? 'bg-purple-900 text-purple-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 hover:scale-105 active:scale-95'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isRolling ? 'animate-bounce' : ''}`} />
          {isRolling ? (lang === 'bn' ? 'রোলিং... 🥁' : 'Rolling... 🥁') : t.drumRoll}
        </button>
      </div>

      {/* Main Drum Kit Layout */}
      <div className="grid grid-cols-12 gap-4 max-w-3xl mx-auto py-2">
        
        {/* Left Side: Crash and Hi-hat Cymbals */}
        <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col justify-around gap-4">
          {/* CRASH CYMBAL */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => strike('crash', playCrash, 'from-yellow-300/60 to-orange-400/60')}
            className={`flex-1 aspect-square rounded-full border-4 border-amber-500 bg-gradient-to-tr from-amber-500/20 via-yellow-400/30 to-amber-300/40 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
              activePad === 'crash' ? 'shadow-[0_0_25px_rgba(251,191,36,0.8)] border-yellow-300' : 'hover:border-yellow-400/80'
            }`}
          >
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-600/30" />
            <span className="text-xl font-black text-yellow-300 font-sans drop-shadow">CRASH</span>
            <span className="text-[10px] font-mono bg-black/40 text-yellow-200/90 px-1.5 py-0.5 rounded border border-white/5 mt-1 font-bold">Key C</span>
          </motion.button>

          {/* HI-HAT */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => strike('hihat', playHihat, 'from-amber-400/60 to-yellow-500/60')}
            className={`flex-1 aspect-square rounded-full border-4 border-amber-600 bg-gradient-to-b from-amber-600/20 via-yellow-500/20 to-amber-700/40 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
              activePad === 'hihat' ? 'shadow-[0_0_25px_rgba(245,158,11,0.8)] border-yellow-400' : 'hover:border-yellow-500/80'
            }`}
          >
            {/* Double layer look */}
            <div className="absolute inset-1.5 rounded-full border border-amber-800" />
            <div className="absolute inset-4 rounded-full border border-amber-600/40" />
            <span className="text-base font-black text-amber-200 font-sans drop-shadow">HI-HAT</span>
            <span className="text-[10px] font-mono bg-black/40 text-amber-300 px-1.5 py-0.5 rounded border border-white/5 mt-1 font-bold">Key H</span>
          </motion.button>
        </div>

        {/* Center Section: Toms and Snare */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
          
          {/* Upper row: High and Mid Toms */}
          <div className="grid grid-cols-2 gap-4">
            {/* HIGH TOM */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => strike('high-tom', () => playTom('high'), 'from-cyan-400/60 to-blue-500/60')}
              className={`aspect-square rounded-full border-4 border-cyan-500 bg-gradient-to-b from-cyan-900/40 to-cyan-750/30 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
                activePad === 'high-tom' ? 'shadow-[0_0_25px_rgba(6,182,212,0.8)] border-cyan-300' : 'hover:border-cyan-400/80'
              }`}
            >
              <div className="absolute inset-3 rounded-full border border-white/10 bg-slate-900/60" />
              <span className="text-base font-black text-cyan-200 font-sans z-10">HI TOM</span>
              <span className="text-[10px] font-mono bg-black/50 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20 mt-1 font-bold z-10">Key T</span>
            </motion.button>

            {/* MID TOM */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => strike('mid-tom', () => playTom('mid'), 'from-indigo-400/60 to-indigo-600/60')}
              className={`aspect-square rounded-full border-4 border-indigo-500 bg-gradient-to-b from-indigo-900/40 to-indigo-750/30 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
                activePad === 'mid-tom' ? 'shadow-[0_0_25px_rgba(99,102,241,0.8)] border-indigo-300' : 'hover:border-indigo-400/80'
              }`}
            >
              <div className="absolute inset-3 rounded-full border border-white/10 bg-slate-900/60" />
              <span className="text-base font-black text-indigo-200 font-sans z-10">MID TOM</span>
              <span className="text-[10px] font-mono bg-black/50 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 mt-1 font-bold z-10">Key G</span>
            </motion.button>
          </div>

          {/* Lower Center: GIANT BASS/KICK DRUM */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => strike('kick', playKick, 'from-pink-500/60 to-purple-600/60')}
            className={`w-full h-36 rounded-2xl border-4 border-pink-500 bg-gradient-to-b from-slate-900/80 to-purple-950/40 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg overflow-hidden ${
              activePad === 'kick' ? 'shadow-[0_0_35px_rgba(236,72,153,0.9)] border-pink-400' : 'hover:border-pink-400/80'
            }`}
          >
            {/* Visual bass drum graphic lines */}
            <div className="absolute top-0 bottom-0 left-12 w-[2px] bg-white/5" />
            <div className="absolute top-0 bottom-0 right-12 w-[2px] bg-white/5" />
            <div className="absolute inset-3 rounded-xl border-2 border-white/5 flex flex-col items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-sans tracking-widest drop-shadow-md">KICK DRUM</span>
              <span className="text-xs font-mono bg-black/50 text-pink-300 px-2.5 py-1 rounded-full border border-pink-500/30 mt-2 font-bold">Spacebar / Key B</span>
            </div>
          </motion.button>

        </div>

        {/* Right Side: Snare and Floor/Low Tom */}
        <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col justify-around gap-4">
          {/* SNARE DRUM */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => strike('snare', playSnare, 'from-red-500/60 to-rose-600/60')}
            className={`flex-1 aspect-square rounded-full border-4 border-rose-500 bg-gradient-to-tr from-rose-950/50 to-red-900/30 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
              activePad === 'snare' ? 'shadow-[0_0_25px_rgba(244,63,94,0.8)] border-red-300' : 'hover:border-red-400/80'
            }`}
          >
            <div className="absolute inset-2.5 rounded-full border-2 border-white/5" />
            {/* Metal snare wire visual overlay */}
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-neutral-400/20" />
            <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-neutral-100/10 transform translate-y-1" />
            <span className="text-lg font-black text-rose-200 font-sans z-10">SNARE</span>
            <span className="text-[10px] font-mono bg-black/40 text-rose-300 px-1.5 py-0.5 rounded border border-white/5 mt-1 font-bold z-10">Key S</span>
          </motion.button>

          {/* FLOOR / LOW TOM */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => strike('floor-tom', () => playTom('low'), 'from-emerald-400/60 to-teal-600/60')}
            className={`flex-1 aspect-square rounded-full border-4 border-emerald-500 bg-gradient-to-tr from-emerald-950/40 to-teal-900/30 relative flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-lg ${
              activePad === 'floor-tom' ? 'shadow-[0_0_25px_rgba(16,185,129,0.8)] border-emerald-300' : 'hover:border-emerald-400/80'
            }`}
          >
            <div className="absolute inset-3 rounded-full border border-white/5" />
            <span className="text-lg font-black text-emerald-200 font-sans z-10">LOW TOM</span>
            <span className="text-[10px] font-mono bg-black/40 text-emerald-300 px-1.5 py-0.5 rounded border border-white/5 mt-1 font-bold z-10">Key F</span>
          </motion.button>
        </div>

      </div>

      {/* Guide overlay */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[11px] text-slate-500 font-mono text-center border-t border-white/5 pt-4">
        {lang === 'bn' ? (
          <>
            <span>স্পেস/B = কিক</span>
            <span>S = স্নিয়ার</span>
            <span>H = হাই-হ্যাট</span>
            <span>C = ক্র্যাশ</span>
            <span>T = হাই টম</span>
            <span>G = মিড টম</span>
            <span>F = লো টম</span>
            <span className="text-purple-400 font-bold">R = ড্রাম রোল!</span>
          </>
        ) : (
          <>
            <span>Space/B = Kick</span>
            <span>S = Snare</span>
            <span>H = Hi-hat</span>
            <span>C = Crash</span>
            <span>T = High Tom</span>
            <span>G = Mid Tom</span>
            <span>F = Low Tom</span>
            <span className="text-purple-400 font-bold">R = Drum Roll!</span>
          </>
        )}
      </div>

      {/* Ripple particles rendered relative to parent container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {effects.map(fx => (
          <motion.div
            key={fx.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`absolute w-12 h-12 rounded-full border-2 bg-gradient-to-r ${fx.color} -translate-x-1/2 -translate-y-1/2`}
            style={{ left: `${fx.x}%`, top: `${fx.y}%` }}
          />
        ))}
      </div>

    </div>
  );
}
