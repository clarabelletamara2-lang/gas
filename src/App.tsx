/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { KamusCilik } from './components/KamusCilik';
import { GamesArena } from './components/GamesArena';
import { RoleplayAdventure } from './components/RoleplayAdventure';
import { TranslatorTool } from './components/TranslatorTool';
import { TipsAndEthics } from './components/TipsAndEthics';
import { StudentProfileModal } from './components/StudentProfileModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentProfile } from './types';
import { AUTHORS_INFO } from './data/suroboyoData';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Andi Siswa Mutasi',
  grade: '8C',
  avatar: '🦁',
  xp: 120,
  level: 2,
  streak: 3,
  completedQuests: ['first_word'],
  badges: ['first_word'],
  quizHighScore: 720,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ amount: number; reason: string } | null>(null);

  // Load profile from localStorage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('glowers_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Error reading local profile', e);
    }
    return DEFAULT_PROFILE;
  });

  // Load mastered words from localStorage
  const [masteredWordIds, setMasteredWordIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glowers_mastered_words');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Error reading local mastered words', e);
    }
    return ['1', '6', '11']; // Iyo, Mari, Rek by default
  });

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('glowers_student_profile', JSON.stringify(profile));
    } catch (e) {
      console.debug('Error saving profile', e);
    }
  }, [profile]);

  // Sync mastered words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('glowers_mastered_words', JSON.stringify(masteredWordIds));
    } catch (e) {
      console.debug('Error saving mastered words', e);
    }
  }, [masteredWordIds]);

  const handleAddXp = (amount: number, reason: string) => {
    setXpToast({ amount, reason });
    setTimeout(() => setXpToast(null), 3000);

    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  const handleToggleMastered = (id: string) => {
    setMasteredWordIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      } else {
        handleAddXp(15, 'Menguasai kosakata baru Suroboyoan');
        return [...prev, id];
      }
    });
  };

  const handleSaveProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleUpdateHighScore = (score: number) => {
    setProfile((prev) => ({
      ...prev,
      quizHighScore: Math.max(prev.quizHighScore || 0, score),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        profile={profile}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Floating XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-extrabold text-xs shadow-xl shadow-blue-600/25 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 fill-white animate-spin" />
          <span>+{xpToast.amount} XP! {xpToast.reason}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Quick sub-navigation for translator tool */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => {
              setCurrentTab(currentTab === 'translator' ? 'dashboard' : 'translator');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              currentTab === 'translator'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentTab === 'translator' ? 'Kembali ke Beranda' : 'Buka Translator Gaul'}</span>
          </button>
        </div>

        {/* Dynamic Tab Views */}
        {currentTab === 'dashboard' && (
          <DashboardOverview
            profile={profile}
            masteredWordIds={masteredWordIds}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentTab === 'kamus' && (
          <KamusCilik
            masteredWordIds={masteredWordIds}
            onToggleMastered={handleToggleMastered}
          />
        )}

        {currentTab === 'games' && (
          <GamesArena
            onAddXp={handleAddXp}
            onUpdateHighScore={handleUpdateHighScore}
          />
        )}

        {currentTab === 'roleplay' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Lorong & Kantin RPG</h2>
                <p className="text-xs text-slate-500">Simulasi percakapan adaptasi sekolah Budi & Andi (SMP Gloria 2)</p>
              </div>
              <button
                onClick={() => setCurrentTab('games')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Lihat Semua Game
              </button>
            </div>
            <RoleplayAdventure onAddXp={handleAddXp} />
          </div>
        )}

        {currentTab === 'tips' && (
          <TipsAndEthics />
        )}

        {currentTab === 'translator' && (
          <TranslatorTool />
        )}
      </main>

      {/* Profile Edit Modal */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Certificate / Badge Card Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦁</span>
            <div>
              <p className="font-extrabold text-slate-800">
                {AUTHORS_INFO.title}
              </p>
              <p className="text-[11px] text-slate-400">
                {AUTHORS_INFO.school}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-slate-600">
              Disusun oleh: <span className="font-bold text-blue-700">Clarabelle (8C), Caroline (8F), Karen (8F), Sidney (8F)</span>
            </p>
            <p className="text-[11px] text-slate-400 italic mt-0.5">
              &ldquo;{AUTHORS_INFO.bibleVerse.text}&rdquo; ({AUTHORS_INFO.bibleVerse.verse})
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
