import React, { useState } from 'react';
import { X, Award, Sparkles, User, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../types';
import { AVATAR_OPTIONS } from '../data/avatars';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updated: Partial<StudentProfile>) => void;
  onLogout: () => void;
}

const GRADES = [
  // Kelas 7 (7A - 7G)
  '7A', '7B', '7C', '7D', '7E', '7F', '7G',
  // Kelas 8 (8A - 8H)
  '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
  // Kelas 9 (9A - 9G)
  '9A', '9B', '9C', '9D', '9E', '9F', '9G',
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name);
  const [grade, setGrade] = useState(profile.grade);
  const [avatar, setAvatar] = useState(profile.avatar);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({ name, grade, avatar });
    onClose();
  };

  const currentLevelXp = profile.xp % 100;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 100) * 100));

  const allBadges = [
    { id: 'first_word', title: 'Penyapa Handal', desc: 'Mempelajari kosakata pertama', icon: '🗣️' },
    { id: 'quiz_hero', title: 'Jagoan Kuis', desc: 'Mendapat skor tinggi di Tebak Slang', icon: '🏆' },
    { id: 'cangkruk_master', title: 'Arek Kantin', desc: 'Menyelesaikan roleplay lorong & kantin', icon: '🥪' },
    { id: 'memory_ace', title: 'Otak Cemerlang', desc: 'Menuntaskan memory match kata', icon: '🧠' },
    { id: 'gloria_patriot', title: 'Glowers Sejati', desc: 'Menerapkan Roma 15:7 dalam pergaulan', icon: '✝️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Profil Glowers Kamu</h2>
            <p className="text-xs text-slate-500">Sesuaikan identitas siswa SMP Kristen Gloria 2</p>
          </div>
        </div>

        {/* Level & XP Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{avatar}</span>
              <div>
                <span className="text-sm font-bold text-slate-900">Level {profile.level}</span>
                <p className="text-[11px] text-blue-700 font-bold">
                  {profile.level >= 5 ? 'Master Glowers Suroboyoan' : profile.level >= 3 ? 'Kanca Akrab Sekelas' : 'Arek Anyar Beradaptasi'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900">
              {profile.xp} Total XP
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-blue-200/60 h-2.5 rounded-full overflow-hidden border border-blue-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
            <span>Progress level: {currentLevelXp}/100 XP</span>
            <span>Target Lv.{profile.level + 1}</span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
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
              {(AVATAR_OPTIONS.includes(avatar) ? AVATAR_OPTIONS : [avatar, ...AVATAR_OPTIONS]).map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    setAvatar(emoji);
                  }}
                  className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    avatar === emoji
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-md shadow-blue-500/20'
                      : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama / Panggilan Siswa
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
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

          {/* Badges Preview */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Lencana Prestasi Glowers</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {allBadges.map((badge) => {
                const isUnlocked = profile.badges.includes(badge.id) || profile.xp >= 100;
                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      isUnlocked
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">{badge.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-extrabold shadow-md shadow-blue-500/20 transition-all"
            >
              Simpan Profil
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono font-medium">Akun: @{profile.username}</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              Ganti Akun / Keluar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
