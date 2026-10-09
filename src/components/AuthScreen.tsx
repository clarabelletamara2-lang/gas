import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  LogIn, 
  GraduationCap, 
  Sparkles, 
  Trash2, 
  ArrowRight,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react';
import { StudentProfile } from '../types';
import { GloriaLogo } from './GloriaLogo';
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from '../data/avatars';
import { isUsernameTaken } from '../services/firebase';

interface AuthScreenProps {
  savedAccounts: StudentProfile[];
  onLogin: (username: string) => Promise<boolean>;
  onRegister: (newAccount: { username: string; name: string; grade: string; avatar: string }) => Promise<void>;
  onDeleteAccount: (username: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  savedAccounts,
  onLogin,
  onRegister,
  onDeleteAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'saved'>(
    savedAccounts.length > 0 ? 'saved' : 'login'
  );

  // Login input state
  const [loginUsername, setLoginUsername] = useState('');
  const [isSearchingCloud, setIsSearchingCloud] = useState(false);

  // Form states for registration
  const [regUsername, setRegUsername] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('8C');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live username availability state
  const [usernameAvailability, setUsernameAvailability] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Debounced check for registration username uniqueness
  useEffect(() => {
    const clean = regUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (clean.length < 3) {
      setUsernameAvailability('idle');
      return;
    }

    setUsernameAvailability('checking');
    const timer = setTimeout(async () => {
      // 1. Check local saved accounts
      const existsLocally = savedAccounts.some((acc) => acc.username.toLowerCase() === clean);
      if (existsLocally) {
        setUsernameAvailability('taken');
        return;
      }

      // 2. Check cloud database
      const taken = await isUsernameTaken(clean);
      setUsernameAvailability(taken ? 'taken' : 'available');
    }, 350);

    return () => clearTimeout(timer);
  }, [regUsername, savedAccounts]);

  // Handle logging in by typing username (from another phone or this device)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const clean = loginUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!clean) {
      setErrorMessage('Masukkan username akun kamu.');
      return;
    }

    setIsSearchingCloud(true);
    const success = await onLogin(clean);
    setIsSearchingCloud(false);

    if (!success) {
      setErrorMessage(`Akun "@${clean}" tidak ditemukan di Cloud Firestore maupun di perangkat ini. Pastikan penulisan username benar atau buat akun baru di tab "Buat Akun Baru".`);
    }
  };

  // Handle registering a fresh new account
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = regUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanName = name.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('Username harus diisi minimal 3 karakter (hanya huruf, angka, underscore).');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Nama siswa harus diisi.');
      return;
    }

    // Strict uniqueness check: disallow duplicate username
    const existsLocally = savedAccounts.some(
      (acc) => acc.username.toLowerCase() === cleanUsername
    );
    if (existsLocally) {
      setErrorMessage(`Username "@${cleanUsername}" sudah digunakan oleh akun lain di perangkat ini! Silakan pilih username yang berbeda.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const taken = await isUsernameTaken(cleanUsername);
      if (taken) {
        setErrorMessage(`Username "@${cleanUsername}" sudah digunakan oleh siswa lain! Username tidak boleh sama, silakan pilih username unik lainnya.`);
        setIsSubmitting(false);
        return;
      }

      await onRegister({
        username: cleanUsername,
        name: cleanName,
        grade,
        avatar,
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal membuat akun, silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-lg">
        
        {/* Header School Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 shadow-lg shadow-blue-500/25 p-0.5 mb-3">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center p-2 text-blue-700">
              <GloriaLogo className="w-10 h-10 text-blue-700" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Glowers Auto Suroboyoan
          </h1>
          <p className="text-xs sm:text-sm font-bold text-blue-700 mt-1">
            SMP Kristen Gloria 2 Pakuwon City
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold mt-2">
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Cloud Sync Aktif • Akses Dimanapun, Kapanpun</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/5">
          
          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setActiveTab('login');
              }}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setActiveTab('register');
              }}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Bikin Akun Fresh</span>
            </button>

            {savedAccounts.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setActiveTab('saved');
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'saved'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <span>Tersimpan ({savedAccounts.length})</span>
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* TAB 1: LOGIN WITH USERNAME (SYNC ACROSS PHONES) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-0.5">
                  Akses Dimanapun, Kapanpun
                </h3>
                <p className="text-xs text-slate-500">
                  Cukup ketik username kamu untuk memuat seluruh progres yang sudah tersimpan di cloud dari perangkat mana saja.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username Kamu
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="contoh: glowerskeren, budi, areksuroboyo"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-bold"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Cloud className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Data progres (XP, streak, dan kata yang kamu tandai hafal) otomatis diambil dari Cloud Firestore Google.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSearchingCloud}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {isSearchingCloud ? (
                  <span>Menghubungkan ke Cloud...</span>
                ) : (
                  <>
                    <span>Masuk & Ambil Data Cloud</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Belum punya akun? Klik di sini untuk membuat akun fresh
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FRESH ACCOUNT (STARTS AT 0) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-0.5">
                  Bikin Akun Siswa Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Akun dimulai fresh dari 0 (XP, streak, dan kosakata) dan otomatis tersimpan online.
                </p>
              </div>

              {/* Avatar Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Pilih Karakter & Profesi Siswa
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {AVATAR_OPTIONS.length} Pilihan
                  </span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl max-h-44 overflow-y-auto">
                  {AVATAR_OPTIONS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setAvatar(item)}
                      className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                        avatar === item
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-md shadow-blue-500/20'
                          : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100'
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
                  Username Unik (Ingat ini untuk akses dimanapun & kapanpun!)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="contoh: glowerskeren, budi, areksuroboyo"
                    className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium transition-all ${
                      usernameAvailability === 'taken'
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : usernameAvailability === 'available'
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                    required
                  />
                </div>

                {/* Live Availability Status */}
                {regUsername.trim().length >= 3 && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold">
                    {usernameAvailability === 'checking' && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        Mengecek ketersediaan username...
                      </span>
                    )}
                    {usernameAvailability === 'available' && (
                      <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Username @{regUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')} tersedia!
                      </span>
                    )}
                    {usernameAvailability === 'taken' && (
                      <span className="text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Username @{regUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')} sudah dipakai, pilih username lain!
                      </span>
                    )}
                  </div>
                )}
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
                  placeholder="Contoh: Budi Santoso, Siti Putri"
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
                    Akun baru otomatis mulai dari <strong>0 XP</strong>, <strong>Level 1 (Arek Anyar)</strong>, <strong>0 Hari Streak</strong>, dan <strong>0 Kosakata Hafal</strong>. Data langsung disinkronkan ke Cloud Firebase!
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || usernameAvailability === 'taken'}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Cloud...</span>
                ) : (
                  <>
                    <span>Bikin Akun & Simpan ke Cloud</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: SAVED ACCOUNTS ON THIS PHONE */}
          {activeTab === 'saved' && savedAccounts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pernah Masuk di HP Ini:
                </span>
                <span className="text-[11px] font-medium text-blue-600">
                  Klik untuk Langsung Masuk
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
                          if (window.confirm(`Hapus akun @${account.username} dari HP ini? (Data di cloud tetap aman)`)) {
                            onDeleteAccount(account.username);
                          }
                        }}
                        title="Hapus dari daftar cepat HP ini"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-slate-600 hover:text-blue-700"
                >
                  Buka akun lain via username
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  + Buat Akun Baru
                </button>
              </div>
            </div>
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
