import React, { useState } from 'react';
import { 
  RotateCcw, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  School
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DIALOGUE_SCENES } from '../data/suroboyoData';
import { DialogueChoice } from '../types';

interface RoleplayAdventureProps {
  onAddXp: (amount: number, reason: string) => void;
}

export const RoleplayAdventure: React.FC<RoleplayAdventureProps> = ({ onAddXp }) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<DialogueChoice | null>(null);
  const [friendshipScore, setFriendshipScore] = useState(50);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentScene = DIALOGUE_SCENES[sceneIndex];

  const handleSelectChoice = (choice: DialogueChoice) => {
    setSelectedChoice(choice);
    setFriendshipScore((prev) => Math.min(100, Math.max(0, prev + choice.scoreChange)));

    if (choice.isAppropriate) {
      onAddXp(25, 'Pilihan dialog adaptif & santun di sekolah');
    }
  };

  const handleNextScene = () => {
    setSelectedChoice(null);

    if (sceneIndex + 1 < DIALOGUE_SCENES.length) {
      setSceneIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
      });
      onAddXp(60, 'Menuntaskan simulasi interaksi di Gloria 2');
    }
  };

  const handleRestart = () => {
    setSceneIndex(0);
    setSelectedChoice(null);
    setFriendshipScore(50);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const isAwesome = friendshipScore >= 80;
    return (
      <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto text-center shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-4xl mb-4">
          {isAwesome ? '🤝' : '🌱'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {isAwesome ? 'Kanca Kenthel Gloria 2!' : 'Perjalanan Adaptasi Yang Mantap!'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Kamu berhasil menyelesaikan simulasi percakapan di lorong dan kantin sekolah SMP Kristen Gloria 2 Pakuwon City.
        </p>

        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 max-w-sm mx-auto mb-6">
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            Indeks Keakraban Sekolah
          </p>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="text-3xl font-black text-blue-950">{friendshipScore}%</span>
          </div>
          <p className="text-xs text-blue-700 font-semibold mt-2">
            {isAwesome ? 'Teman-teman sangat nyaman dan menyukaimu!' : 'Terus latih kosakata dan respon khas ya!'}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-md shadow-blue-500/20 text-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi Cerita Roleplay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-sm overflow-hidden relative">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <School className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Babak {sceneIndex + 1}: {currentScene.title}</h3>
            <p className="text-[11px] text-slate-500">Simulasi Adaptasi Siswa Mutasi Gloria 2</p>
          </div>
        </div>

        {/* Friendship Meter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-bold text-slate-600">Keakraban:</span>
          <span className="text-xs font-black text-blue-700 font-mono">{friendshipScore}%</span>
        </div>
      </div>

      {/* Situation narrative card */}
      <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 italic flex items-start gap-2.5">
        <span className="text-base">📍</span>
        <span>{currentScene.situation}</span>
      </div>

      {/* Character Speech Bubble - White & Blue */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200 my-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1 bg-white rounded-xl border border-blue-100 shadow-xs">
              {currentScene.characterAvatar}
            </span>
            <div>
              <span className="text-xs font-black text-blue-700">{currentScene.character}</span>
              <span className="text-[10px] text-slate-400 block">{currentScene.characterRole}</span>
            </div>
          </div>
        </div>

        <p className="text-base sm:text-lg font-black text-blue-950 mb-1 tracking-wide">
          {currentScene.characterDialogue}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          {currentScene.characterDialogueIndo}
        </p>
      </div>

      {/* Decision Prompt */}
      <div className="mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Pilihan Tanggapanmu (Siswa Mutasi):
        </span>
      </div>

      {/* Choices List */}
      <div className="space-y-2.5 mb-5">
        {currentScene.choices.map((choice, idx) => {
          const isChosen = selectedChoice === choice;
          let btnStyle = 'bg-slate-50/80 hover:bg-blue-50/60 text-slate-800 border-slate-200';

          if (selectedChoice) {
            if (isChosen) {
              btnStyle = choice.isAppropriate
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300';
            } else {
              btnStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectChoice(choice)}
              disabled={selectedChoice !== null}
              className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm transition-all flex items-start gap-3 shadow-xs ${btnStyle}`}
            >
              <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black shrink-0 text-blue-700 shadow-xs">
                {idx + 1}
              </span>
              <span className="flex-1 leading-snug">{choice.text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Panel */}
      {selectedChoice && (
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5 mb-3">
            {selectedChoice.isAppropriate ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">{selectedChoice.feedback}</p>
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-blue-100 text-xs shadow-xs">
                <span className="text-[10px] text-blue-700 font-bold block mb-0.5">Balasan Budi/Guru:</span>
                <span className="text-slate-700 italic font-medium">{selectedChoice.speakerReply}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextScene}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>{sceneIndex + 1 < DIALOGUE_SCENES.length ? 'Lanjut ke Situasi Berikutnya' : 'Selesaikan Petualangan'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
