import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { GloriaLogo } from './GloriaLogo';

interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  type: 'suroboyo' | 'indonesia';
}

interface MemoryMatchGameProps {
  onAddXp: (amount: number, reason: string) => void;
}

const RAW_PAIRS = [
  { pairId: '1', suroboyo: 'Mari', indonesia: 'Selesai' },
  { pairId: '2', suroboyo: 'Suwe', indonesia: 'Lama Sekali' },
  { pairId: '3', suroboyo: 'Luwe', indonesia: 'Lapar' },
  { pairId: '4', suroboyo: 'Rek', indonesia: 'Kawan-kawan' },
  { pairId: '5', suroboyo: 'Ewangi', indonesia: 'Tolong / Bantu' },
  { pairId: '6', suroboyo: 'Mlebu', indonesia: 'Masuk Kelas' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onAddXp }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    RAW_PAIRS.forEach((item) => {
      deck.push({
        id: `s-${item.pairId}`,
        pairId: item.pairId,
        label: item.suroboyo,
        type: 'suroboyo',
      });
      deck.push({
        id: `i-${item.pairId}`,
        pairId: item.pairId,
        label: item.indonesia,
        type: 'indonesia',
      });
    });

    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIds([]);
    setMatchedPairIds([]);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (!isPlaying || isCompleted) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  const handleCardClick = (card: MemoryCard) => {
    if (flippedIds.includes(card.id) || matchedPairIds.includes(card.pairId) || flippedIds.length === 2) {
      return;
    }

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        setMatchedPairIds((prev) => [...prev, firstCard.pairId]);
        setFlippedIds([]);

        if (matchedPairIds.length + 1 === RAW_PAIRS.length) {
          setIsCompleted(true);
          setIsPlaying(false);
          confetti({
            particleCount: 110,
            spread: 70,
            origin: { y: 0.6 },
          });
          onAddXp(40, 'Menuntaskan Jodoh Kata Suroboyoan');
        }
      } else {
        setTimeout(() => {
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-8 max-w-2xl mx-auto shadow-sm">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>🧩</span> Jodoh Kata Suroboyoan
          </h3>
          <p className="text-xs text-slate-500">Cocokkan kata Jawa Surabaya dengan padanan artinya!</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <span>Langkah: </span>
            <span className="text-blue-700 font-mono">{moves}</span>
          </div>

          <button
            onClick={initGame}
            title="Kocok Ulang Kartu"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted ? (
        <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200 mb-6 shadow-sm">
          <div className="text-4xl mb-2">🎉</div>
          <h4 className="text-xl font-black text-slate-900 mb-1">Hebat Pol, Rek!</h4>
          <p className="text-xs text-slate-600 mb-4">
            Semua pasangan kata cocok dalam {formatTime(timer)} dengan {moves} langkah!
          </p>
          <button
            onClick={initGame}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Main Sekali Lagi</span>
          </button>
        </div>
      ) : null}

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairIds.includes(card.pairId);

          let cardStyle = 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/40 shadow-xs';

          if (isMatched) {
            cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 pointer-events-none scale-95 shadow-inner';
          } else if (isFlipped) {
            cardStyle = card.type === 'suroboyo'
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-indigo-600 border-indigo-600 text-white shadow-md';
          }

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isMatched || isFlipped}
              className={`h-24 sm:h-28 rounded-2xl border p-2 flex flex-col items-center justify-center text-center font-bold text-xs sm:text-sm transition-all duration-200 select-none ${cardStyle}`}
            >
              {isFlipped || isMatched ? (
                <>
                  <span className={`text-[10px] font-black uppercase mb-1 px-1.5 py-0.5 rounded ${
                    isMatched 
                      ? 'bg-emerald-200/60 text-emerald-900'
                      : 'bg-white/20 text-white'
                  }`}>
                    {card.type === 'suroboyo' ? 'Suroboyo' : 'Indonesia'}
                  </span>
                  <span className="font-black leading-tight">{card.label}</span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <GloriaLogo className="w-6 h-6 text-blue-600/70 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Gloria 2</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
