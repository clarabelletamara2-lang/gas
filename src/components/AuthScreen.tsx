import React, { useState } from 'react';
import { 
  UserPlus, 
  LogIn, 
  GraduationCap, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { StudentProfile } from '../types';

interface AuthScreenProps {
  savedAccounts: StudentProfile[];
  onLogin: (username: string) => void;
  onRegister: (newAccount: { username: string; name: string; grade: string; avatar: string }) => void;
  onDeleteAccount: (username: string) => void;
}

const AVATARS = ['🦁', '👦🏻', '👧🏻', '⚡', '🎮', '🌟', '🕶️', '🚀', '🏀', '🎨'];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  savedAccounts,
  onLogin,
  onRegister,
  onDeleteAccount,
}) => {
  // If there are saved accounts, let user choose to login or register; otherwise default to register
  const [activeTab, setActiveTab] = useState<'register' | 'saved'>(
    savedAccounts.length > 0 ? 'saved' : 'register'
  );

  // Form states for registration
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('8C');
  const [avatar, setAvatar] = useState('🦁');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanName = name.trim();

    if (!cleanUsername) {
      setErrorMessage('Username harus diisi (hanya huruf, angka, underscore).');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Nama siswa harus diisi.');
      return;
    }

    // Check if username already exists in saved accounts
    const exists = savedAccounts.some((acc) => acc.username.toLowerCase() === cleanUsername);
    if (exists) {
      setErrorMessage(`Username "${cleanUsername}" sudah pernah dipakai di perangkat ini. Silakan gunakan username lain atau login ke akun tersebut.`);
      return;
    }

    onRegister({
      username: cleanUsername,
      name: cleanName,
      grade,
      avatar,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-lg">
        
        {/* Header School Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 shadow-lg shadow-blue-500/25 p-0.5 mb-3">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-3xl">
              🦁
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Glowers Auto Suroboyoan
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-700 mt-1">
            SMP Kristen Gloria 2 Pakuwon City
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Survival Kit & Portal Adaptasi Budaya Siswa
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/5">
          
          {/* Tab Selector if saved accounts exist */}
          {savedAccounts.length > 0 && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setActiveTab('saved');
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'saved'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Pilih Akun ({savedAccounts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setActiveTab('register');
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Buat Akun Baru</span>
              </button>
            </div>
          )}

          {/* TAB 1: SAVED ACCOUNTS */}
          {activeTab === 'saved' && savedAccounts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Akun Tersimpan di Perangkat Ini:
                </span>
                <span className="text-[11px] font-medium text-blue-600">
                  Progress Otomatis Tersimpan
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {savedAccounts.map((account) => (
                  <div
                    key={account.username}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div 
                      onClick={() => onLogin(account.username)}
                      className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-2xl shadow-xs shrink-0">
                        {account.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {account.name}
                          </h4>
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                            Kelas {account.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono text-blue-700 font-bold">@{account.username}</span>
                          <span>•</span>
                          <span>Lv.{account.level} ({account.xp} XP)</span>
                          <span>•</span>
                          <span>{account.masteredWordIds?.length || 0} Kata</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onLogin(account.username)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <span>Masuk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus data akun @${account.username}?`)) {
                            onDeleteAccount(account.username);
                          }
                        }}
                        title="Hapus akun dari perangkat"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1.5 mx-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Siswa baru? Buat akun fresh baru di sini</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER FRESH ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-0.5">
                  Bikin Akun Siswa Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Semua progress dimulai fresh dari 0 (XP, streak, dan kosakata).
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Avatar Karakter
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setAvatar(item)}
                      className={`w-10 h-10 text-xl rounded-xl flex items-center justify-center transition-all ${
                        avatar === item
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-110 shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Unik (untuk simpan data)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="contoh: clarabelle, budi8c, kevin"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Gunakan huruf kecil & angka tanpa spasi (dipakai untuk mengingat akunmu).
                </p>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Panggilan Siswa
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Clarabelle Tamara, Budi Santoso"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
                  required
                />
              </div>

              {/* Class Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kelas di SMP Gloria 2</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                >
                  <optgroup label="Kelas 7 (7A - 7G)">
                    {['7A', '7B', '7C', '7D', '7E', '7F', '7G'].map((g) => (
                      <option key={g} value={g} className="bg-white text-slate-900">
                        Kelas {g}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Kelas 8 (8A - 8H)">
                    {['8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H'].map((g) => (
                      <option key={g} value={g} className="bg-white text-slate-900">
                        Kelas {g}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Kelas 9 (9A - 9G)">
                    {['9A', '9B', '9C', '9D', '9E', '9F', '9G'].map((g) => (
                      <option key={g} value={g} className="bg-white text-slate-900">
                        Kelas {g}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Fresh Start Notice Box */}
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-900">
                  <p className="font-bold mb-0.5">Mulai Akun Segar & Bersih:</p>
                  <p className="text-slate-600">
                    Akun baru kamu akan otomatis mulai dengan <strong>0 XP</strong>, <strong>Level 1 (Arek Anyar)</strong>, <strong>0 Hari Streak</strong>, dan <strong>0 Kosakata Hafal</strong>. Setiap perkembanganmu akan otomatis tersimpan!
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Bikin Akun & Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Karya Siswa: Clarabelle (8C), Caroline, Karen, Sidney (8F) • SMP Kristen Gloria 2
        </p>

      </div>
    </div>
  );
};
