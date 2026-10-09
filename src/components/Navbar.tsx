import React from 'react';
import { 
  Flame, 
  Award, 
  BookOpen, 
  Gamepad2, 
  Compass, 
  MessageSquareShare, 
  HeartHandshake,
  Sparkles 
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenCertificate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentTab,
  setCurrentTab,
  onOpenProfile,
  onOpenCertificate,
}) => {
  const navTabs = [
    { id: 'dashboard', label: 'Beranda', icon: Compass },
    { id: 'kamus', label: 'Kamus Cilik', icon: BookOpen },
    { id: 'games', label: 'Arena Game', icon: Gamepad2, badge: '3 Game' },
    { id: 'roleplay', label: 'Lorong & Kantin', icon: MessageSquareShare },
    { id: 'tips', label: 'Tips & Etika', icon: HeartHandshake },
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & School Branding */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🦁</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                  Glowers Auto Suroboyoan
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  SMP Gloria 2
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Survival Kit & Game Adaptasi Siswa Mutasi
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Streak */}
            <div 
              title={`${profile.streak} Hari Berturut-turut Belajar Suroboyoan!`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <Flame className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-800">{profile.streak} Hari</span>
            </div>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              title="Lihat Sertifikat Arek Suroboyo"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-sky-600" />
              <span>Kartu Arek</span>
            </button>

            {/* Profile Avatar & Level Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg shadow-inner text-white">
                {profile.avatar}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{profile.name}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                    {profile.grade}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span className="font-semibold text-blue-700">Lv.{profile.level} {getLevelTitle(profile.level)}</span>
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 overflow-x-auto gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-blue-700 font-extrabold bg-blue-50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
