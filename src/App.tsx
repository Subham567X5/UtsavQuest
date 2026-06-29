import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStage } from './types';
import { AudioEngine } from './components/AudioEngine';
import GiftBox from './components/GiftBox';
import CakeScreen from './components/CakeScreen';
import BalloonGame from './components/BalloonGame';
import BlessingCatcher from './components/BlessingCatcher';
import PolaroidUpload from './components/PolaroidUpload';
import CreatorPhotoUpload from './components/CreatorPhotoUpload';
import CelebrationCanvas from './components/CelebrationCanvas';
import SisterQuiz from './components/SisterQuiz';
import MemoryWall from './components/MemoryWall';
import DrumPad from './components/DrumPad';
import CountdownTimer from './components/CountdownTimer';
import SecretMessageArea from './components/SecretMessageArea';
import UtsavQuestLogo from './components/UtsavQuestLogo';
import { translations } from './utils/translations';
import { 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  Heart, 
  Gift, 
  Copy, 
  Check, 
  Eye, 
  Settings, 
  Share2, 
  RefreshCw, 
  ArrowRight, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Info,
  Drum,
  Clock,
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';

const DEFAULT_BENGALI_WISH = `ঈশ্বরের আশীর্বাদে তোমার জীবনের প্রতিটি দিন আনন্দ, সুস্বাস্থ্য, সাফল্য আর অফুরন্ত ভালোবাসায় ভরে উঠুক। তোমার সব স্বপ্ন যেন একে একে পূরণ হয়। সবসময় এভাবেই হাসিখুশি থেকো এবং জীবনে অনেক দূর এগিয়ে যাও। জানতাম না আজ তোমার জন্মদিন। জানতে পারলে আরও আগে থেকেই তোমাকে শুভেচ্ছা জানাতাম। তবুও, দেরিতে হলেও মন থেকে জানাই—Happy Birthday! তোমার জন্য অনেক অনেক শুভকামনা ও ভালোবাসা। 🎂🎁🌸💖`;
const DEFAULT_ENGLISH_WISH = `May every day of your life be filled with joy, good health, success, and endless love with God's blessings. May all your dreams come true one by one. Always stay cheerful and go a long way in life. Wishing you a very Happy Birthday from the bottom of my heart! Best wishes and lots of love to you! 🎂🎁🌸💖`;

const DEFAULT_BENGALI_SECRET = `গোপন বার্তা: তুমি আমার জীবনের অন্যতম সেরা উপহার! অনেক ভালোবাসা ও শুভকামনা রইল! 🤫💖`;
const DEFAULT_ENGLISH_SECRET = `Secret Message: You are one of the best gifts in my life! Sending you lots of love and best wishes! 🤫💖`;

export default function App() {
  const [activeView, setActiveView] = useState<'creator' | 'sister'>('creator');
  const [isUrlLoadedView, setIsUrlLoadedView] = useState(false); // If they opened via custom sister link directly

  // Language state
  const [lang, setLang] = useState<'en' | 'bn'>('bn');

  // Dynamic parameters customized by creator
  const [sisterName, setSisterName] = useState('Sister');
  const [relation, setRelation] = useState('sister');
  const [customMessage, setCustomMessage] = useState(DEFAULT_BENGALI_WISH);
  const [secretMessage, setSecretMessage] = useState<string>('');
  const [sisterPhoto, setSisterPhoto] = useState<string>('');
  const [instrument, setInstrument] = useState<'musicbox' | 'piano' | 'flute'>('musicbox');
  const [tempo, setTempo] = useState(110);
  const [countdownTarget, setCountdownTarget] = useState<string>('');
  const [lockUntilTarget, setLockUntilTarget] = useState(false);

  // Local state to track current time for countdown locks
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isQuestLocked = activeView === 'sister' && countdownTarget && lockUntilTarget && (new Date(countdownTarget).getTime() > currentTime);

  const t = translations[lang];

  // Quest State
  const [stage, setStage] = useState<GameStage>(GameStage.GIFT);
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoDrum, setAutoDrum] = useState(true);
  
  // Karaoke States
  const [currentNoteIdx, setCurrentNoteIdx] = useState(-1);
  const [currentLyric, setCurrentLyric] = useState("Let's play the song! 🎵");
  const [currentNoteName, setCurrentNoteName] = useState("");
  
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<AudioEngine | null>(null);

  // Lazy initialise audio engine
  const getAudioEngine = (): AudioEngine => {
    if (!audioRef.current) {
      audioRef.current = new AudioEngine();
      audioRef.current.setAutoDrumBacking(autoDrum);
      audioRef.current.registerCallbacks(
        (idx, noteName, lyric) => {
          setCurrentNoteIdx(idx);
          setCurrentLyric(lyric);
          setCurrentNoteName(noteName);
        },
        () => {
          setCurrentNoteIdx(0);
        }
      );
    }
    return audioRef.current;
  };

  // URL parameter extraction on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const name = params.get('name');
    const rel = params.get('rel');
    const msg = params.get('msg');
    const photo = params.get('photo');
    const inst = params.get('inst');
    const target = params.get('target');
    const lock = params.get('lock');
    const secret = params.get('secret');
    const urlLang = params.get('lang');

    if (urlLang === 'en' || urlLang === 'bn') {
      setLang(urlLang);
    }

    if (view === 'sister') {
      setActiveView('sister');
      setIsUrlLoadedView(true);
      setStage(GameStage.GIFT); // always restart sister at the beginning of her quest!
    } else {
      setActiveView('creator');
      setIsUrlLoadedView(false);
    }

    if (name) setSisterName(name);
    if (rel) setRelation(rel);
    if (msg) setCustomMessage(msg);
    if (secret) setSecretMessage(secret);
    if (photo) setSisterPhoto(photo);
    if (inst && (inst === 'musicbox' || inst === 'piano' || inst === 'flute')) {
      setInstrument(inst as any);
    }
    if (target) setCountdownTarget(target);
    if (lock === 'true') setLockUntilTarget(true);
  }, []);

  const toggleSong = () => {
    const audio = getAudioEngine();
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setCurrentLyric("Song paused ⏸️");
    } else {
      audio.setInstrument(instrument);
      audio.setTempo(tempo);
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleInstrumentChange = (inst: 'musicbox' | 'piano' | 'flute') => {
    setInstrument(inst);
    const audio = getAudioEngine();
    audio.setInstrument(inst);
    audio.playSparkle();
  };

  const handleTempoChange = (newBpm: number) => {
    setTempo(newBpm);
    const audio = getAudioEngine();
    audio.setTempo(newBpm);
  };

  const handleAutoDrumToggle = (enabled: boolean) => {
    setAutoDrum(enabled);
    const audio = getAudioEngine();
    audio.setAutoDrumBacking(enabled);
    audio.playSparkle();
  };

  // Drum trigger helpers
  const playKick = () => getAudioEngine().playKick();
  const playSnare = () => getAudioEngine().playSnare();
  const playHihat = () => getAudioEngine().playHihat();
  const playCrash = () => getAudioEngine().playCrash();
  const playTom = (pitch: 'high' | 'mid' | 'low') => getAudioEngine().playTom(pitch);
  const playDrumRoll = (duration: number) => getAudioEngine().playDrumRoll(duration);

  // Sound effects shorthand
  const triggerPopSound = () => getAudioEngine().playPop();
  const triggerSparkleSound = () => getAudioEngine().playSparkle();
  const triggerSuccessSound = () => getAudioEngine().playSuccess();

  const playBdaySong = () => {
    const audio = getAudioEngine();
    audio.setInstrument(instrument);
    audio.setTempo(tempo);
    audio.play();
    setIsPlaying(true);
  };

  const stopBdaySong = () => {
    const audio = getAudioEngine();
    audio.stop();
    setIsPlaying(false);
  };

  // Generate dynamic share link
  const generateShareLink = (): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('view', 'sister');
    params.set('lang', lang);
    
    if (sisterName.trim() && sisterName !== 'Sister') {
      params.set('name', sisterName.trim());
    }
    if (relation.trim() && relation !== 'sister') {
      params.set('rel', relation.trim());
    }
    if (customMessage.trim()) {
      params.set('msg', customMessage.trim());
    }
    if (secretMessage.trim()) {
      params.set('secret', secretMessage.trim());
    }
    if (sisterPhoto.trim() && !sisterPhoto.startsWith('data:')) {
      params.set('photo', sisterPhoto.trim());
    }
    params.set('inst', instrument);
    if (countdownTarget) {
      params.set('target', countdownTarget);
    }
    if (lockUntilTarget) {
      params.set('lock', 'true');
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopyLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      triggerSuccessSound();
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      // Fallback
      alert("Unable to copy automatically. Please copy the link text below!");
    });
  };

  const handleResetToDefault = () => {
    setSisterName('Sister');
    setRelation('sister');
    setCustomMessage(lang === 'bn' ? DEFAULT_BENGALI_WISH : DEFAULT_ENGLISH_WISH);
    setSecretMessage(lang === 'bn' ? DEFAULT_BENGALI_SECRET : DEFAULT_ENGLISH_SECRET);
    setSisterPhoto('');
    setInstrument('musicbox');
    triggerSparkleSound();
  };

  const toggleLanguage = (newLang: 'en' | 'bn') => {
    setLang(newLang);
    triggerSparkleSound();
    
    // Switch default wishes if they are not custom modified
    if (!customMessage.trim() || customMessage === DEFAULT_BENGALI_WISH || customMessage === DEFAULT_ENGLISH_WISH) {
      setCustomMessage(newLang === 'bn' ? DEFAULT_BENGALI_WISH : DEFAULT_ENGLISH_WISH);
    }
    if (!secretMessage.trim() || secretMessage === DEFAULT_BENGALI_SECRET || secretMessage === DEFAULT_ENGLISH_SECRET) {
      setSecretMessage(newLang === 'bn' ? DEFAULT_BENGALI_SECRET : DEFAULT_ENGLISH_SECRET);
    }
  };

  // Automatically start happy birthday song when reaching the final reveal stage!
  useEffect(() => {
    if (stage === GameStage.REVEAL && activeView === 'sister') {
      const timer = setTimeout(() => {
        const audio = getAudioEngine();
        audio.setInstrument(instrument);
        audio.setTempo(tempo);
        audio.play();
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, activeView]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden select-none pb-12 font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Mesh starry ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950 to-slate-950 -z-50" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] -z-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-40 pointer-events-none" />

      {/* Floating Sparkles decorative */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none -z-30" />

      {/* Celebration particle effects on grand reveal */}
      {activeView === 'sister' && stage === GameStage.REVEAL && <CelebrationCanvas />}

      {/* ADMIN / CREATOR CONTROLS VIEW SWITCHER (Only shown if NOT opened directly via sister URL) */}
      {!isUrlLoadedView && (
        <div className="w-full bg-slate-900/80 border-b border-white/10 py-3 px-4 sticky top-0 z-50 backdrop-blur-md shadow-md">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UtsavQuestLogo size="sm" />
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent font-sans">
                  UtsavQuest
                </span>
                <span className="text-[9px] bg-purple-900/60 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                  {activeView === 'creator' ? t.creatorSuite : t.tester}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-center">
              {/* Language Switcher Toggle */}
              <div className="flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleLanguage('en')}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage('bn')}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                    lang === 'bn'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  বাংলা
                </button>
              </div>

              {/* View Selector Switch */}
              <div className="flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('creator');
                    getAudioEngine().pause();
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    activeView === 'creator' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  {t.creatorCustomizer}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('sister');
                    setStage(GameStage.GIFT); // Restart quest in testing
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    activeView === 'sister' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.testView}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SISTER LIVE BANNER IN CASE SHE LOADS THE PAGE DIRECTLY */}
      {isUrlLoadedView && (
        <div className="w-full bg-gradient-to-r from-pink-900/20 to-purple-900/20 py-2.5 px-4 text-center border-b border-pink-500/10 backdrop-blur-sm">
          <p className="text-xs font-black text-pink-300 font-sans tracking-wide flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            Special Invitation: Complete all 4 levels to unlock your custom birthday wishes!
          </p>
        </div>
      )}

      {/* SECTION A: CREATOR / ADMIN DASHBOARD */}
      {activeView === 'creator' && (
        <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8 flex-grow">
          
          {/* Welcome intro */}
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center space-y-3">
            <UtsavQuestLogo size="lg" className="mb-2" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent font-sans">
              {t.welcomeTitle}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-lg">
              {t.welcomeSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Customization Forms (7/12 cols) */}
            <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-6 shadow-xl">
              
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <Sliders className="text-pink-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-white">{t.customizerTitle}</h2>
              </div>

              {/* Relationship Type Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
                  {t.whoIsFor}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sister', label: lang === 'bn' ? 'বোন 👭' : 'Sister 👭' },
                    { id: 'brother', label: lang === 'bn' ? 'ভাই 👬' : 'Brother 👬' },
                    { id: 'partner', label: lang === 'bn' ? 'সঙ্গী 💖' : 'Partner 💖' },
                    { id: 'friend', label: lang === 'bn' ? 'বন্ধু 🌟' : 'Friend 🌟' },
                    { id: 'mother', label: lang === 'bn' ? 'মা 👩' : 'Mother 👩' },
                    { id: 'father', label: lang === 'bn' ? 'বাবা 👨' : 'Father 👨' },
                    { id: 'love', label: lang === 'bn' ? 'ভালোবাসা 💘' : 'Love 💘' },
                    { id: 'other', label: lang === 'bn' ? 'অন্যান্য ✏️' : 'Other ✏️' },
                  ].map((item) => {
                    const isSelected = item.id === 'other' 
                      ? !['sister', 'brother', 'partner', 'friend', 'mother', 'father', 'love'].includes(relation.toLowerCase())
                      : relation.toLowerCase() === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setRelation(item.id === 'other' ? (lang === 'bn' ? 'প্রিয়জন' : 'Special One') : item.id);
                          triggerSparkleSound();
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                            : 'bg-black/30 text-slate-300 border-white/10 hover:bg-black/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                {/* Custom input if customized relation is selected */}
                {!['sister', 'brother', 'partner', 'friend', 'mother', 'father', 'love'].includes(relation.toLowerCase()) && (
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder={lang === 'bn' ? "সম্পর্ক লিখুন (যেমন: স্ত্রী, স্বামী, ভাইপো, মেন্টর)" : "Enter relationship (e.g. Wife, Husband, Cousin, Mentor)"}
                    maxLength={20}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-sans transition-all mt-2"
                  />
                )}
              </div>

              {/* Recipient Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={sisterName}
                  onChange={(e) => setSisterName(e.target.value || 'Sister')}
                  placeholder={t.namePlaceholder}
                  maxLength={30}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-sans transition-all"
                />
                <span className="text-[10px] text-slate-500 block text-left">
                  {t.nameHelper}
                </span>
              </div>

              {/* Personalized Wishing Message */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans">
                    {t.wishLabel}
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {customMessage.length} / 800
                  </span>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={t.wishPlaceholder}
                  maxLength={800}
                  rows={6}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-serif leading-relaxed resize-none transition-all"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 text-left">
                    {t.wishHelper}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomMessage(lang === 'bn' ? DEFAULT_BENGALI_WISH : DEFAULT_ENGLISH_WISH)}
                    className="text-[10px] text-pink-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> {t.wishRevert}
                  </button>
                </div>
              </div>

              {/* Secret Message (গোপন বার্তা) Customizer */}
              <div className="bg-gradient-to-br from-purple-950/20 via-indigo-950/20 to-pink-950/10 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-extrabold text-purple-300 uppercase tracking-wider font-sans flex items-center gap-1.5">
                    {t.secretLabel}
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {secretMessage.length} / 400
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-left">
                  {t.secretDesc}
                </p>
                <textarea
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  placeholder={t.secretPlaceholder}
                  maxLength={400}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-serif leading-relaxed resize-none transition-all"
                />
              </div>

              {/* MAGICAL COUNTDOWN CUSTOMIZER */}
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Clock className="text-pink-400 w-4 h-4 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-200">{t.countdownTitle}</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-left">
                  {t.countdownDesc}
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <label className="text-xs font-bold text-purple-300 uppercase tracking-wider font-sans text-left">
                      {t.targetDateLabel}
                    </label>
                    <input
                      type="datetime-local"
                      value={countdownTarget}
                      onChange={(e) => {
                        setCountdownTarget(e.target.value);
                        triggerSparkleSound();
                      }}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                    />
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] text-slate-500 font-sans mr-1">{t.presetsLabel}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCountdownTarget('');
                        triggerSparkleSound();
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        !countdownTarget 
                          ? 'bg-pink-500/20 text-white border-pink-500/50' 
                          : 'bg-black/30 text-slate-400 border-white/5 hover:text-slate-200'
                      }`}
                    >
                      {t.presetNone}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const in1Min = new Date(now.getTime() + 60 * 1000);
                        const year = in1Min.getFullYear();
                        const month = String(in1Min.getMonth() + 1).padStart(2, '0');
                        const day = String(in1Min.getDate()).padStart(2, '0');
                        const hours = String(in1Min.getHours()).padStart(2, '0');
                        const minutes = String(in1Min.getMinutes()).padStart(2, '0');
                        setCountdownTarget(`${year}-${month}-${day}T${hours}:${minutes}`);
                        triggerSparkleSound();
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/30 text-slate-400 border border-white/5 hover:text-slate-200"
                    >
                      {t.preset1Min}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
                        const year = in1Hour.getFullYear();
                        const month = String(in1Hour.getMonth() + 1).padStart(2, '0');
                        const day = String(in1Hour.getDate()).padStart(2, '0');
                        const hours = String(in1Hour.getHours()).padStart(2, '0');
                        const minutes = String(in1Hour.getMinutes()).padStart(2, '0');
                        setCountdownTarget(`${year}-${month}-${day}T${hours}:${minutes}`);
                        triggerSparkleSound();
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/30 text-slate-400 border border-white/5 hover:text-slate-200"
                    >
                      {t.preset1Hour}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(0, 0, 0, 0);
                        const year = tomorrow.getFullYear();
                        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
                        const day = String(tomorrow.getDate()).padStart(2, '0');
                        const hours = String(tomorrow.getHours()).padStart(2, '0');
                        const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
                        setCountdownTarget(`${year}-${month}-${day}T${hours}:${minutes}`);
                        triggerSparkleSound();
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/30 text-slate-400 border border-white/5 hover:text-slate-200"
                    >
                      {t.presetTomorrow}
                    </button>
                  </div>

                  {/* Lock Toggle */}
                  {countdownTarget && (
                    <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5 mt-2">
                      <div className="flex items-center gap-2">
                        {lockUntilTarget ? (
                          <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
                        ) : (
                          <Unlock className="w-4 h-4 text-slate-400" />
                        )}
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-200">{t.lockToggleLabel}</span>
                          <span className="block text-[10px] text-slate-500">{t.lockToggleDesc}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLockUntilTarget(!lockUntilTarget);
                          triggerSparkleSound();
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          lockUntilTarget ? 'bg-pink-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            lockUntilTarget ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sister Photo Upload and URL Input */}
              <CreatorPhotoUpload 
                photo={sisterPhoto} 
                onChange={setSisterPhoto} 
              />

              {/* Default Music Instrument Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider font-sans text-left">
                  {lang === 'bn' ? 'ডিফল্ট জন্মদিনের থিম বাদ্যযন্ত্র' : 'Default Birthday Theme Instrument'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['musicbox', 'piano', 'flute'] as const).map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => handleInstrumentChange(inst)}
                      className={`py-3 px-3 rounded-xl text-xs font-bold capitalize transition-all border flex flex-col items-center gap-1.5 ${
                        instrument === inst 
                          ? 'bg-pink-500/20 border-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]' 
                          : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">
                        {inst === 'musicbox' ? '🧸' : inst === 'piano' ? '🎹' : '🪈'}
                      </span>
                      <span>
                        {inst === 'musicbox' 
                          ? (lang === 'bn' ? 'মিউজিক বক্স' : 'Music Box') 
                          : inst === 'piano' 
                            ? (lang === 'bn' ? 'কনসার্ট পিয়ানো' : 'Concert Piano') 
                            : (lang === 'bn' ? 'রাজকীয় বাঁশি' : 'Royal Flute')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC SHAREABLE LINK BLOCK */}
              <div className="bg-purple-950/20 border border-purple-500/20 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Share2 className="text-purple-400 w-4 h-4 animate-bounce" />
                  <h3 className="text-sm font-black text-purple-200">
                    {lang === 'bn' ? `${sisterName || 'প্রিয়জন'}-এর লিঙ্ক` : `Generate ${sisterName || 'Sister'}'s Link`}
                  </h3>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed text-left">
                  {t.generateDesc}
                </p>

                {/* Display Link Area */}
                <div className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-thin select-all">
                  {generateShareLink()}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      id="btn_copy_share_link"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-scale" /> {t.copiedBtn}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> {t.copyBtn}
                        </>
                      )}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hey ${sisterName}! 🎂 I have created a magical UtsavQuest just for you! 🎁✨ Complete the interactive levels to unwrap your gift, blow candles, cut the cake, and unlock your special surprise!\n\nতোমার জন্য একটি চমৎকার ম্যাজিকাল উৎসবকোয়েস্ট (UtsavQuest) তৈরি করেছি! সব লেভেল পার করে তোমার গিফট, কেক এবং উইশ আনলক করে নাও! 💖🎈\n\nPlay here: ${generateShareLink()}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerSparkleSound()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-center"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {lang === 'bn' ? 'হোয়াটসঅ্যাপে শেয়ার করুন' : 'Share on WhatsApp'}
                    </a>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title={lang === 'bn' ? 'কাস্টমাইজার রিসেট করুন' : 'Reset Customizer to Defaults'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> {t.resetBtn}
                  </button>
                </div>

                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-400 text-[10px] font-bold text-center font-sans flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3" /> {lang === 'bn' ? `ক্লিপবোর্ডে কপি হয়েছে! জন্মদিনের উইশ শুরু করতে এই লিঙ্কটি ${sisterName || 'তাঁকে'} পাঠান!` : `Copied to clipboard! Send this URL to ${sisterName || 'them'} to begin their magical levels!`}
                  </motion.div>
                )}
              </div>

            </div>

            {/* Right Column: Live Testing, Instrument Check & Playable Drums (5/12 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* INTERACTIVE DRUM KIT (THE USER REQUIREMENT) */}
              <DrumPad 
                playKick={playKick}
                playSnare={playSnare}
                playHihat={playHihat}
                playCrash={playCrash}
                playTom={playTom}
                playDrumRoll={playDrumRoll}
                lang={lang}
              />

              {/* PREVIEW & MUSIC SYNTH TUNER */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-5">
                
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Music className="text-pink-400 w-5 h-5" />
                  <h2 className="text-base font-bold text-white">{t.melodyTitle}</h2>
                </div>

                <div className="bg-black/40 rounded-2xl p-4 flex flex-col items-center gap-4 border border-white/5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-slate-400 font-bold">{t.melodyTest}</span>
                    <button
                      type="button"
                      onClick={toggleSong}
                      className="w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center shadow"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                  </div>

                  {/* Karaoke bubble mock */}
                  <div className="w-full bg-purple-950/30 border border-purple-500/10 rounded-xl py-3 px-4 text-center">
                    <p className="text-xs font-black text-pink-300 italic">
                      "{currentLyric}"
                    </p>
                  </div>

                  {/* Automated Backing Drum Track Toggle */}
                  <div className="flex items-center justify-between w-full border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Drum className="text-purple-400 w-3.5 h-3.5" />
                      <span className="text-xs text-slate-300 font-bold">{t.backingTrackLabel}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutoDrumToggle(!autoDrum)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        autoDrum ? 'bg-pink-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          autoDrum ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* VISUAL LAYOUT CARD PREVIEW */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block font-sans text-left">
                    {t.previewCardLabel}
                  </span>
                  <div className="bg-gradient-to-b from-[#fdf6e2] to-[#f4ebd0] p-5 rounded-2xl border-2 border-amber-800/10 text-amber-950 text-center space-y-4">
                    <Heart className="text-red-600 fill-red-600 w-5 h-5 mx-auto" />
                    <h4 className="text-lg font-black text-pink-700 font-sans leading-none">
                      {lang === 'bn' ? `শুভ জন্মদিন, ${sisterName}! 🎉` : `Happy Birthday, ${sisterName}! 🎉`}
                    </h4>
                    
                    {sisterPhoto ? (
                      <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-amber-800/20 shadow-md">
                        <img 
                          src={sisterPhoto} 
                          alt={sisterName} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-lg bg-amber-900/5 border-2 border-dashed border-amber-900/20 flex flex-col items-center justify-center text-amber-900/40 text-[9px] font-bold p-1">
                        {t.polaroidPlaceholder}
                      </div>
                    )}

                    <p className="text-[10.5px] font-serif leading-relaxed italic text-justify px-1 line-clamp-4">
                      "{customMessage}"
                    </p>
                    <div className="h-[1px] bg-amber-900/10 w-12 mx-auto" />
                  </div>
                </div>

                {/* DYNAMIC COUNTDOWN PREVIEW IN CREATOR VIEW */}
                {countdownTarget && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block font-sans text-left">
                      {t.previewCountdownLabel}
                    </span>
                    <CountdownTimer 
                      targetDate={countdownTarget} 
                      title={lang === 'bn' ? `${sisterName || 'প্রিয়জন'}-এর লাইভ কাউন্টডাউন` : `${relation ? relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase() : 'Recipient'}'s Live Countdown`}
                      relation={relation}
                      lockMode={lockUntilTarget}
                    />
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Quick Guide */}
          <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-4 flex gap-3 items-start text-xs text-slate-400">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-left">
              {t.guideHowToShare}
            </p>
          </div>

        </div>
      )}

      {/* SECTION B: SISTER / USER GAME QUEST VIEW */}
      {activeView === 'sister' && (
        <div className="flex-grow flex flex-col">
          
          {/* Header Glassbar */}
          <header className="sticky top-0 z-30 w-full max-w-5xl mx-auto px-4 pt-4 pb-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              
              <div className="flex items-center gap-3">
                <UtsavQuestLogo size="md" />
                <div className="text-left">
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent font-sans flex items-center gap-2">
                    {lang === 'bn' ? `${sisterName}-এর উৎসবকোয়েস্ট` : `${sisterName}'s UtsavQuest`} 💜
                  </h1>
                  <p className="text-[10px] text-purple-300 font-mono uppercase tracking-wider">
                    {t.stageLabel} {stage === GameStage.GIFT ? '1' : stage === GameStage.CAKE ? '2' : stage === GameStage.BALLOONS ? '3' : stage === GameStage.CATCHER ? '4' : '5'}: {lang === 'bn' ? (stage === GameStage.GIFT ? 'উপহার' : stage === GameStage.CAKE ? 'কেক কাটা' : stage === GameStage.BALLOONS ? 'বেলুন খেলা' : stage === GameStage.CATCHER ? 'আশীর্বাদ সংগ্রহ' : 'উন্মোচন') : stage}
                  </p>
                </div>
              </div>

              {/* Stage Progress Tracker Dots */}
              <div className="flex items-center gap-2">
                {[GameStage.GIFT, GameStage.CAKE, GameStage.BALLOONS, GameStage.CATCHER, GameStage.REVEAL].map((s, idx) => {
                  const active = s === stage;
                  const completed = 
                    (s === GameStage.GIFT && stage !== GameStage.GIFT) ||
                    (s === GameStage.CAKE && stage !== GameStage.GIFT && stage !== GameStage.CAKE) ||
                    (s === GameStage.BALLOONS && (stage === GameStage.CATCHER || stage === GameStage.REVEAL)) ||
                    (s === GameStage.CATCHER && stage === GameStage.REVEAL);

                  return (
                    <div key={idx} className="flex items-center">
                      <motion.div 
                        id={`progress_dot_${s}`}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                          active 
                            ? 'bg-pink-500 border-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)] scale-110' 
                            : completed 
                              ? 'bg-purple-600 border-purple-500 text-purple-200' 
                              : 'bg-black/40 border-white/10 text-slate-500'
                        }`}
                        animate={active ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {idx + 1}
                      </motion.div>
                      {idx < 4 && (
                        <div className={`w-4 h-0.5 ${completed ? 'bg-purple-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </header>

          {/* Main Quest Container */}
          <main className="flex-grow flex items-center justify-center px-4 py-6 max-w-5xl mx-auto w-full z-20">
            <AnimatePresence mode="wait">
              {isQuestLocked ? (
                <motion.div
                  key="lock-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="w-full flex justify-center"
                >
                  <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden space-y-6 text-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-amber-500/10 -z-10 rounded-3xl" />
                    
                    <div className="mx-auto w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-500/30 animate-pulse shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                      <Lock className="text-pink-400 w-8 h-8" />
                    </div>

                    <div className="space-y-2 text-center">
                      <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                        {t.questLockedTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-purple-200">
                        {lang === 'bn' ? `${sisterName}-এর জন্য একটি চমৎকার জাদুকরী সারপ্রাইজ তৈরি করা হয়েছে! এটি আনলক হতে আর মাত্র বাকি:` : `A magical birthday surprise has been prepared for ${sisterName}! It will unlock in exactly:`}
                      </p>
                    </div>

                    <CountdownTimer 
                      targetDate={countdownTarget} 
                      title={lang === 'bn' ? 'আনলক হতে বাকি সময়' : 'Time left until unlocking'} 
                      relation={relation}
                      lockMode={true}
                    />

                    <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-500/20 text-[11px] text-purple-200 leading-relaxed font-sans text-left">
                      {lang === 'bn' 
                        ? '👀 এই স্পেশাল উপহারটি সম্পূর্ণ সারপ্রাইজ রাখতে লক করা রয়েছে। কাউন্টডাউন শেষ হওয়া মাত্রই এটি নিজে থেকেই আনলক হয়ে যাবে!' 
                        : '👀 This special gift is locked to keep it as a complete surprise. It will automatically unlock as soon as the countdown ends!'}
                    </div>

                    {/* Creator test bypass button */}
                    {!isUrlLoadedView && (
                      <button
                        type="button"
                        onClick={() => {
                          // Bypass for creator testing
                          setLockUntilTarget(false);
                          triggerSparkleSound();
                        }}
                        className="text-[11px] text-pink-400 hover:text-pink-300 font-bold underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <Unlock className="w-3.5 h-3.5" /> {lang === 'bn' ? '(ক্রিয়েটর অপশন: টেস্ট করার জন্য লক বাইপাস করুন)' : '(Creator Option: Bypass Lock for Testing)'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* STAGE 1: Unwrap Gift Box */}
                  {stage === GameStage.GIFT && (
                <motion.div
                  key="gift"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <GiftBox 
                    onUnwrap={() => setStage(GameStage.CAKE)} 
                    playSparkle={triggerSparkleSound}
                    playSuccess={triggerSuccessSound}
                    lang={lang}
                    relation={relation}
                  />
                </motion.div>
              )}

              {/* STAGE 2: Light Birthday Cake */}
              {stage === GameStage.CAKE && (
                <motion.div
                  key="cake"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <CakeScreen 
                    onComplete={() => setStage(GameStage.BALLOONS)}
                    playSparkle={triggerSparkleSound}
                    playSuccess={triggerSuccessSound}
                    playBdaySong={playBdaySong}
                    stopBdaySong={stopBdaySong}
                    lang={lang}
                  />
                </motion.div>
              )}

              {/* STAGE 3: Pop Balloons Game */}
              {stage === GameStage.BALLOONS && (
                <motion.div
                  key="balloons"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <BalloonGame 
                    onComplete={(words) => {
                      setCollectedWords(words);
                      setStage(GameStage.CATCHER);
                    }}
                    playPop={triggerPopSound}
                    playSuccess={triggerSuccessSound}
                    relation={relation}
                    lang={lang}
                  />
                </motion.div>
              )}

              {/* STAGE 4: Blessing Catcher Game */}
              {stage === GameStage.CATCHER && (
                <motion.div
                  key="catcher"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center"
                >
                  <BlessingCatcher 
                    onComplete={() => setStage(GameStage.REVEAL)}
                    playSparkle={triggerSparkleSound}
                    playSuccess={triggerSuccessSound}
                    lang={lang}
                  />
                </motion.div>
              )}

              {/* STAGE 5: The Grand Reveal & Birthday Wishes Climax */}
              {stage === GameStage.REVEAL && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full space-y-8"
                >
                  {/* Karaoke Banner bar */}
                  <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Audio buttons / instrument selectors */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={toggleSong}
                        id="btn_toggle_song"
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                      </button>

                      <div className="flex rounded-xl bg-black/40 p-1 border border-white/5 text-xs font-bold">
                        {(['musicbox', 'piano', 'flute'] as const).map((inst) => (
                          <button
                            key={inst}
                            onClick={() => handleInstrumentChange(inst)}
                            className={`px-3 py-1.5 rounded-lg capitalize transition-all ${instrument === inst ? 'bg-pink-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                          >
                            {inst === 'musicbox' ? (lang === 'bn' ? '🧸 মিউজিকবক্স' : '🧸 Musicbox') : inst === 'piano' ? (lang === 'bn' ? '🎹 পিয়ানো' : '🎹 Piano') : (lang === 'bn' ? '🪈 বাঁশি' : '🪈 Flute')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Lyrics Bouncing bubble */}
                    <div className="flex-1 flex justify-center">
                      <motion.div 
                        key={currentLyric}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-purple-950/50 border border-purple-500/20 rounded-full py-2 px-6 shadow text-pink-300 font-extrabold text-sm md:text-base flex items-center gap-2"
                      >
                        <Music className="w-4 h-4 animate-bounce" />
                        <span>{currentLyric}</span>
                        {currentNoteName && (
                          <span className="text-[10px] font-mono bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded border border-pink-500/30">
                            {currentNoteName}
                          </span>
                        )}
                      </motion.div>
                    </div>

                    {/* Tempo & Drum backing controls */}
                    <div className="flex flex-col gap-3 shrink-0">
                      {/* Tempo slider */}
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-purple-200 font-sans">
                        <span>{lang === 'bn' ? 'গতি' : 'Speed'}</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min="80"
                            max="160"
                            value={tempo}
                            onChange={(e) => handleTempoChange(Number(e.target.value))}
                            className="accent-pink-500 h-1 w-20 bg-black/40 rounded-lg cursor-pointer"
                          />
                          <span className="font-mono w-6 text-right">{tempo}</span>
                        </div>
                      </div>

                      {/* Drum Backing Switch */}
                      <button
                        type="button"
                        onClick={() => handleAutoDrumToggle(!autoDrum)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-between gap-2 border transition-all ${
                          autoDrum 
                            ? 'bg-purple-500/20 border-pink-500/50 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]' 
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Drum className={`w-3.5 h-3.5 ${autoDrum ? 'animate-bounce' : ''}`} />
                          <span>{lang === 'bn' ? 'ড্রাম ব্যাকগ্রাউন্ড' : 'Drum Backing'}</span>
                        </span>
                        <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded text-pink-300 font-bold">
                          {autoDrum ? (lang === 'bn' ? 'চালু' : 'ON') : (lang === 'bn' ? 'বন্ধ' : 'OFF')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Grid block: Polaroid and Bengali Wishes Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    
                    {/* Polaroid Card Column (Left, 2 cols) */}
                    <div className="lg:col-span-2 flex flex-col items-center">
                      <PolaroidUpload 
                        onImageLoaded={(url) => setSisterPhoto(url)} 
                        savedUrl={sisterPhoto} 
                        recipientMode={activeView === 'sister'}
                        relationLabel={relation}
                        lang={lang}
                      />
                      
                      {!sisterPhoto && activeView !== 'sister' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          className="text-center mt-3 max-w-xs text-[11px] text-purple-300 italic leading-relaxed"
                        >
                          {lang === 'bn' 
                            ? '💡 জন্মদিনের বোর্ডে ছবি প্রদর্শন করতে উপরের পোলারয়েড ফ্রেমে আপনার ছবি ড্র্যাগ অ্যান্ড ড্রপ বা স্পর্শ করুন!' 
                            : '💡 Drag & drop your photograph into the Polaroid frame above to display it on your birthday board!'}
                        </motion.div>
                      )}
                    </div>

                    {/* Glowing Bengali Wish Scroll Card Column (Right, 3 cols) */}
                    <div className="lg:col-span-3">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-b from-[#fdf6e2] to-[#f4ebd0] p-8 rounded-3xl shadow-[0_20px_50px_rgba(139,92,26,0.3)] border-4 border-amber-800/20 relative text-amber-950 overflow-hidden"
                      >
                        {/* Golden vintage scroll borders */}
                        <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-amber-900/10" />
                        <div className="absolute top-0 bottom-0 right-4 w-[1px] bg-amber-900/10" />

                        {/* Royal floral corner details */}
                        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-800/40 rounded-tl" />
                        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-800/40 rounded-tr" />
                        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-800/40 rounded-bl" />
                        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-800/40 rounded-br" />

                        {/* Heart symbol decorative */}
                        <div className="flex justify-center mb-4">
                          <Heart className="text-red-600 fill-red-600 w-8 h-8 animate-pulse" />
                        </div>

                        {/* Grand Bengali Greeting Content */}
                        <div className="text-center space-y-6">
                          
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-pink-700 font-sans border-b-2 border-pink-700/10 pb-4">
                            {lang === 'bn' ? `শুভ জন্মদিন, ${sisterName}! 🎉🎂💜` : `Happy Birthday, ${sisterName}! 🎉🎂💜`}
                          </h2>

                          {/* Dynamic wishing text customized by creator */}
                          <p className="text-sm sm:text-base leading-relaxed font-serif font-medium text-amber-900 text-justify hyphens-auto px-1 whitespace-pre-line">
                            {customMessage}
                          </p>

                          {/* Sweet closing decoration */}
                          <div className="flex items-center justify-center gap-2 pt-4">
                            <div className="h-[1px] bg-amber-900/20 w-16" />
                            <Sparkles className="text-amber-600 w-5 h-5 animate-spin-slow" />
                            <div className="h-[1px] bg-amber-900/20 w-16" />
                          </div>
                        </div>
                      </motion.div>

                      {secretMessage && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="mt-6"
                        >
                          <SecretMessageArea
                            secretMessage={secretMessage}
                            relation={relation}
                            playSuccess={triggerSuccessSound}
                            playSparkle={triggerSparkleSound}
                            lang={lang}
                          />
                        </motion.div>
                      )}
                    </div>

                  </div>

                  {/* INTERACTIVE DRUMS - HELD FOR CREATOR WORKSPACE ONLY, HIDDEN FOR RECIPIENT */}
                  {activeView !== 'sister' && (
                    <DrumPad 
                      audioEngine={getAudioEngine()}
                      playKick={playKick}
                      playSnare={playSnare}
                      playHihat={playHihat}
                      playCrash={playCrash}
                      playTom={playTom}
                      playDrumRoll={playDrumRoll}
                    />
                  )}

                  {/* Trivia module */}
                  <div className="w-full">
                    <SisterQuiz relation={relation} recipientName={sisterName} lang={lang} />
                  </div>

                  {/* Memory Wish Board */}
                  <div className="w-full">
                    <MemoryWall relation={relation} readOnly={activeView === 'sister'} lang={lang} />
                  </div>

                </motion.div>
              )}
                </>
              )}

            </AnimatePresence>
          </main>

        </div>
      )}

      {/* Universal Footer with Subham Ghorai Creator & CEO credit */}
      <footer className="mt-auto py-6 text-center text-xs text-slate-500 font-sans border-t border-white/5 w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-1 shrink-0 relative z-30">
        <p className="flex items-center gap-1.5 justify-center flex-wrap">
          <span>{lang === 'bn' ? 'তৈরি করেছেন' : 'Created with'}</span>
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
          <span>{lang === 'bn' ? 'এবং পরিচালনা করেছেন' : 'by'}</span>
          <span className="font-extrabold text-pink-400 hover:text-pink-300 transition-colors">Subham Ghorai</span>
        </p>
        <p className="text-[9px] text-slate-600 tracking-wider uppercase font-mono font-bold">
          {lang === 'bn' ? 'সিইও ও প্রতিষ্ঠাতা — উৎসবকোয়েস্ট' : 'CEO & Founder — UtsavQuest'}
        </p>
      </footer>

    </div>
  );
}
