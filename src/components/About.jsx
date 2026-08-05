import { useSiteData } from '../context/SiteDataContext';

export default function About() {
  const { about } = useSiteData();

  if (!about) return null;

  return (
    <section id="tentang" className="py-16 md:py-20 bg-warm-50 border-b border-warm-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl mb-10">
          <p className="text-xs text-leaf-600 font-medium uppercase tracking-widest mb-2">
            {about.subtitle}
          </p>
          <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900">
            {about.title}
          </h2>
        </div>

        {/* Content: Left (Image + Sejarah + Visi) | Right (Misi) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column — 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-warm-200 aspect-[16/9]">
              <img
                src={about.image || '/images/iconKaliwiru.jpeg'}
                alt={about.title}
                className="w-full h-full object-cover object-[center_70%]"
              />
            </div>

            {/* Sejarah */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Sejarah Singkat</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                {about.sejarah}
              </p>
            </div>

            {/* Visi — compact accent card */}
            <div className="bg-leaf-50 border border-leaf-200 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-leaf-700 uppercase tracking-wider mb-2">
                Visi
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
                "{about.visi}"
              </p>
            </div>
          </div>

          {/* Right Column — 5 cols: Misi */}
          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-warm-200 shadow-sm">
            <h3 className="text-xs font-semibold text-leaf-700 uppercase tracking-wider mb-4">
              Misi
            </h3>
            <ul className="space-y-3">
              {about.misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-leaf-50 text-leaf-600 flex items-center justify-center text-[11px] font-semibold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
