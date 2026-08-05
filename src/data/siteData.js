/**
 * Data konten website Padukuhan Kaliwiru.
 *
 * Struktur ini dirancang agar mudah di-replace dengan fetch() dari API eksternal.
 * Cukup ganti isi variabel atau ubah menjadi async fetch tanpa mengubah komponen.
 *
 * Contoh migrasi ke API:
 *   const res = await fetch('/api/site-config');
 *   export const siteConfig = await res.json();
 */

export const siteConfig = {
  /* ─── Info Padukuhan ─── */
  padukuhan: {
    name: 'Kaliwiru',
    desa: 'Tuksono',
    kecamatan: 'Sentolo',
    kabupaten: 'Kulon Progo',
    provinsi: 'Daerah Istimewa Yogyakarta',
  },

  /* ─── Hero Section ─── */
  hero: {
    title: 'Selamat Datang di Padukuhan Kaliwiru',
    subtitle:
      'Portal informasi resmi Padukuhan Kaliwiru, Desa Tuksono, Kecamatan Sentolo, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta. Temukan potensi desa, produk UMKM unggulan, dan informasi layanan masyarakat.',
    ctaText: 'Jelajahi Potensi',
    backgroundImage: null, // Ganti dengan path: '/images/hero.jpg'
  },

  /* ─── Statistik Demografi ─── */
  stats: {
    totalPenduduk: 487,
    lakiLaki: 252,
    perempuan: 235,
    jumlahKK: 166,
    jumlahRumah: 140,
    rt: [
      {
        rt: 'RT 17',
        kk: 79,
        rumah: 70,
        lakiLaki: 123,
        perempuan: 122,
        total: 245,
      },
      {
        rt: 'RT 18',
        kk: 87,
        rumah: 70,
        lakiLaki: 129,
        perempuan: 113,
        total: 242,
      },
    ],
  },

  /* ─── Direktori UMKM ─── */
  umkm: [
    {
      id: 1,
      name: 'Keripik Tempe Bu Sari',
      description:
        'Keripik tempe renyah dengan bumbu rempah khas Jawa yang gurih dan nikmat. Tersedia berbagai varian rasa.',
      image: null, // Ganti: '/images/umkm/keripik-tempe.jpg'
      qris: true,
      whatsapp: '6281234567890',
      category: 'Makanan',
      gmaps: null, // Ganti: 'https://maps.app.goo.gl/...'
    },
    {
      id: 2,
      name: 'Batik Tulis Kaliwiru',
      description:
        'Batik tulis tradisional dengan motif khas Kulon Progo, dibuat secara handmade oleh pengrajin lokal.',
      image: null,
      qris: true,
      whatsapp: '6281234567891',
      category: 'Kerajinan',
    },
    {
      id: 3,
      name: 'Madu Hutan Sentolo',
      description:
        'Madu murni dari lebah hutan lokal, kaya manfaat untuk kesehatan dan dikemas secara higienis.',
      image: null,
      qris: false,
      whatsapp: '6281234567892',
      category: 'Pertanian',
    },
    {
      id: 4,
      name: 'Anyaman Bambu Pak Joko',
      description:
        'Produk anyaman bambu berkualitas untuk kebutuhan rumah tangga dan dekorasi interior.',
      image: null,
      qris: true,
      whatsapp: '6281234567893',
      category: 'Kerajinan',
    },
    {
      id: 5,
      name: 'Kopi Robusta Kaliwiru',
      description:
        'Kopi robusta pilihan dari kebun lokal, dipanggang sempurna untuk cita rasa premium.',
      image: null,
      qris: true,
      whatsapp: '6281234567894',
      category: 'Minuman',
    },
    {
      id: 6,
      name: 'Gula Kelapa Organik',
      description:
        'Gula kelapa organik tanpa bahan pengawet, cocok untuk gaya hidup sehat dan masakan tradisional.',
      image: null,
      qris: false,
      whatsapp: '6281234567895',
      category: 'Pertanian',
    },
  ],

  /* ─── Perangkat / Pimpinan ─── */
  leadership: [
    {
      name: '—', // Ganti dengan nama asli
      position: 'Kepala Padukuhan',
      phone: '6281234567800',
    },
  ],

  /* ─── Kontak ─── */
  contact: {
    address:
      'Padukuhan Kaliwiru, Desa Tuksono, Kec. Sentolo, Kab. Kulon Progo, Daerah Istimewa Yogyakarta',
  },

  /* ─── Peta ─── */
  map: {
    administrasi: {
      title: 'Peta Administrasi',
      description: 'Peta administrasi wilayah Padukuhan Kaliwiru',
      image: '/images/peta-administrasi.jpeg',
    },
    saka: {
      title: 'Peta Persebaran Potensi Ekonomi & Wisata Lokal',
      description: 'Peta persebaran potensi ekonomi dan wisata lokal Padukuhan Kaliwiru.',
      embedUrl: null,
      image: '/images/saka.jpg',
    },
    airTanah: {
      title: 'Peta Kualitas Air Tanah',
      description: 'Pemetaan kualitas air tanah Padukuhan Kaliwiru.',
      embedUrl: null,
      image: '/images/air-tanah.jpg',
    },
    kesehatan: {
      title: 'Peta Profil Kesehatan',
      description: 'Peta profil kesehatan Padukuhan Kaliwiru.',
      embedUrl: null,
      image: '/images/Peta Profil Kesehatan.jpeg',
    },
  },

  /* ─── Tentang Kami ─── */
  about: {
    title: 'Profil Padukuhan',
    subtitle: 'Sejarah, Visi & Misi Padukuhan Kaliwiru',
    sejarah: 'Padukuhan Kaliwiru merupakan salah satu wilayah yang masyarakatnya terus menjaga identitas budaya dan tradisi. Wilayah ini memiliki potensi pertanian, industri lokal dan UMKM yang terus berkembang, serta berkomitmen untuk melestarikan nilai-nilai gotong royong.',
    visi: 'Bersama masyarakat kita wujudkan Desa Tuksono yang bersih, jujur, amanah demi tercapainya masyarakat yang religius, adil, makmur dan berkepribadian yang luhur.',
    misi: [
      'Memperkokoh persatuan dan kerukunan antar warga Desa Tuksono tanpa memandang agama, status sosial, golongan dan mengusahakan peningkatan kesejahteraan kegiatan keagamaan.',
      'Memberdayakan semua elemen masyarakat dalam proses pembangunan mulai perencanaan, pelaksanaan, dan pengawasan sebagai upaya mewujudkan pembangunan yang berkualitas, transparan dan dapat dipertanggungjawabkan.',
      'Memaksimalkan kinerja perangkat desa sesuai tugas pokok dan fungsi demi tercapainya pelayanan kepada masyarakat yang prima.',
      'Melestarikan adat tradisi, seni, dan budaya yang sudah ada di masyarakat untuk mewujudkan jati diri Tuksono sebagai Desa Budaya.',
      'Membina, mengembangkan, dan selalu koordinasi untuk memfungsikan LPMD, PKK, Karang Taruna, FKPM, dan lembaga kemasyarakatan lainnya demi tercapainya suasana yang aman, tentram, damai, dan nyaman di kalangan masyarakat.',
      'Membina dan memfungsikan generasi muda melalui karang taruna sebagai tulang punggung desa yang memiliki budi pekerti yang luhur dan mandiri dalam menyikapi Tuksono sebagai kawasan industri sehingga warga Tuksono bisa menjadi pelaku bukan hanya jadi penonton.',
      'Mencermati ulang bantuan bagi masyarakat kurang mampu, kaum difabel dan lansia agar tidak salah sasaran.'
    ],
    image: '/images/iconKaliwiru.jpeg',
  },

  /* ─── Fasilitas ─── */
  fasilitas: [],

  /* ─── Kebudayaan ─── */
  kebudayaan: [],
};
