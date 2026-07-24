import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

/* ── Category Icons ── */
const categoryIcons = {
  tarian: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
  musik: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
  tradisi: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21',
  kerajinan: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
  budaya: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605',
};

const categoryColors = {
  tarian: 'from-rose-500 to-pink-700',
  musik: 'from-indigo-500 to-violet-700',
  tradisi: 'from-amber-500 to-orange-700',
  kerajinan: 'from-teal-500 to-emerald-700',
  budaya: 'from-purple-500 to-purple-700',
};

function getCategoryKey(category) {
  const lower = (category || '').toLowerCase();
  if (lower.includes('tari') || lower.includes('tarian')) return 'tarian';
  if (lower.includes('musik') || lower.includes('gamelan') || lower.includes('karawitan')) return 'musik';
  if (lower.includes('tradisi') || lower.includes('upacara') || lower.includes('adat')) return 'tradisi';
  if (lower.includes('kerajinan') || lower.includes('batik')) return 'kerajinan';
  return 'budaya';
}

/* ── Map Pin Icon ── */
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

/* ── Skeleton loader ── */
const KebudayaanSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl border border-warm-200 overflow-hidden">
    <div className="h-40 bg-warm-100" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-warm-200 rounded w-16" />
      <div className="h-4 bg-warm-200 rounded w-3/4" />
      <div className="h-3 bg-warm-100 rounded w-full" />
    </div>
  </div>
);

/* ── Detail Modal ── */
function KebudayaanModal({ item, onClose }) {
  if (!item) return null;

  const catKey = getCategoryKey(item.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image / Gradient */}
        <div className="relative h-52 sm:h-60 overflow-hidden rounded-t-xl">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${categoryColors[catKey]} flex flex-col items-center justify-center gap-3`}>
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[catKey]} />
                </svg>
              </div>
              <span className="text-white/90 text-sm font-medium">{item.name}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 text-gray-600 text-xs font-medium rounded">
            {item.category}
          </span>
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.name}</h3>

          {item.description && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{item.description}</p>
          )}

          {item.gmaps && (
            <a
              href={item.gmaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
            >
              <MapPinIcon />
              Lihat di Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Kebudayaan Section
   ═══════════════════════════════════════════════════════ */
export default function Kebudayaan() {
  const { kebudayaan, loading } = useSiteData();
  const [selected, setSelected] = useState(null);

  // Jangan tampilkan section jika data kosong dan tidak loading
  if (!loading && (!kebudayaan || kebudayaan.length === 0)) return null;

  return (
    <>
      <section id="kebudayaan" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs text-purple-600 font-medium uppercase tracking-widest mb-2">
              Warisan Budaya
            </p>
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-gray-900 mb-2">
              Kebudayaan & Kesenian
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Informasi mengenai ragam kebudayaan dan tradisi yang dilestarikan di Kaliwiru.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <KebudayaanSkeleton key={i} />
                ))
              : kebudayaan.map((item) => {
                  const catKey = getCategoryKey(item.category);

                  return (
                    <article
                      key={item.id}
                      className="group bg-white rounded-xl border border-warm-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
                      onClick={() => setSelected(item)}
                    >
                      {/* Image / Gradient placeholder */}
                      <div className="relative h-40 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${categoryColors[catKey]} flex items-center justify-center group-hover:opacity-90 transition-opacity`}>
                            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[catKey]} />
                              </svg>
                            </div>
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 text-gray-600 text-[11px] font-medium rounded">
                          {item.category}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-[15px] font-medium text-gray-800 mb-1">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-[13px] text-gray-400 leading-relaxed mb-3 flex-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-auto">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelected(item); }}
                            className="inline-flex items-center gap-1.5 flex-1 justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Lihat Detail
                          </button>
                          {item.gmaps && (
                            <a
                              href={item.gmaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-500 rounded-lg hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                              title="Lihat di Google Maps"
                            >
                              <MapPinIcon />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
          </div>
        </div>
      </section>

      <KebudayaanModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
