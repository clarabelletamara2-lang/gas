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
import { AuthScreen } from './components/AuthScreen';
import { StudentProfile } from './types';
import { AUTHORS_INFO } from './data/suroboyoData';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'glowers_student_accounts_v1';
const STORAGE_CURRENT_USER_KEY = 'glowers_active_username_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ amount: number; reason: string } | null>(null);

  // Load accounts map: { [username: string]: StudentProfile }
  const [accounts, setAccounts] = useState<Record<string, StudentProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Error reading local accounts', e);
    }
    return {};
  });

  // Load currently logged in username
  const [activeUsername, setActiveUsername] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    } catch (e) {
      console.debug('Error reading active user', e);
    }
    return null;
  });

  // Current active student profile
  const profile = activeUsername && accounts[activeUsername] ? accounts[activeUsername] : null;

  // Persist accounts map whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.debug('Error saving accounts', e);
    }
  }, [accounts]);

  // Persist active username whenever it changes
  useEffect(() => {
    try {
      if (activeUsername) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, activeUsername);
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch (e) {
      console.debug('Error saving active user', e);
    }
  }, [activeUsername]);

  // Handle fresh registration (starts at 0 everything)
  const handleRegister = (newAccountData: {
    username: string;
    name: string;
    grade: string;
    avatar: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const freshProfile: StudentProfile = {
      username: newAccountData.username,
      name: newAccountData.name,
      grade: newAccountData.grade,
      avatar: newAccountData.avatar,
      xp: 0,
      level: 1,
      streak: 0,
      masteredWordIds: [],
      completedQuests: [],
      badges: [],
      quizHighScore: 0,
      createdAt: new Date().toISOString(),
      lastLoginDate: today,
    };

    setAccounts((prev) => ({
      ...prev,
      [freshProfile.username]: freshProfile,
    }));
    setActiveUsername(freshProfile.username);
    setCurrentTab('dashboard');
  };

  // Handle login to existing saved account
  const handleLogin = (username: string) => {
    if (accounts[username]) {
      setActiveUsername(username);
      setCurrentTab('dashboard');
    }
  };

  // Handle delete account from storage
  const handleDeleteAccount = (username: string) => {
    setAccounts((prev) => {
      const copy = { ...prev };
      delete copy[username];
      return copy;
    });
    if (activeUsername === username) {
      setActiveUsername(null);
    }
  };

  // Handle logout / switch account
  const handleLogout = () => {
    setActiveUsername(null);
    setIsProfileOpen(false);
  };

  const handleAddXp = (amount: number, reason: string) => {
    if (!profile) return;

    setXpToast({ amount, reason });
    setTimeout(() => setXpToast(null), 3000);

    const newXp = profile.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    setAccounts((prev) => {
      const current = prev[profile.username];
      if (!current) return prev;
      return {
        ...prev,
        [profile.username]: {
          ...current,
          xp: newXp,
          level: newLevel,
        },
      };
    });
  };

  const handleToggleMastered = (id: string) => {
    if (!profile) return;

    const currentMastered = profile.masteredWordIds || [];
    const exists = currentMastered.includes(id);

    let updatedMastered: string[];
    if (exists) {
      updatedMastered = currentMastered.filter((item) => item !== id);
    } else {
      updatedMastered = [...currentMastered, id];
      handleAddXp(15, 'Menguasai kosakata baru Suroboyoan');
    }

    setAccounts((prev) => {
      const current = prev[profile.username];
      if (!current) return prev;
      return {
        ...prev,
        [profile.username]: {
          ...current,
          masteredWordIds: updatedMastered,
        },
      };
    });
  };

  const handleSaveProfile = (updated: Partial<StudentProfile>) => {
    if (!profile) return;
    setAccounts((prev) => {
      const current = prev[profile.username];
      if (!current) return prev;
      return {
        ...prev,
        [profile.username]: {
          ...current,
          ...updated,
        },
      };
    });
  };

  const handleUpdateHighScore = (score: number) => {
    if (!profile) return;
    setAccounts((prev) => {
      const current = prev[profile.username];
      if (!current) return prev;
      return {
        ...prev,
        [profile.username]: {
          ...current,
          quizHighScore: Math.max(current.quizHighScore || 0, score),
        },
      };
    });
  };

  // IF NO ACTIVE ACCOUNT, SHOW AUTH SCREEN IMMEDIATELY
  if (!profile) {
    return (
      <AuthScreen
        savedAccounts={Object.values(accounts)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  const masteredWordIds = profile.masteredWordIds || [];

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        profile={profile}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onLogout={handleLogout}
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
        onLogout={handleLogout}
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
                {AUTHORS_INFO.school} • Logged in: <span className="font-mono text-blue-700 font-bold">@{profile.username}</span>
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
