import React, { useState } from 'react';
import { Gamepad2, Zap, MessageSquareShare, Puzzle } from 'lucide-react';
import { SpeedQuizGame } from './SpeedQuizGame';
import { RoleplayAdventure } from './RoleplayAdventure';
import { MemoryMatchGame } from './MemoryMatchGame';

interface GamesArenaProps {
  onAddXp: (amount: number, reason: string) => void;
  onUpdateHighScore?: (score: number) => void;
}

export const GamesArena: React.FC<GamesArenaProps> = ({
  onAddXp,
  onUpdateHighScore,
}) => {
  const [activeGame, setActiveGame] = useState<'quiz' | 'roleplay' | 'match'>('quiz');

  const gameModes = [
    { id: 'quiz', label: 'Tebak Slang Kilat', icon: Zap, badge: 'Speed Quiz' },
    { id: 'roleplay', label: 'Lorong & Kantin', icon: MessageSquareShare, badge: 'Roleplay RPG' },
    { id: 'match', label: 'Jodoh Kata', icon: Puzzle, badge: 'Memory Match' },
  ];

  return (
    <div className="space-y-6">
      {/* Game Mode Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-blue-600" />
            <span>Pusat Game Interaktif Glowers</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pilih game seru tanpa suara untuk melatih kosakata bahasa Suroboyoanmu!
          </p>
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-stretch sm:self-auto">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeGame === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveGame(mode.id as typeof activeGame)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Game */}
      <div className="pt-2">
        {activeGame === 'quiz' && (
          <SpeedQuizGame
            onAddXp={onAddXp}
            onFinishGame={(score) => {
              if (onUpdateHighScore) onUpdateHighScore(score);
            }}
          />
        )}

        {activeGame === 'roleplay' && (
          <RoleplayAdventure onAddXp={onAddXp} />
        )}

        {activeGame === 'match' && (
          <MemoryMatchGame onAddXp={onAddXp} />
        )}
      </div>
    </div>
  );
};
