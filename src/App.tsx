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
import { saveAccountToCloud, fetchAccountFromCloud, subscribeToAccount } from './services/firebase';
import { GloriaLogo } from './components/GloriaLogo';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

const STORAGE_ACCOUNTS_KEY = 'glowers_student_accounts_v1';
const STORAGE_CURRENT_USER_KEY = 'glowers_active_username_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ amount: number; reason: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Local device accounts cache
  const [accounts, setAccounts] = useState<Record<string, StudentProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Error reading local accounts', e);
    }
    return {};
  });

  // Currently logged in username on this device
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

  // Persist local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.debug('Error saving local accounts', e);
    }
  }, [accounts]);

  // Persist active username
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

  // Auto-sync with Cloud Firestore in real time whenever active user is present
  useEffect(() => {
    if (!activeUsername) return;

    // 1. Initial background fetch to pull updates from other devices
    fetchAccountFromCloud(activeUsername).then((cloudProfile) => {
      if (cloudProfile) {
        setAccounts((prev) => ({
          ...prev,
          [cloudProfile.username]: cloudProfile,
        }));
      }
    });

    // 2. Real-time onSnapshot listener for instant cross-device updates
    const unsubscribe = subscribeToAccount(activeUsername, (updatedFromCloud) => {
      setAccounts((prev) => ({
        ...prev,
        [updatedFromCloud.username]: updatedFromCloud,
      }));
      setSyncStatus('synced');
    });

    // 3. Sync on window focus (e.g. when switching back from another tab/app)
    const handleFocus = () => {
      fetchAccountFromCloud(activeUsername).then((cloudProfile) => {
        if (cloudProfile) {
          setAccounts((prev) => ({
            ...prev,
            [cloudProfile.username]: cloudProfile,
          }));
        }
      });
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeUsername]);

  // Daily streak check on visit
  useEffect(() => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];

    if (profile.lastLoginDate !== today) {
      const lastDate = profile.lastLoginDate ? new Date(profile.lastLoginDate) : null;
      const todayDate = new Date(today);
      let newStreak = profile.streak || 1;

      if (lastDate) {
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const updatedWithStreak: StudentProfile = {
        ...profile,
        streak: newStreak,
        lastLoginDate: today,
      };

      updateProfileAndSync(updatedWithStreak);
    }
  }, [profile?.username, profile?.lastLoginDate]);

  // Handle fresh registration (starts at 0 everything, saves to Cloud Firestore)
  const handleRegister = async (newAccountData: {
    username: string;
    name: string;
    grade: string;
    avatar: string;
  }) => {
    const cleanUsername = newAccountData.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

    // 1. Verify uniqueness: check if username already taken locally
    if (accounts[cleanUsername]) {
      throw new Error(`Username "@${cleanUsername}" sudah digunakan di perangkat ini! Silakan pakai username unik lain.`);
    }

    // 2. Verify uniqueness: check if username already taken in Cloud Firestore
    const cloudAccount = await fetchAccountFromCloud(cleanUsername);
    if (cloudAccount) {
      throw new Error(`Username "@${cleanUsername}" sudah terdaftar oleh siswa lain! Username tidak boleh sama.`);
    }

    const today = new Date().toISOString().split('T')[0];
    const freshProfile: StudentProfile = {
      username: cleanUsername,
      name: newAccountData.name.trim(),
      grade: newAccountData.grade,
      avatar: newAccountData.avatar,
      xp: 0,
      level: 1,
      streak: 1,
      masteredWordIds: [],
      completedQuests: [],
      badges: [],
      quizHighScore: 0,
      createdAt: new Date().toISOString(),
      lastLoginDate: today,
    };

    // 1. Save to local device
    setAccounts((prev) => ({
      ...prev,
      [freshProfile.username]: freshProfile,
    }));
    setActiveUsername(freshProfile.username);
    setCurrentTab('dashboard');

    // 2. Sync to Cloud Firestore so other phones can access it
    setSyncStatus('saving');
    const saved = await saveAccountToCloud(freshProfile);
    setSyncStatus(saved ? 'synced' : 'offline');
  };

  // Handle login by username (checks Cloud Firestore, downloads to device)
  const handleLogin = async (username: string): Promise<boolean> => {
    const clean = username.toLowerCase().trim();

    // 1. First check cloud Firestore
    const cloudAccount = await fetchAccountFromCloud(clean);
    if (cloudAccount) {
      setAccounts((prev) => ({
        ...prev,
        [cloudAccount.username]: cloudAccount,
      }));
      setActiveUsername(cloudAccount.username);
      setCurrentTab('dashboard');
      setSyncStatus('synced');
      return true;
    }

    // 2. Check local device cache
    if (accounts[clean]) {
      setActiveUsername(clean);
      setCurrentTab('dashboard');
      // Background sync to cloud
      setSyncStatus('saving');
      saveAccountToCloud(accounts[clean]).then((ok) => {
        setSyncStatus(ok ? 'synced' : 'offline');
      });
      return true;
    }

    return false;
  };

  // Handle delete account from this device's quick list
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

  // Handle logout
  const handleLogout = () => {
    setActiveUsername(null);
    setIsProfileOpen(false);
  };

  // Save changes to both state & Cloud Firestore automatically
  const updateProfileAndSync = async (updated: StudentProfile) => {
    setAccounts((prev) => ({
      ...prev,
      [updated.username]: updated,
    }));
    // Auto-save to Cloud Firestore
    setSyncStatus('saving');
    const cloudSaved = await saveAccountToCloud(updated);
    setSyncStatus(cloudSaved ? 'synced' : 'offline');
  };

  const handleAddXp = (amount: number, reason: string) => {
    if (!profile) return;

    setXpToast({ amount, reason });
    setTimeout(() => setXpToast(null), 3000);

    const newXp = profile.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    const updated: StudentProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
    };

    updateProfileAndSync(updated);
  };

  const handleToggleMastered = (id: string) => {
    if (!profile) return;

    const currentMastered = profile.masteredWordIds || [];
    const exists = currentMastered.includes(id);

    let updatedMastered: string[];
    let earnedXp = 0;

    if (exists) {
      updatedMastered = currentMastered.filter((item) => item !== id);
    } else {
      updatedMastered = [...currentMastered, id];
      earnedXp = 15;
      setXpToast({ amount: 15, reason: 'Menguasai kosakata baru Suroboyoan' });
      setTimeout(() => setXpToast(null), 3000);
    }

    const newXp = profile.xp + earnedXp;
    const newLevel = Math.floor(newXp / 100) + 1;

    const updated: StudentProfile = {
      ...profile,
      masteredWordIds: updatedMastered,
      xp: newXp,
      level: newLevel,
    };

    updateProfileAndSync(updated);
  };

  const handleSaveProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!profile) return;
    const updated: StudentProfile = {
      ...profile,
      ...updatedFields,
    };
    updateProfileAndSync(updated);
  };

  const handleUpdateHighScore = (score: number) => {
    if (!profile) return;
    const updated: StudentProfile = {
      ...profile,
      quizHighScore: Math.max(profile.quizHighScore || 0, score),
    };
    updateProfileAndSync(updated);
  };

  // IF NO ACTIVE ACCOUNT, SHOW AUTH SCREEN
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
        cloudStatus={syncStatus}
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
            <GloriaLogo className="w-8 h-8 text-blue-700" />
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
