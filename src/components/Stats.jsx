import { useSiteData } from '../context/SiteDataContext';

/* ── Icons ── */
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const MaleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const FemaleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21H4.125c-.621 0-1.125-.504-1.125-1.125V9.75m0 0L12 3.375 21 9.75M3 9.75h18" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

/* ── Skeleton loader ── */
const StatSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl p-6 border border-warm-200 shadow-sm">
    <div className="h-4 bg-warm-200 rounded w-20 mb-3" />
    <div className="h-8 bg-warm-200 rounded w-16 mb-2" />
    <div className="h-3 bg-warm-100 rounded w-28" />
  </div>
);

export default function Stats() {
  const { stats, loading } = useSiteData();

  if (loading) {
    return (
      <section id="statistik" className="py-16 md:py-24 bg-warm-50 border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <div className="h-4 bg-warm-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-7 bg-warm-200 rounded w-60 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Normalisasi data statistik
  let totalPenduduk = 0;
  let lakiLaki = 0;
  let perempuan = 0;
  let jumlahKK = 0;
  let jumlahRumah = 0;
  let rtData = [];

  if (stats) {
    if (Array.isArray(stats)) {
      // Format array lama
      stats.forEach((s) => {
        const id = String(s.id || '').toLowerCase();
        if (id.includes('kk')) jumlahKK = s.value || 0;
        else if (id.includes('male') || id.includes('laki')) lakiLaki = s.value || 0;
        else if (id.includes('female') || id.includes('perempuan')) perempuan = s.value || 0;
        else if (id.includes('rumah')) jumlahRumah = s.value || 0;
      });
      totalPenduduk = lakiLaki + perempuan;
    } else {
      // Format objek baru
      totalPenduduk = stats.totalPenduduk || 0;
      lakiLaki = stats.lakiLaki || 0;
      perempuan = stats.perempuan || 0;
      jumlahKK = stats.jumlahKK || 0;
      jumlahRumah = stats.jumlahRumah || 0;
      rtData = stats.rt || [];

      if (!totalPenduduk && (lakiLaki || perempuan)) {
        totalPenduduk = lakiLaki + perempuan;
      }
    }
  }

  // Card items summary
  const summaryCards = [
    {
      id: 'total',
      label: 'Total Penduduk',
      value: totalPenduduk,
      unit: 'Jiwa',
      icon: UsersIcon,
      accent: 'border-l-leaf-600',
      bgIcon: 'bg-leaf-50 text-leaf-600',
    },
    {
      id: 'laki',
      label: 'Laki-Laki',
      value: lakiLaki,
      unit: 'Jiwa',
      icon: MaleIcon,
      accent: 'border-l-leaf-500',
      bgIcon: 'bg-leaf-50 text-leaf-600',
    },
    {
      id: 'perempuan',
      label: 'Perempuan',
      value: perempuan,
      unit: 'Jiwa',
      icon: FemaleIcon,
      accent: 'border-l-leaf-400',
      bgIcon: 'bg-leaf-50 text-leaf-500',
    },
    {
      id: 'kk',
      label: 'Jumlah KK',
      value: jumlahKK,
      unit: 'KK',
      icon: HomeIcon,
      accent: 'border-l-leaf-600',
      bgIcon: 'bg-leaf-50 text-leaf-600',
    },
    {
      id: 'rumah',
      label: 'Jumlah Rumah',
      value: jumlahRumah,
      unit: 'Unit',
      icon: BuildingIcon,
      accent: 'border-l-leaf-400',
      bgIcon: 'bg-leaf-50 text-leaf-600',
    },
  ];

  return (
    <section id="statistik" className="py-16 md:py-24 bg-warm-50 border-b border-warm-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs text-leaf-600 font-medium uppercase tracking-widest mb-2">
            Data Kependudukan
          </p>
          <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900 mb-2">
            Statistik Kaliwiru
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed font-light">
            Ringkasan data demografi, jumlah kepala keluarga, bangunan tempat tinggal, serta rincian statistik kependudukan per RT di Padukuhan Kaliwiru.
          </p>
        </div>

        {/* Ringkasan Cards (5 Kolom di Layar Besar) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-white rounded-xl p-5 border border-warm-200 border-l-[4px] ${card.accent} shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {card.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${card.bgIcon} flex items-center justify-center`}>
                    <Icon />
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-leaf-900 tracking-tight tabular-nums">
                    {card.value.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    {card.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel / Rincian Statistik Per RT */}
        {rtData.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-leaf-50/60 border-b border-warm-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-leaf-900">
                  Rincian Statistik Kependudukan per RT
                </h3>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Distribusi kepala keluarga, bangunan rumah, dan penduduk berdasarkan wilayah RT.
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-leaf-100 text-leaf-700">
                {rtData.length} RT Terdata
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warm-200 bg-warm-50/60 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Wilayah RT</th>
                    <th className="py-3.5 px-6 text-center">Jumlah KK</th>
                    <th className="py-3.5 px-6 text-center">Jumlah Rumah</th>
                    <th className="py-3.5 px-6 text-center">Laki-Laki</th>
                    <th className="py-3.5 px-6 text-center">Perempuan</th>
                    <th className="py-3.5 px-6 text-center font-bold text-leaf-900">Total Penduduk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100 text-sm text-gray-700">
                  {rtData.map((item, idx) => {
                    const rowTotal = (item.lakiLaki || 0) + (item.perempuan || 0);
                    return (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-leaf-50/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-leaf-500" />
                            {item.rt}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-medium tabular-nums">
                          {item.kk ? `${item.kk} KK` : '-'}
                        </td>
                        <td className="py-4 px-6 text-center font-medium tabular-nums">
                          {item.rumah ? `${item.rumah} Rumah` : '-'}
                        </td>
                        <td className="py-4 px-6 text-center font-medium tabular-nums">
                          {item.lakiLaki ? `${item.lakiLaki} Jiwa` : '-'}
                        </td>
                        <td className="py-4 px-6 text-center font-medium tabular-nums">
                          {item.perempuan ? `${item.perempuan} Jiwa` : '-'}
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-leaf-700 tabular-nums">
                          {rowTotal > 0 ? `${rowTotal} Jiwa` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-warm-100">
              {rtData.map((item, idx) => {
                const rowTotal = (item.lakiLaki || 0) + (item.perempuan || 0);
                return (
                  <div key={item.id || idx} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-leaf-900 text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-leaf-500" />
                        {item.rt}
                      </span>
                      {rowTotal > 0 && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-leaf-100 text-leaf-700">
                          Total: {rowTotal} Jiwa
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                      <div className="bg-warm-50 p-2.5 rounded-lg border border-warm-100">
                        <span className="text-gray-400 block mb-0.5">Kepala Keluarga</span>
                        <span className="font-semibold text-gray-800 text-sm">{item.kk ? `${item.kk} KK` : '-'}</span>
                      </div>
                      <div className="bg-warm-50 p-2.5 rounded-lg border border-warm-100">
                        <span className="text-gray-400 block mb-0.5">Jumlah Rumah</span>
                        <span className="font-semibold text-gray-800 text-sm">{item.rumah ? `${item.rumah} Unit` : '-'}</span>
                      </div>
                      <div className="bg-warm-50 p-2.5 rounded-lg border border-warm-100">
                        <span className="text-gray-400 block mb-0.5">Laki-Laki</span>
                        <span className="font-semibold text-gray-800 text-sm">{item.lakiLaki ? `${item.lakiLaki} Jiwa` : '-'}</span>
                      </div>
                      <div className="bg-warm-50 p-2.5 rounded-lg border border-warm-100">
                        <span className="text-gray-400 block mb-0.5">Perempuan</span>
                        <span className="font-semibold text-gray-800 text-sm">{item.perempuan ? `${item.perempuan} Jiwa` : '-'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
