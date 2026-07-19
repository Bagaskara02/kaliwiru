import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

/* ── Category Icons ── */
const categoryIcons = {
  ibadah: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21',
  pendidikan: 'M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  kesehatan: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  olahraga: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522',
  umum: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm3-6h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm4.5-6h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75zm0 3h.75v.75h-.75v-.75z',
};

const categoryColors = {
  ibadah: 'from-emerald-500 to-emerald-700',
  pendidikan: 'from-blue-500 to-blue-700',
  kesehatan: 'from-rose-500 to-rose-700',
  olahraga: 'from-amber-500 to-amber-700',
  umum: 'from-leaf-500 to-leaf-700',
};

function getCategoryKey(category) {
  const lower = (category || '').toLowerCase();
  if (lower.includes('ibadah') || lower.includes('masjid') || lower.includes('mushola')) return 'ibadah';
  if (lower.includes('pendidikan') || lower.includes('sekolah') || lower.includes('paud')) return 'pendidikan';
  if (lower.includes('kesehatan') || lower.includes('posyandu') || lower.includes('puskesmas')) return 'kesehatan';
  if (lower.includes('olahraga') || lower.includes('lapangan')) return 'olahraga';
  return 'umum';
}

/* ── Map Pin Icon ── */
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

/* ── Skeleton loader ── */
const FasilitasSkeleton = () => (
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
function FasilitasModal({ item, onClose }) {
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
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-leaf-50 hover:text-leaf-700 hover:border-leaf-200 transition-colors"
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
   Fasilitas Section
   ═══════════════════════════════════════════════════════ */
export default function Fasilitas() {
  const { fasilitas, loading } = useSiteData();
  const [selected, setSelected] = useState(null);

  // Jangan tampilkan section jika data kosong dan tidak loading
  if (!loading && (!fasilitas || fasilitas.length === 0)) return null;

  return (
    <>
      <section id="fasilitas" className="py-16 md:py-24 bg-warm-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs text-leaf-600 font-medium uppercase tracking-widest mb-2">
              Sarana Padukuhan
            </p>
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900 mb-2">
              Fasilitas Umum
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Informasi mengenai fasilitas publik yang tersedia di Kaliwiru.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <FasilitasSkeleton key={i} />
                ))
              : fasilitas.map((item) => {
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
                            className="inline-flex items-center gap-1.5 flex-1 justify-center px-4 py-2 bg-leaf-600 text-white text-sm font-medium rounded-lg hover:bg-leaf-700 transition-colors"
                          >
                            Lihat Detail
                          </button>
                          {item.gmaps && (
                            <a
                              href={item.gmaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-500 rounded-lg hover:bg-leaf-50 hover:text-leaf-700 hover:border-leaf-200 transition-colors"
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

      <FasilitasModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
