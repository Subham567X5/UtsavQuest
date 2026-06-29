import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Check, X } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

interface SisterQuizProps {
  relation?: string;
  recipientName?: string;
  lang?: 'en' | 'bn';
}

const getQuizQuestions = (relation: string, name: string): Question[] => {
  const relCap = relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase();
  
  // Custom Bengali relation word
  let bengaliRel = `${relCap} এর`;
  if (relation.toLowerCase() === 'sister') bengaliRel = 'বোন বা দিদির';
  else if (relation.toLowerCase() === 'brother') bengaliRel = 'ভাই বা দাদার';
  else if (relation.toLowerCase() === 'mother') bengaliRel = 'মায়ের';
  else if (relation.toLowerCase() === 'father') bengaliRel = 'বাবার';
  else if (relation.toLowerCase() === 'partner') bengaliRel = 'পার্টনারের';
  else if (relation.toLowerCase() === 'friend') bengaliRel = 'বন্ধুর';
  else if (relation.toLowerCase() === 'love') bengaliRel = 'ভালবাসার মানুষের';

  return [
    {
      id: 1,
      text: `${bengaliRel} সবচেয়ে বড় সুপারপাওয়ার কী? (What is ${name}'s ultimate superpower?)`,
      options: [
        "সবসময় সঠিক পরামর্শ দেওয়া (Always giving the perfect advice)",
        `মিষ্টি হাসি দিয়ে যেকোনো পরিবেশ আলোকিত করা (Brightening up any environment with a smile 💜)`,
        "অফুরন্ত ধৈর্য রাখা ও ভরসা দেওয়া (Having endless patience and support)",
        "উপরের সবগুলোই! (All of the above!)"
      ],
      correctIdx: 3,
      explanation: "একেবারেই ঠিক! প্রিয় মানুষেরা সব গুণেই ভরপুর থাকেন, তারা একাধারে অভিভাবক ও সবচেয়ে ভালো বন্ধু!"
    },
    {
      id: 2,
      text: `জন্মদিনে তার মুখে সবচেয়ে সুন্দর হাসি ফোটানোর সেরা উপায় কী? (Best way to bring a smile to ${name}'s face?)`,
      options: [
        "তাকে মন ছুঁয়ে যাওয়া উপহার দেওয়া (Gifting them a beautiful, memorable gift)",
        "তাকে শক্ত করে জড়িয়ে ধরে মন থেকে শুভ জন্মদিন গান গাওয়া (A warm hug and singing Happy Birthday! 🎤)",
        "তার সাথে কোয়ালিটি সময় কাটানো ও গল্প করা (Spending quality time sharing stories)",
        "এই সবগুলোই একসাথে করা! (Doing all of these together! 🎂🌸)"
      ],
      correctIdx: 3,
      explanation: `নিশ্চয়ই! প্রিয় সম্পর্কের মানুষের জন্য উপহারের চেয়ে বেশি মূল্যবান হলো ভালোবাসা, আন্তরিকতা আর একসাথে কাটানো সুন্দর কিছু মুহূর্ত।`
    },
    {
      id: 3,
      text: `আজকের এই শুভ জন্মদিনে তার জন্য আমাদের মনে সবচেয়ে বড় প্রার্থনা কী হওয়া উচিত? (Our ultimate wish for ${name}?)`,
      options: [
        "যেন তার জীবন সুখ ও অফুরন্ত হাসিতে ভরে ওঠে (May their life be filled with joy & laughter)",
        "উত্তম সুস্বাস্থ্য ও দীর্ঘায়ু লাভ (Excellent health and long life)",
        "তার সব স্বপ্ন যেন একে একে সত্যি হয় (May all their dreams come true one by one 🌟)",
        "সবগুলোই! (Absolutely all of them!)"
      ],
      correctIdx: 3,
      explanation: "সত্যিই! তার জীবনের প্রতিটি দিন যেন ঈশ্বরের আশীর্বাদে সুখ, সাফল্য আর সুস্বাস্থ্যে ভরে ওঠে। এটাই আমাদের মন থেকে করা একমাত্র প্রার্থনা।"
    }
  ];
};

export default function SisterQuiz({ 
  relation = 'sister', 
  recipientName = 'Sister',
  lang = 'bn'
}: SisterQuizProps) {
  const QUIZ_QUESTIONS = getQuizQuestions(relation, recipientName);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    if (answered) return;
    setSelectedIdx(optionIdx);
    setAnswered(true);

    const isCorrect = optionIdx === QUIZ_QUESTIONS[currentIdx].correctIdx;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setAnswered(false);
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswered(false);
    setQuizFinished(false);
    setScore(0);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const relCap = relation.charAt(0).toUpperCase() + relation.slice(1).toLowerCase();

  return (
    <div className="w-full bg-purple-950/20 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl overflow-hidden select-none">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400 w-5 h-5 animate-bounce" />
        <h3 className="text-xl font-bold text-purple-100 font-sans">
          {lang === 'bn' 
            ? `আপনি আপনার ${relation.toLowerCase() === 'sister' ? 'বোনকে' : relation} কতটা চেনেন? 🌸` 
            : `How Well Do You Know Your ${relCap}? 🌸`}
        </h3>
      </div>
      <p className="text-xs text-purple-200/70 mb-6 leading-relaxed font-sans">
        {lang === 'bn'
          ? `আপনার প্রিয় ${relation.toLowerCase() === 'sister' ? 'বোনের' : relation} গুণাবলী, স্নেহ ও জন্মদিন উদযাপন নিয়ে ৩টি প্রশ্নের চমৎকার কুইজে অংশ নিন!`
          : `Take a lovely interactive 3-question quiz about the warmth, traits, and birthday celebration of a beloved ${relation}!`}
      </p>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
              <span>
                {lang === 'bn' 
                  ? `প্রশ্ন ${currentIdx + 1} / ${QUIZ_QUESTIONS.length}` 
                  : `Question ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}`}
              </span>
              <span>
                {lang === 'bn' ? `স্কোর: ${score}` : `Score: ${score}`}
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-base font-extrabold text-white leading-snug font-sans py-2">
              {currentQuestion.text}
            </h4>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === currentQuestion.correctIdx;
                
                let btnStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-white";
                if (answered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                  } else if (isSelected) {
                    btnStyle = "bg-red-500/20 border-red-500 text-red-200";
                  } else {
                    btnStyle = "bg-white/5 border-white/5 text-white/40 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold font-sans transition-all flex items-center justify-between ${btnStyle} ${!answered ? 'active:scale-98' : ''}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    {answered && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-900/40 p-4 rounded-xl border border-purple-500/20 text-xs text-purple-200 leading-relaxed font-sans"
              >
                <span className="font-extrabold text-yellow-300 block mb-1">
                  {selectedIdx === currentQuestion.correctIdx 
                    ? (lang === 'bn' ? "🎉 একেবারেই সঠিক!" : "🎉 Absolutely Correct!") 
                    : (lang === 'bn' ? "✨ চমৎকার উত্তর!" : "✨ Beautiful Answer!")}
                </span>
                {currentQuestion.explanation}
              </motion.div>
            )}

            {/* Next button */}
            {answered && (
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-sans mt-2"
              >
                {currentIdx + 1 === QUIZ_QUESTIONS.length 
                  ? (lang === 'bn' ? "কুইজ শেষ করুন 🏆" : "Finish Quiz 🏆") 
                  : (lang === 'bn' ? "পরবর্তী প্রশ্ন ➡️" : "Next Question ➡️")}
              </button>
            )}
          </motion.div>
        ) : (
          /* Finished Quiz Summary */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <Sparkles className="text-yellow-300 w-16 h-16 mx-auto animate-bounce" />
            <h4 className="text-2xl font-black text-white font-sans">
              {lang === 'bn' 
                ? `${relation.toLowerCase() === 'sister' ? 'বোন' : relation} কুইজ মাস্টার! 👑` 
                : `${relCap} Trivia Master! 👑`}
            </h4>
            <p className="text-xs text-purple-200 font-sans max-w-sm mx-auto leading-relaxed">
              {lang === 'bn' ? (
                <>আপনি কুইজে স্কোর করেছেন <span className="text-yellow-300 font-black text-sm">{score} / {QUIZ_QUESTIONS.length}</span>! আপনি স্পষ্টতই বোঝেন যে আপনার {relation.toLowerCase() === 'sister' ? 'বোন' : relation} আপনার জীবনের অন্যতম যত্নশীল, আনন্দময় এবং চমৎকার আশীর্বাদ। 💜</>
              ) : (
                <>You scored <span className="text-yellow-300 font-black text-sm">{score} / {QUIZ_QUESTIONS.length}</span>! You clearly understand that your {relation} is one of the most caring, joyful, and precious blessings in the world. 💜</>
              )}
            </p>

            <div className="flex gap-4 justify-center pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="bg-white/10 hover:bg-white/25 border border-white/10 text-white font-bold py-2 px-5 rounded-full text-xs uppercase tracking-wider font-sans"
              >
                {lang === 'bn' ? 'আবার খেলুন' : 'Play Again'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
