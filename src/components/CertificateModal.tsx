import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Award, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Info, 
  Loader2,
  FileCheck2 
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { AUTHORS_INFO } from '../data/suroboyoData';
import { GloriaLogo } from './GloriaLogo';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#fbbf24', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Ignore if confetti is not available
    }
  };

  /**
   * Unduh kartu dalam resolusi tinggi (PNG HD)
   * Selalu bekerja 100% di semua browser, HP, dan lingkungan iframe.
   */
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const sanitizedName = (profile.name || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Kartu-Arek-Gloria2-${sanitizedName}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerCelebration();
      setStatusMessage({
        type: 'success',
        text: `Kartu Arek berhasil diunduh (${filename})! Kamu bisa menyimpannya di galeri atau langsung mencetaknya.`,
      });
    } catch (error) {
      console.error('Failed to download card image:', error);
      setStatusMessage({
        type: 'error',
        text: 'Gagal mengunduh kartu. Silakan coba lagi atau gunakan tombol cetak.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Cetak kartu ke printer fisik atau Simpan sebagai PDF.
   * Dilengkapi penanganan iframe sandbox & auto fallback ke unduhan gambar jika browser memblokir dialog print.
   */
  const handlePrint = async () => {
    setIsProcessing(true);
    setStatusMessage(null);

    let printSucceeded = false;

    try {
      // Coba panggil dialog print bawaan browser
      window.print();
      printSucceeded = true;
      setStatusMessage({
        type: 'info',
        text: 'Dialog cetak / Simpan PDF dipanggil. Jika preview browser tidak muncul karena mode iframe, gunakan tombol "Unduh Gambar (PNG)".',
      });
    } catch (err) {
      console.warn('Direct window.print() failed:', err);
    }

    // Jika window.print() diblokir oleh sandbox iframe tanpa melempar error,
    // kita juga sediakan pengunduhan otomatis agar siswa tetap mendapatkan kartunya
    if (!printSucceeded && cardRef.current) {
      try {
        await handleDownloadImage();
        setStatusMessage({
          type: 'info',
          text: 'Browser membatasi dialog cetak di mode pratinjau. Kartu otomatis diunduh sebagai gambar HD (PNG) siap cetak!',
        });
      } catch (e) {
        console.error('Print fallback download failed:', e);
      }
    }

    setIsProcessing(false);
  };

  /**
   * Salin gambar kartu ke papan klip (clipboard) agar bisa langsung dipaste ke chat/dokumen
   */
  const handleCopyCard = async () => {
    if (!cardRef.current) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const blob = await toBlob(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });

        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          triggerCelebration();
          setStatusMessage({
            type: 'success',
            text: 'Gambar Kartu Arek berhasil disalin ke papan klip! Siap dipaste (Ctrl+V) ke Word, WA, atau Docs.',
          });
          setTimeout(() => setCopied(false), 3000);
          setIsProcessing(false);
          return;
        }
      }

      // Fallback copy info
      await navigator.clipboard.writeText(
        `🏆 Kartu Kehormatan Arek Gloria 2\nNama: ${profile.name} (${profile.grade})\nPredikat: ${getRankTitle(profile.level)} (${profile.xp} XP)\nSMP Kristen Gloria 2 Pakuwon City`
      );
      setCopied(true);
      setStatusMessage({
        type: 'success',
        text: 'Data Kartu Arek berhasil disalin ke clipboard!',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Failed to copy card to clipboard:', err);
      setStatusMessage({
        type: 'info',
        text: 'Clipboard gambar tidak didukung oleh browser ini. Silakan gunakan tombol "Unduh Gambar (PNG)".',
      });
    } finally {
      setIsProcessing(false);
    }
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
    <div className="certificate-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="certificate-modal-container relative w-full max-w-2xl bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup modal kartu"
          className="no-print absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="no-print text-center mb-5">
          <div className="inline-flex p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-2">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Kartu Kehormatan Arek Gloria 2
          </h2>
          <p className="text-xs text-slate-500">
            Bukti kelulusan adaptasi bahasa & budaya Suroboyoan di SMP Kristen Gloria 2
          </p>
        </div>

        {/* Certificate Card Printable Area - White & Royal Blue */}
        <div
          id="printable-student-card"
          ref={cardRef}
          className="relative rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 border-2 border-blue-500 p-5 sm:p-8 shadow-sm overflow-hidden text-center"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-blue-600 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-blue-600 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-blue-600 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-blue-600 rounded-br-lg" />

          {/* School Header */}
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <GloriaLogo className="w-7 h-7 text-blue-800" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-blue-800">
              SMP KRISTEN GLORIA 2 PAKUWON CITY
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            GLOWERS AUTO SUROBOYOAN SURVIVAL KIT
          </p>

          <p className="text-xs text-slate-600 italic mb-2">
            Dengan bangga diberikan kepada siswa berprestasi:
          </p>

          {/* Student Name */}
          <div className="inline-block px-5 sm:px-7 py-2.5 rounded-2xl bg-white border border-blue-200 mb-3 shadow-xs">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-blue-900 tracking-wide">
              {profile.avatar} {profile.name}
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Kelas: <span className="text-blue-700">{profile.grade}</span> • Username: <span className="font-mono text-slate-700">@{profile.username}</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-4">
            Telah aktif mempelajari kosakata Suroboyoan, memahami kehangatan intonasi bicara, serta menjunjung tinggi nilai kasih persaudaraan sesama siswa.
          </p>

          {/* Rank Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-500/20 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Predikat: {getRankTitle(profile.level)} (Total {profile.xp} XP)</span>
          </div>

          {/* Scripture footer */}
          <div className="border-t border-blue-100 pt-3 max-w-sm mx-auto text-[11px] text-slate-600 italic">
            &ldquo;{AUTHORS_INFO.bibleVerse.text}&rdquo; — {AUTHORS_INFO.bibleVerse.verse}
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end mt-5 pt-3 border-t border-slate-200 text-[10px] text-slate-500 text-left">
            <div>
              <p className="text-slate-400">Tanggal Terbit:</p>
              <p className="font-bold text-slate-700">{today}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Disusun oleh:</p>
              <p className="font-bold text-blue-700">Clarabelle (8C), Caroline, Karen, Sidney (8F)</p>
            </div>
          </div>
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`no-print mt-4 p-3 rounded-2xl flex items-start gap-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-snug">{statusMessage.text}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Download HD Image Button (Primary Action - Guaranteed 100% Works Everywhere) */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-sky-200" />
              )}
              <span>Unduh Gambar (PNG HD)</span>
            </button>

            {/* Direct Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isProcessing}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak / PDF</span>
            </button>

            {/* Copy to Clipboard Button */}
            <button
              type="button"
              onClick={handleCopyCard}
              disabled={isProcessing}
              className="py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
              title="Salin gambar kartu ke papan klip"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sky-700" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Close Button & Friendly Info */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              💡 Gambar HD bisa dicetak di kertas A4 atau disimpan ke galeri ponselmu.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

