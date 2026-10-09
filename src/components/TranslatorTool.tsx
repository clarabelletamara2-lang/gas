import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Lightbulb
} from 'lucide-react';
import { PHRASE_TRANSLATIONS } from '../data/suroboyoData';

const WORD_MAP: { [key: string]: string } = {
  'selesai': 'mari',
  'sudah': 'wis',
  'lama': 'suwe',
  'lapar': 'luwe',
  'kamu': 'kon',
  'teman': 'rek',
  'teman-teman': 'rek',
  'kawan': 'rek',
  'nggak': 'gak',
  'tidak': 'gak',
  'ini': 'iki',
  'itu': 'iku',
  'apa': 'opo',
  'siapa': 'sopo',
  'berapa': 'piro',
  'bagaimana': 'yo opo',
  'gimana': 'yo opo',
  'masuk': 'mlebu',
  'keluar': 'metu',
  'sini': 'kene',
  'bantu': 'ewangi',
  'tolong': 'ewangi',
  'kerjakan': 'nggarap',
  'mengerjakan': 'nggarap',
  'keren': 'mbois',
  'nongkrong': 'cangkruk',
  'ngapain': 'lapo',
  'cepat': 'ndang',
  'segera': 'ndang',
  'minta': 'njaluk',
  'pulang': 'mulih',
  'tidur': 'turu',
  'bentar': 'sek',
  'tunggu': 'sek talah',
  'kalau': 'nek',
  'berani': 'wani',
  'pusing': 'ngelu',
  'dengan': 'ambek',
  'sama': 'ambek',
  'jangan': 'ojok',
  'bisa': 'iso',
  'bagus': 'apik',
  'banget': 'pol',
  'sangat': 'pol',
  'berangkat': 'budal',
  'kenyang': 'wareg',
};

const REVERSE_MAP: { [key: string]: string } = {
  'mari': 'selesai',
  'wis': 'sudah',
  'suwe': 'lama',
  'luwe': 'lapar',
  'kon': 'kamu (khusus teman sebaya)',
  'rek': 'teman-teman / kawan',
  'gak': 'tidak / nggak',
  'ora': 'tidak',
  'iki': 'ini',
  'iku': 'itu',
  'opo': 'apa',
  'sopo': 'siapa',
  'piro': 'berapa',
  'yo opo': 'bagaimana / gimana',
  'piye': 'bagaimana',
  'mlebu': 'masuk',
  'metu': 'keluar',
  'kene': 'sini',
  'ewangi': 'bantu / tolong',
  'nggarap': 'mengerjakan',
  'mbois': 'keren banget',
  'sangar': 'hebat pol',
  'cangkruk': 'nongkrong',
  'lapo': 'ngapain',
  'ndang': 'cepat / segera',
  'njaluk': 'minta',
  'mulih': 'pulang',
  'turu': 'tidur',
  'sek': 'bentar dulu',
  'nek': 'kalau / misalkan',
  'wani': 'berani',
  'ngelu': 'pusing kepala',
  'ambek': 'dengan / sama',
  'ojok': 'jangan',
  'iso': 'bisa',
  'apik': 'bagus / keren',
  'pol': 'banget / sangat',
  'budal': 'berangkat',
  'wareg': 'kenyang',
};

export const TranslatorTool: React.FC = () => {
  const [direction, setDirection] = useState<'id_to_sby' | 'sby_to_id'>('id_to_sby');
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const translateText = (text: string, dir: 'id_to_sby' | 'sby_to_id') => {
    if (!text.trim()) return '';

    const lower = text.trim().toLowerCase();
    for (const phrase of PHRASE_TRANSLATIONS) {
      if (dir === 'id_to_sby' && phrase.indonesia.toLowerCase() === lower) {
        return phrase.suroboyoan;
      }
      if (dir === 'sby_to_id' && phrase.suroboyoan.toLowerCase() === lower) {
        return phrase.indonesia;
      }
    }

    const map = dir === 'id_to_sby' ? WORD_MAP : REVERSE_MAP;
    const words = text.split(/\s+/);
    const translatedWords = words.map((w) => {
      const clean = w.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
      const punctuation = w.replace(/[a-zA-Z0-9-]/g, '');
      if (map[clean]) {
        return map[clean] + punctuation;
      }
      return w;
    });

    let res = translatedWords.join(' ');
    if (dir === 'id_to_sby' && text.includes('?') && !res.includes('ta?')) {
      res = res.replace('?', ' ta?');
    }
    return res;
  };

  const outputText = translateText(inputText, direction);

  const handleSwap = () => {
    setDirection((prev) => (prev === 'id_to_sby' ? 'sby_to_id' : 'id_to_sby'));
    setInputText(outputText);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Translator Gaul Suroboyoan</h3>
            <p className="text-xs text-slate-500">Ketik kalimat atau pilih contoh percakapan sekolah Gloria 2</p>
          </div>
        </div>

        {/* Direction Switcher */}
        <button
          onClick={handleSwap}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 transition-all self-start sm:self-auto shadow-xs"
        >
          <span className={direction === 'id_to_sby' ? 'text-blue-700 font-black' : 'text-slate-500'}>
            Bahasa Indonesia
          </span>
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          <span className={direction === 'sby_to_id' ? 'text-blue-700 font-black' : 'text-slate-500'}>
            Basa Suroboyoan
          </span>
        </button>
      </div>

      {/* Preset Phrases */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          <span>Contoh Kalimat Populer di SMP Gloria 2:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {PHRASE_TRANSLATIONS.slice(0, 5).map((p, idx) => {
            const preview = direction === 'id_to_sby' ? p.indonesia : p.suroboyoan;
            return (
              <button
                key={idx}
                onClick={() => setInputText(preview)}
                className="px-3 py-1.5 rounded-xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200 text-xs text-blue-900 font-medium transition-all text-left shadow-xs"
              >
                &ldquo;{preview}&rdquo;
              </button>
            );
          })}
        </div>
      </div>

      {/* Textareas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>{direction === 'id_to_sby' ? 'Bahasa Indonesia' : 'Bahasa Suroboyoan'}</span>
            <span className="text-[10px] text-slate-400 font-normal">Ketik kalimat bebas</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              direction === 'id_to_sby'
                ? 'Contoh: Kamu sudah selesai belum PR-nya? Sini kubantu...'
                : 'Contoh: Wis mari ta PR-mu? Kene tak ewangi nggarap...'
            }
            rows={4}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none font-medium shadow-xs"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span className="text-blue-700 font-black">
              {direction === 'id_to_sby' ? 'Hasil Terjemahan Suroboyoan' : 'Hasil Terjemahan Indonesia'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                disabled={!outputText}
                title="Salin hasil"
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 flex items-center gap-1 text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="text-[10px] font-bold">{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </label>

          <div className="w-full p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-sm text-blue-950 min-h-[114px] flex flex-col justify-between font-semibold shadow-inner">
            <p className="leading-relaxed">
              {outputText || (
                <span className="text-slate-400 italic font-normal">
                  Hasil terjemahan otomatis akan tampil di sini...
                </span>
              )}
            </p>

            {outputText && (
              <div className="pt-2 mt-2 border-t border-blue-200 text-[11px] text-blue-800 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Gaya bahasa santai, khas arek SMP Gloria 2 Surabaya!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
