import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickyNote } from '../types';
import { Pin, Plus, Trash2, Heart, Edit3 } from 'lucide-react';

const POSTIT_COLORS = [
  'bg-amber-100 border-amber-200 text-amber-900', // yellow
  'bg-pink-100 border-pink-200 text-pink-900',     // pink
  'bg-cyan-100 border-cyan-200 text-cyan-900',     // blue
  'bg-emerald-100 border-emerald-200 text-emerald-900', // green
];

const COLOR_CODES = [
  '#fef3c7', // amber/yellow
  '#fce7f3', // pink
  '#ecfeff', // cyan
  '#ecfdf5'  // emerald
];

const DEFAULT_NOTES: StickyNote[] = [
  {
    id: 'default-1',
    text: "তুমি শুধু আমার বোন নও, আমার জীবনের অন্যতম সেরা উপহার! ঈশ্বরের আশীর্বাদে তোমার জীবনের প্রতিটি মুহূর্ত খুশিতে ভরে উঠুক। শুভ জন্মদিন বোন! 💜🎂",
    color: 'bg-amber-100 border-amber-200 text-amber-900',
    x: 0,
    y: 0,
    date: '2026-06-29',
    author: 'তোমার শুভাকাঙ্ক্ষী'
  },
  {
    id: 'default-2',
    text: "দেরিতে জানতে পারলেও, মন থেকে তোমার জন্য অফুরন্ত শুভকামনা আর ভালোবাসা রইল। সবসময় এভাবে প্রাণখুলে হাসবে আর এগিয়ে যাবে! 🌸✨",
    color: 'bg-pink-100 border-pink-200 text-pink-900',
    x: 0,
    y: 0,
    date: '2026-06-29',
    author: 'দাদা'
  }
];

interface MemoryWallProps {
  relation?: string;
  readOnly?: boolean;
  lang?: 'en' | 'bn';
}

export default function MemoryWall({ 
  relation = 'sister', 
  readOnly = false,
  lang = 'bn'
}: MemoryWallProps) {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [inputText, setInputText] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedColor, setSelectedColor] = useState(POSTIT_COLORS[0]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('sister_birthday_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        setNotes(DEFAULT_NOTES);
      }
    } else {
      setNotes(DEFAULT_NOTES);
      localStorage.setItem('sister_birthday_notes', JSON.stringify(DEFAULT_NOTES));
    }
  }, []);

  const saveNotesToStorage = (newNotes: StickyNote[]) => {
    setNotes(newNotes);
    localStorage.setItem('sister_birthday_notes', JSON.stringify(newNotes));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      text: inputText.trim(),
      color: selectedColor,
      x: 0,
      y: 0,
      date: new Date().toISOString().split('T')[0],
      author: author.trim() || 'Anonymous'
    };

    const updated = [newNote, ...notes];
    saveNotesToStorage(updated);
    setInputText('');
    setAuthor('');
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    saveNotesToStorage(filtered);
  };

  const relLower = relation.toLowerCase();

  return (
    <div className="w-full bg-orange-950/20 backdrop-blur-md rounded-3xl p-6 border border-amber-900/10 shadow-xl overflow-hidden select-none animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Edit3 className="text-amber-400 w-5 h-5" />
        <h3 className="text-xl font-bold text-amber-100 font-sans">
          {readOnly 
            ? (lang === 'bn' ? "জন্মদিনের শুভেচ্ছা বোর্ড! 📝✨" : "Birthday Wish Board! 📝✨") 
            : (lang === 'bn' ? "একটি গোপন জন্মদিনের শুভেচ্ছা লিখুন! 📝" : "Write a Secret Birthday Wish! 📝")}
        </h3>
      </div>
      <p className="text-xs text-amber-200/70 mb-6 leading-relaxed font-sans">
        {readOnly 
          ? (lang === 'bn' 
              ? "প্রিয়জনরা আপনার জন্য সুন্দর স্মৃতি, আশীর্বাদ এবং গোপন শুভেচ্ছা পিন করে রেখেছেন! পড়তে উপভোগ করুন! 💖" 
              : "Loved ones have pinned sweet memories, blessings, and private birthday wishes here for you! Enjoy reading them! 💖")
          : (lang === 'bn' 
              ? `আপনার প্রিয় ${relation.toLowerCase() === 'sister' ? 'বোনের' : relation}-এর বোর্ডে একটি সুন্দর স্মৃতি, দোয়া বা শুভেচ্ছা পিন করুন। এটি স্থানীয়ভাবে একটি স্মৃতি হিসেবে সংরক্ষিত থাকবে!` 
              : `Pin a heartwarming memory, prayer, or surprise message on your ${relLower}'s board. It will be saved locally as a sweet keepsake sticky note!`)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sticky Note Creator Form */}
        {!readOnly && (
          <form onSubmit={handleAddNote} className="bg-neutral-900/50 p-5 rounded-2xl border border-white/5 space-y-4 h-fit">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-sans">
                {lang === 'bn' ? 'আপনার বার্তা (বাংলা বা ইংরেজি)' : 'Your Message (Bengali or English)'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={lang === 'bn' ? 'তোমার প্রিয়জনের জন্য একটি সুন্দর স্মৃতি বা মেসেজ লেখো...' : 'Write a beautiful memory or message for your loved one...'}
                maxLength={200}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans resize-none"
              />
              <div className="text-right text-[10px] text-gray-500 mt-1">
                {inputText.length} / 200
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-sans">
                  {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={lang === 'bn' ? 'নাম' : 'Name'}
                  maxLength={20}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-sans">
                  {lang === 'bn' ? 'স্টিকি কালার' : 'Sticky Color'}
                </label>
                <div className="flex gap-1.5 mt-1 items-center h-8">
                  {POSTIT_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedColor === col ? 'scale-125 border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: COLOR_CODES[idx] }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn_pin_wish"
              className="w-full bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 text-white font-black py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 text-xs uppercase tracking-wider font-sans flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> {lang === 'bn' ? 'শুভেচ্ছা স্টিকি পিন করুন' : 'Pin Sticky Wish'}
            </button>
          </form>
        )}

        {/* Board Display */}
        <div className={`${readOnly ? 'md:col-span-3' : 'md:col-span-2'} bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 to-amber-950/70 border-4 border-amber-900/40 p-4 rounded-2xl min-h-[300px] shadow-inner relative flex flex-wrap gap-4 items-start justify-center max-h-[420px] overflow-y-auto`}>
          {/* Cork pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          <AnimatePresence>
            {notes.map((note, index) => {
              // Deterministic rotation so they stay angled
              const rotation = (index % 3) * 3 - 3;
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ scale: 0, y: 20, rotate: 0 }}
                  animate={{ scale: 1, y: 0, rotate: rotation }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                  className={`relative p-4 rounded-md shadow-lg border w-44 min-h-[160px] flex flex-col justify-between ${note.color} transform transition-transform`}
                >
                  {/* Pin at the top */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <Pin className="text-red-500 fill-red-500 w-4 h-4 filter drop-shadow-sm" />
                  </div>

                  {/* Body text */}
                  <p className="font-serif text-xs leading-relaxed italic select-text break-words pt-1">
                    "{note.text}"
                  </p>

                  {/* Note Footer */}
                  <div className="border-t border-black/10 pt-2 mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-sans font-bold tracking-tight truncate max-w-[100px] opacity-75">
                      — {note.author}
                    </span>
                    
                    {/* Delete button (hidden by default, shows on hover or tap) */}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-700/40 hover:text-red-700 hover:scale-110 p-0.5 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-full text-amber-200/30 w-full pt-16">
              <Pin className="w-8 h-8 mb-2" />
              <p className="text-sm font-sans italic">
                {lang === 'bn' ? 'বোর্ডটি বর্তমানে খালি আছে।' : 'The board is currently empty.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
