import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/suroboyoData';
import { playSound } from '../utils/audio';

interface SpeedQuizGameProps {
  onAddXp: (amount: number, reason: string) => void;
  onFinishGame?: (score: number) => void;
}

export const SpeedQuizGame: React.FC<SpeedQuizGameProps> = ({ onAddXp, onFinishGame }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [lifelineFiftyUsed, setLifelineFiftyUsed] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  // Countdown timer
  useEffect(() => {
    if (isAnswered || isGameOver) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isGameOver]);

  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1);
    setStreak(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isGameOver) return;
    if (eliminatedOptions.includes(idx)) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;

    if (isCorrect) {
      const streakBonus = Math.min(streak * 5, 25);
      const timeBonus = Math.floor(timeLeft * 2);
      const earnedPoints = 100 + streakBonus + timeBonus;

      setScore((prev) => prev + earnedPoints);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);

      onAddXp(20, 'Menjawab benar soal kuis Suroboyoan');
    } else {
      setStreak(0);
    }
  };

  const handleFiftyFifty = () => {
    if (lifelineFiftyUsed || isAnswered || isGameOver) return;
    setLifelineFiftyUsed(true);

    const wrongIndices = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correctIndex);
    
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  const handleNextQuestion = () => {
    setEliminatedOptions([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      onAddXp(50, 'Menyelesaikan tantangan Kuis Suroboyoan');
      if (onFinishGame) onFinishGame(score);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setEliminatedOptions([]);
    setLifelineFiftyUsed(false);
  };

  if (isGameOver) {
    const isMaster = score >= 800;
    const isGood = score >= 500;

    return (
      <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-sm">
        <div className="inline-flex p-4 rounded-3xl bg-blue-50 border border-blue-200 text-5xl mb-4">
          {isMaster ? '🏆' : isGood ? '🌟' : '💪'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {isMaster ? 'Sangar Pol Rek!' : isGood ? 'Mbois Tenan!' : 'Semangat Belajar Arek!'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Kamu sudah menyelesaikan kuis adaptasi bahasa Suroboyoan Gloria 2.
        </p>

        {/* Score Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 mb-6">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Skor Akhir</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-700">{score}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Max Streak</p>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">{maxStreak}x</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Kategori</p>
            <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-1">
              {isMaster ? 'Arek Asli' : isGood ? 'Kanca Akrab' : 'Siswa Anyar'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Main Lagi (Tingkatkan Skor)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-sm relative overflow-hidden">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
            Soal {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
            {question.contextTag}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Lifeline 50:50 */}
          <button
            onClick={handleFiftyFifty}
            disabled={lifelineFiftyUsed || isAnswered}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all border ${
              lifelineFiftyUsed
                ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            50:50 Lifeline
          </button>

          {/* Streak Indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 animate-bounce">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-black">{streak}x Combo!</span>
            </div>
          )}

          {/* Points */}
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block leading-none">Skor</span>
            <span className="text-base font-black text-blue-700 font-mono">{score}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="my-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-600">
            <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-spin' : 'text-blue-600'}`} />
            <span>Sisa Waktu</span>
          </span>
          <span className={`font-mono text-sm font-black ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-blue-700'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 rounded-full ${
              timeLeft <= 5
                ? 'bg-rose-500'
                : timeLeft <= 9
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="py-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {question.options.map((opt, idx) => {
          const isEliminated = eliminatedOptions.includes(idx);
          let btnStyle = 'bg-slate-50/80 hover:bg-blue-50/60 text-slate-800 border-slate-200';

          if (isEliminated) {
            btnStyle = 'opacity-25 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed';
          } else if (isAnswered) {
            if (idx === question.correctIndex) {
              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
            } else if (idx === selectedOption) {
              btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300';
            } else {
              btnStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
            }
          }

          const letters = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered || isEliminated}
              className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-start gap-3 shadow-xs ${btnStyle}`}
            >
              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black shrink-0 text-blue-700 shadow-xs">
                {letters[idx]}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              {isAnswered && idx === question.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Button */}
      {isAnswered && (
        <div className="mt-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 animate-in fade-in duration-200">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-1.5 rounded-lg shrink-0 ${
              selectedOption === question.correctIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-slate-800 mb-0.5">
                {selectedOption === question.correctIndex ? 'Benar Sekali!' : selectedOption === -1 ? 'Waktu Habis!' : 'Kurang Tepat, Rek!'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>{currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Lanjut Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
