import React from 'react';
import { 
  BookHeart, 
  CheckCircle2, 
  XCircle,
} from 'lucide-react';
import { CULTURE_TIPS, ETHICS_RULES, AUTHORS_INFO } from '../data/suroboyoData';
import { GloriaLogo } from './GloriaLogo';

export const TipsAndEthics: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Introduction Hero - White & Blue */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider mb-3">
            <span>🛡️</span> Survival Kit Siswa Mutasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Pengantar & Kenalan dengan Bahasa Suroboyoan
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
            Bahasa Suroboyoan (dialek Jawa khas Surabaya) dikenal dengan sifatnya yang lugas, ceplos-ceplos, dan penuh keakraban. Bagi siswa mutasi, mendengar intonasi bicara yang tinggi dan cepat mungkin terkesan tegas. Namun hal tersebut sebenarnya adalah bentuk keterbukaan dan rasa kebersamaan.
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Guide book ini dirancang untuk membantumu beradaptasi dengan nyaman, memahami kebiasaan komunikasi, dan mempererat relasi sosial di lingkungan sekolah kita tercinta!
          </p>
        </div>
      </div>

      {/* 4 Cultural Adaptation Tips */}
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <span>🌟</span> 4 Tips Adaptasi Budaya untuk Siswa Mutasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CULTURE_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-sm font-black text-blue-700">
                    {tip.id}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-blue-800 border border-slate-200">
                    {tip.badge}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2">{tip.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scripture Card (Roma 15:7) - Royal Blue Theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/15 text-white rounded-2xl shrink-0 backdrop-blur-sm">
            <BookHeart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-blue-200 tracking-wider">
              Landasan Kasih Persaudaraan
            </span>
            <h4 className="text-lg font-black text-white mt-1 mb-2">
              {AUTHORS_INFO.bibleVerse.verse}
            </h4>
            <p className="text-sm sm:text-base text-blue-50 italic font-medium leading-relaxed">
              &ldquo;{AUTHORS_INFO.bibleVerse.text}&rdquo;
            </p>
            <p className="text-xs text-blue-200 mt-2">
              Perbedaan latar belakang budaya dan bahasa adalah anugerah Tuhan yang mempersatukan kita di keluarga besar SMP Kristen Gloria 2.
            </p>
          </div>
        </div>
      </div>

      {/* Do's & Don'ts of Suroboyoan Ethics */}
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <span>⚠️</span> Etika & Catatan Penggunaan Kosa Kata
        </h3>
        <div className="space-y-3">
          {ETHICS_RULES.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="md:col-span-1">
                <span className="text-xs font-black uppercase text-blue-700 block mb-1">Topik</span>
                <h4 className="text-sm font-black text-slate-900">{item.rule}</h4>
              </div>
              <div className="md:col-span-1 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cara Tepat (Boleh)
                </span>
                <p className="text-emerald-900 leading-relaxed">{item.allowed}</p>
              </div>
              <div className="md:col-span-1 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="font-bold text-rose-700 flex items-center gap-1 mb-1">
                  <XCircle className="w-3.5 h-3.5" /> Hindari (Jangan)
                </span>
                <p className="text-rose-900 leading-relaxed">{item.forbidden}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author Credits Box */}
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center p-2 shadow-sm text-blue-700">
            <GloriaLogo className="w-8 h-8 text-blue-700" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">{AUTHORS_INFO.school}</h4>
            <p className="text-xs text-slate-500">Survival Kit Adaptasi Budaya untuk Siswa Mutasi</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Disusun oleh:</span>
          {AUTHORS_INFO.authors.map((auth, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800"
            >
              {auth.name} ({auth.class})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
