import React, { useRef } from 'react';
import { X, Printer, Award, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';
import { AUTHORS_INFO } from '../data/suroboyoData';
import { playSound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getRankTitle = (lvl: number) => {
    if (lvl >= 5) return 'Master Glowers Suroboyoan';
    if (lvl >= 3) return 'Kanca Akrab Arek Gloria';
    return 'Arek Anyar Beradaptasi';
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Kartu Kehormatan Arek Gloria 2
          </h2>
          <p className="text-xs text-slate-500">
            Bukti kelulusan adaptasi budaya & bahasa Suroboyoan
          </p>
        </div>

        {/* Certificate Card Printable Area - White & Royal Blue */}
        <div
          ref={cardRef}
          className="relative rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border-2 border-blue-500 p-6 sm:p-8 shadow-sm overflow-hidden text-center"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-blue-600 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-blue-600 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-600 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-blue-600 rounded-tr-lg" />

          {/* School Header */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">🦁</span>
            <span className="text-xs font-black uppercase tracking-widest text-blue-800">
              SMP KRISTEN GLORIA 2 PAKUWON CITY
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-5">
            GLOWERS AUTO SUROBOYOAN SURVIVAL KIT
          </p>

          <p className="text-xs text-slate-600 italic mb-2">
            Dengan bangga diberikan kepada siswa hebat:
          </p>

          {/* Student Name */}
          <div className="inline-block px-6 py-2 rounded-2xl bg-white border border-blue-200 mb-3 shadow-sm">
            <h3 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-wide">
              {profile.avatar} {profile.name}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              Kelas: {profile.grade}
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-4">
            Telah berhasil mempelajari kosakata Suroboyoan, memahami kehangatan intonasi bicara, serta menjunjung tinggi nilai kasih persaudaraan sesama siswa.
          </p>

          {/* Rank Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Predikat: {getRankTitle(profile.level)} (Total {profile.xp} XP)</span>
          </div>

          {/* Scripture footer */}
          <div className="border-t border-blue-100 pt-4 max-w-sm mx-auto text-[11px] text-slate-600 italic">
            &ldquo;{AUTHORS_INFO.bibleVerse.text}&rdquo; — {AUTHORS_INFO.bibleVerse.verse}
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-left">
            <div>
              <p className="text-slate-400">Tanggal:</p>
              <p className="font-bold text-slate-700">{today}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Disusun oleh:</p>
              <p className="font-bold text-blue-700">Clarabelle (8C), Caroline, Karen, Sidney (8F)</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-black shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
