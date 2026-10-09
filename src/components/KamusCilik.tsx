import React, { useState } from 'react';
import { 
  Search, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { VOCABULARY_LIST } from '../data/suroboyoData';

interface KamusCilikProps {
  masteredWordIds: string[];
  onToggleMastered: (id: string) => void;
}

export const KamusCilik: React.FC<KamusCilikProps> = ({
  masteredWordIds,
  onToggleMastered,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  const categories = [
    { id: 'semua', label: 'Semua Kosakata' },
    { id: 'dasar', label: 'Kata Dasar' },
    { id: 'tanya', label: 'Kata Tanya' },
    { id: 'aktivitas', label: 'Aktivitas' },
    { id: 'ungkapan', label: 'Ungkapan Khas' },
    { id: 'sekolah', label: 'Sekolah' },
    { id: 'gaul', label: 'Gaul Remaja' },
  ];

  const filteredVocab = VOCABULARY_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.word.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.context.toLowerCase().includes(query) ||
      item.exampleSuroboyo.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Kamus Cilik Suroboyoan ({VOCABULARY_LIST.length} Kata)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kumpulan kosakata sehari-hari dialek Jawa Surabaya untuk siswa SMP Kristen Gloria 2 Pakuwon City.
          </p>
        </div>

        {/* Mastered Counter */}
        <div className="flex items-center gap-3 bg-blue-50/80 px-4 py-3 rounded-2xl border border-blue-200 self-start sm:self-auto">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase block">Dikuasai</span>
            <span className="text-sm font-black text-blue-800 font-mono">
              {masteredWordIds.length} / {VOCABULARY_LIST.length} Kata
            </span>
          </div>
        </div>
      </div>

      {/* Visual Accent Guide Banner (Silent & Informative) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-md shadow-blue-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              📢 Ciri Khas Logat Medok Suroboyo
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Karakter Komunikasi Lugas & Ceplos-Ceplos Arek Suroboyo:
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed pt-1">
            • <strong>Vokal &apos;O&apos; Bulat:</strong> Kata seperti <em>opo, sopo, podo</em> diucapkan dengan bibir bulat penuh.<br/>
            • <strong>Konsonan Mantap:</strong> Huruf <em>B, D, G, J</em> ditekan tegas dan berbobot.<br/>
            • <strong>Partikel Spontan:</strong> Sisipkan partikel <em>&ldquo;rek!&rdquo;</em>, <em>&ldquo;ta?&rdquo;</em>, dan <em>&ldquo;pol!&rdquo;</em> untuk menambah keakraban santai.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata Suroboyoan atau artinya (contoh: mari, suwe, cangkruk, luwe, rek)..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-blue-700 hover:border-blue-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocab.map((item) => {
          const isMastered = masteredWordIds.includes(item.id);
          const isWarning = item.word.includes('Kon') || item.word.includes('Mari');

          return (
            <div
              key={item.id}
              className={`rounded-3xl border p-5 transition-all flex flex-col justify-between group shadow-sm ${
                isMastered
                  ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header: Word */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.word}
                    </h3>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">
                      Artinya: <span className="text-slate-900 font-extrabold">{item.meaning}</span>
                    </p>
                  </div>

                  {/* Mastered Toggle */}
                  <button
                    onClick={() => onToggleMastered(item.id)}
                    title={isMastered ? 'Tandai belum hafal' : 'Tandai sudah hafal (+15 XP)'}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                      isMastered
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">
                      {isMastered ? 'Hafal' : 'Belum'}
                    </span>
                  </button>
                </div>

                {/* Context Notes */}
                <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <span className="text-blue-700 font-bold shrink-0">Konteks:</span>
                    <span className="leading-relaxed">{item.context}</span>
                  </div>

                  {item.pronunciationHint && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
                      💡 {item.pronunciationHint}
                    </div>
                  )}
                </div>

                {/* School Example Dialogue */}
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                  <p className="font-mono font-bold text-blue-900 text-[11px]">
                    🗣️ &ldquo;{item.exampleSuroboyo}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    ({item.exampleIndo})
                  </p>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Kategori: {item.category}</span>
                {isWarning && (
                  <span className="text-blue-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Penting
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredVocab.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">Tidak ada kata yang cocok dengan &quot;{searchQuery}&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('semua');
            }}
            className="mt-3 text-xs font-bold text-blue-600 underline"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
};
