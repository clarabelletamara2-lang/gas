import React from 'react';
import { 
  Gamepad2, 
  BookOpen, 
  Flame, 
  Trophy, 
  ArrowRight, 
  HeartHandshake, 
  ShieldCheck,
  MessageSquare,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../types';
import { VOCABULARY_LIST, AUTHORS_INFO } from '../data/suroboyoData';
import { GloriaLogo } from './GloriaLogo';

interface DashboardOverviewProps {
  profile: StudentProfile;
  masteredWordIds: string[];
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenCertificate: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  masteredWordIds,
  onNavigate,
  onOpenProfile,
  onOpenCertificate,
}) => {
  const wordOfTheDay = VOCABULARY_LIST.find((w) => w.word === 'Mari') || VOCABULARY_LIST[0];

  const handleAction = (tab: string) => {
    onNavigate(tab);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner - White & Blue Royal Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 border border-blue-500 p-6 sm:p-10 shadow-xl shadow-blue-500/15 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-xs">
                <GloriaLogo className="w-5 h-5" variant="white" />
                <span>Survival Kit SMP Gloria 2</span>
              </span>
              <span className="text-xs text-blue-100 font-medium">Pakuwon City</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Halo rek, {profile.name}! 👋
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Selamat datang di hub adaptasi bahasa Suroboyoan. Jangan sungkan, arek-arek Gloria santai dan asik diajak temanan! Yuk asah kemampuan bahasamu lewat game seru.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => handleAction('games')}
                className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 font-black text-xs sm:text-sm hover:bg-blue-50 shadow-lg shadow-black/10 flex items-center gap-2 transition-all"
              >
                <Gamepad2 className="w-4 h-4 text-blue-600" />
                <span>Mulai Main Game</span>
              </button>

              <button
                onClick={() => handleAction('kamus')}
                className="px-5 py-2.5 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4 text-sky-200" />
                <span>Buka Kamus Cilik</span>
              </button>

              <button
                onClick={onOpenCertificate}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 flex items-center gap-1.5 transition-all"
              >
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Cetak Kartu Arek</span>
              </button>
            </div>
          </div>

          {/* Quick Mascot Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl shrink-0 text-center max-w-xs shadow-xl text-white">
            <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center text-3xl shadow-md mb-3">
              {profile.avatar}
            </div>
            <h3 className="text-base font-black text-white">{profile.name}</h3>
            <p className="text-xs text-sky-200 font-bold mb-3">{profile.grade}</p>
            <div className="w-full bg-blue-950/40 h-2 rounded-full overflow-hidden mb-1.5">
              <div 
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${profile.xp % 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-blue-200 font-mono font-bold">
              <span>Level {profile.level}</span>
              <span>{profile.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Save & Cloud Status Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <p className="text-xs text-slate-600 leading-snug">
            <strong className="text-blue-900 font-extrabold">Auto-Save Aktif:</strong> Setiap kamu bermain game, menjawab kuis, atau menandai kamus, semua progres dan XP langsung otomatis tersimpan ke Cloud Firestore (<span className="font-mono text-blue-700 font-bold">@{profile.username}</span>).
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span>Otomatis Tersimpan</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase block">Kamus Hafal</span>
            <span className="text-base sm:text-xl font-black text-slate-800 font-mono">
              {masteredWordIds.length} / {VOCABULARY_LIST.length}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase block">Streak Aktif</span>
            <span className="text-base sm:text-xl font-black text-slate-800 font-mono">
              {profile.streak} Hari
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase block">Best Skor Kuis</span>
            <span className="text-base sm:text-xl font-black text-slate-800 font-mono">
              {profile.quizHighScore || 680}
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-blue-100 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase block">Status Siswa</span>
            <span className="text-xs sm:text-sm font-black text-blue-700">
              {profile.level >= 3 ? 'Kanca Akrab' : 'Siap Adaptasi'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Feature Hub & Word of Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 3 Games Highlights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-600" />
              <span>Arena Interaktif & Mini Games</span>
            </h2>
            <button
              onClick={() => handleAction('games')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Semua Game</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Game Card 1 */}
            <div 
              onClick={() => handleAction('games')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                  Tebak Slang Kilat
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Speed quiz 15 detik! Jawab arti kosakata & dapatkan kombo poin.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                <span>Main Kuis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Game Card 2 */}
            <div 
              onClick={() => handleAction('roleplay')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  🏫
                </div>
                <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-700 transition-colors">
                  Lorong & Kantin
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Petualangan interaktif bersama Budi & Pak David di SMP Gloria 2.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                <span>Mulai Cerita</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Game Card 3 */}
            <div 
              onClick={() => handleAction('games')}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-sky-400 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  🧩
                </div>
                <h3 className="text-sm font-black text-slate-800 group-hover:text-sky-700 transition-colors">
                  Jodoh Kata
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Memory match puzzle! Pasangkan kata Suroboyoan dengan artinya.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
                <span>Cocokkan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Quick Everyday School Slang Card (Visual, silent) */}
          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Frasa Gaul Sekolah yang Paling Sering Muncul</span>
                </h3>
                <p className="text-xs text-slate-500">Gunakan kata-kata ini saat ngobrol santai bareng teman sekelas:</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                { slang: 'Ayo rek, wis bel!', arti: 'Ayo teman, sudah bel masuk' },
                { slang: 'PR-mu wis mari ta?', arti: 'PR-mu sudah selesai belum?' },
                { slang: 'Santai wae rek!', arti: 'Santai saja kawan' },
                { slang: 'Kene tak ewangi!', arti: 'Sini kubantu kerjakan' },
                { slang: 'Antrene suwe rek!', arti: 'Antreannya lama sekali' },
                { slang: 'Ndang budal rek!', arti: 'Cepat berangkat sekarang' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100"
                >
                  <p className="text-xs font-black text-blue-900 mb-0.5">&ldquo;{item.slang}&rdquo;</p>
                  <p className="text-[10px] text-slate-500 font-medium">{item.arti}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Word of the Day & Scripture Quote */}
        <div className="space-y-4">
          
          {/* Word of the Day Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-xs">
                Kata Sorotan Hari Ini
              </span>
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-1">
              {wordOfTheDay.word}
            </h3>
            <p className="text-xs font-bold text-blue-700 mb-3">
              Artinya: <span className="text-slate-900 font-extrabold">{wordOfTheDay.meaning}</span>
            </p>

            <div className="p-3 rounded-2xl bg-white border border-blue-100 text-xs text-slate-600 mb-3 leading-relaxed shadow-xs">
              <span className="text-blue-700 font-bold block mb-1">💡 Catatan Khusus:</span>
              {wordOfTheDay.context}
            </div>

            <div className="p-2.5 rounded-xl bg-blue-100/70 border border-blue-200 text-xs text-blue-900 font-medium">
              &ldquo;{wordOfTheDay.exampleSuroboyo}&rdquo;
            </div>
          </div>

          {/* Scripture Card (Roma 15:7) */}
          <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black text-blue-700 mb-1">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>{AUTHORS_INFO.bibleVerse.verse}</span>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &ldquo;{AUTHORS_INFO.bibleVerse.text}&rdquo;
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
