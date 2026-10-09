import React from 'react';
import { 
  Flame, 
  Award, 
  BookOpen, 
  Gamepad2, 
  Compass, 
  MessageSquareShare, 
  HeartHandshake,
  Sparkles,
  LogOut,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Languages
} from 'lucide-react';
import { StudentProfile } from '../types';
import { GloriaLogo } from './GloriaLogo';

interface NavbarProps {
  profile: StudentProfile;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenCertificate: () => void;
  onLogout: () => void;
  cloudStatus?: 'synced' | 'saving' | 'offline';
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentTab,
  setCurrentTab,
  onOpenProfile,
  onOpenCertificate,
  onLogout,
  cloudStatus = 'synced',
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Beranda', icon: Compass },
    { id: 'kamus', label: 'Kamus Cilik', icon: BookOpen },
    { id: 'games', label: 'Arena Game', icon: Gamepad2, badge: '3' },
    { id: 'roleplay', label: 'Lorong & Kantin', icon: MessageSquareShare },
    { id: 'tips', label: 'Tips & Etika', icon: HeartHandshake },
    { id: 'translator', label: 'Translator Gaul', icon: Languages },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return 'Arek Anyar';
    if (lvl === 2) return 'Ngerti Sitik';
    if (lvl === 3) return 'Kanca Akrab';
    if (lvl === 4) return 'Fasih Suroboyoan';
    return 'Master Glowers';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tier 1: Brand & User Identity & Status Bar */}
        <div className="flex items-center justify-between h-15 sm:h-16 gap-3 py-2 border-b border-slate-100/80">
          
          {/* Logo & School Branding */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1 text-blue-700">
                <GloriaLogo className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent whitespace-nowrap">
                  Glowers Suroboyoan
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  SMP Gloria 2
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden md:inline-block leading-none">
                Survival Kit & Adaptasi Siswa Mutasi Pakuwon City
              </span>
            </div>
          </div>

          {/* Right Action & Profile Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Cloud Auto-Save Indicator */}
            <div 
              title="Progres otomatis tersimpan secara real-time ke Cloud Database Firebase!"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all ${
                cloudStatus === 'saving'
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : cloudStatus === 'offline'
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-700'
              }`}
            >
              {cloudStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
                  <span className="hidden sm:inline">Menyimpan...</span>
                </>
              ) : cloudStatus === 'offline' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="hidden sm:inline">Lokal</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="hidden sm:inline">Cloud Saved</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 hidden sm:inline" />
                </>
              )}
            </div>

            {/* Daily Streak */}
            <div 
              title={`${profile.streak} Hari Berturut-turut Belajar Suroboyoan!`}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span>{profile.streak} Hari</span>
            </div>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              title="Buka Kartu Arek Suroboyo"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Kartu Arek</span>
            </button>

            {/* Profile Avatar Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 transition-all text-left group shrink-0"
              title="Edit Profil Siswa"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base shadow-xs text-white shrink-0">
                {profile.avatar}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800 max-w-[80px] truncate">{profile.name}</span>
                  <span className="text-[10px] font-extrabold px-1 rounded bg-blue-100 text-blue-700">
                    {profile.grade}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Lv.{profile.level} {getLevelTitle(profile.level)}</span>
                </div>
              </div>
            </button>

            {/* Switch Account / Logout Button */}
            <button
              onClick={onLogout}
              title={`Ganti Akun (Sedang login: @${profile.username})`}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/90 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

        {/* Tier 2: Dedicated Navigation Tabs (Spacious, No cramped wrapping) */}
        <nav className="flex items-center gap-1 sm:gap-2 py-1.5 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
