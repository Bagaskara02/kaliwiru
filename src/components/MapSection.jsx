import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

/* ── Modal for Map Image with Zoom/Pan Support ── */
function MapModal({ image, title, onClose }) {
  const [scale, setScale] = useState(1);

  if (!image) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
        <h3 className="text-white font-medium text-sm drop-shadow-md truncate pr-4">{title}</h3>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <button onClick={handleZoomOut} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Zoom Out">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
            </svg>
          </button>
          <button onClick={handleZoomIn} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Zoom In">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </button>
          <button onClick={handleReset} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors ml-1 sm:ml-2" aria-label="Reset Zoom">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <div className="w-px h-6 bg-white/20 mx-1 sm:mx-2" />
          <button onClick={onClose} className="p-2 text-white bg-white/10 hover:bg-red-500/80 rounded-full transition-colors" aria-label="Tutup">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Container with Scroll (for panning when zoomed) */}
      <div 
        className="flex-1 overflow-auto flex items-center justify-center p-4 mt-14"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="relative transition-transform duration-200 ease-out flex items-center justify-center"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
          <img
            src={image}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain drop-shadow-2xl select-none"
            draggable={false}
          />
        </div>
      </div>
      
      {/* Hint for mobile */}
      <div className="absolute bottom-6 inset-x-0 text-center pointer-events-none">
        <span className="inline-block px-4 py-1.5 bg-black/50 backdrop-blur text-white/70 text-xs rounded-full">
          Gunakan tombol di atas untuk zoom, dan geser layar.
        </span>
      </div>
    </div>
  );
}

/* ── Reusable map card — supports embed iframe, static image, or placeholder ── */
function MapCard({ data, onOpenImage }) {
  const hasEmbed = Boolean(data.embedUrl);
  const hasImage = Boolean(data.image);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{data.title}</h3>

      <div className="rounded-xl overflow-hidden border border-leaf-200 bg-white relative group">
        {hasEmbed ? (
          <iframe
            src={data.embedUrl}
            className="w-full h-[320px] md:h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={data.title}
          />
        ) : hasImage ? (
          <div 
            className="w-full h-[320px] md:h-[400px] cursor-pointer relative"
            onClick={() => onOpenImage({ image: data.image, title: data.title })}
          >
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay hint to click */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="bg-white/95 text-gray-800 text-[13px] font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Perbesar Peta
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-[320px] md:h-[400px] bg-leaf-50 flex flex-col items-center justify-center text-center px-6">
            <svg
              className="w-10 h-10 text-leaf-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
            <p className="text-sm text-leaf-500 font-medium">Belum tersedia</p>
            <p className="text-xs text-leaf-400 mt-1">
              Tambahkan gambar atau embed URL di siteData.js
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2.5">{data.description}</p>
    </div>
  );
}

export default function MapSection() {
  const { map } = useSiteData();
  const [modalData, setModalData] = useState(null);

  return (
    <>
      <section id="peta" className="py-16 md:py-24 bg-warm-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="max-w-xl mb-12">
            <p className="text-sm text-leaf-600 font-medium mb-1.5">
              Lokasi &amp; Wilayah
            </p>
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900">
              Peta Padukuhan Giling
            </h2>
          </div>

          {/* Two-column map grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MapCard data={map.wilayah} onOpenImage={setModalData} />
            <MapCard data={map.administrasi} onOpenImage={setModalData} />
          </div>
        </div>
      </section>

      {/* Pop-up Image Modal */}
      {modalData && (
        <MapModal 
          image={modalData.image} 
          title={modalData.title} 
          onClose={() => setModalData(null)} 
        />
      )}
    </>
  );
}
