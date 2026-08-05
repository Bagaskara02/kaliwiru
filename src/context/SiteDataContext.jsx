import { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import { API_CONFIG } from '../data/apiConfig';

const SiteDataContext = createContext(null);

/* ═══════════════════════════════════════════════════════════
   Google Sheets Response Parser
   ═══════════════════════════════════════════════════════════
   Google Sheets gviz/tq mengembalikan format JSONP:
   google.visualization.Query.setResponse({...});

   Parser ini menangani kasus-kasus khusus:
   1. parsedNumHeaders=0 → baris pertama = header, bukan data
   2. Kolom bertipe number (misal WhatsApp) → pakai formatted value
   3. Cell null → default ke empty string
   ═══════════════════════════════════════════════════════════ */
function parseGoogleSheetsResponse(text) {
  // Extract JSON dari wrapper JSONP
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(({.*})\)/s
  );
  if (!match) {
    throw new Error('Format response Google Sheets tidak valid');
  }

  const json = JSON.parse(match[1]);
  const table = json.table;

  // ── Tentukan nama kolom (header) ──
  // Cek apakah Google Sheets mendeteksi header otomatis
  const hasAutoHeaders = table.cols.some((col) => col.label && col.label.trim() !== '');

  let cols;
  let dataRows;

  if (hasAutoHeaders) {
    // Google mendeteksi header → ambil dari cols.label
    cols = table.cols.map((col) => col.label || '');
    dataRows = table.rows;
  } else {
    // parsedNumHeaders=0 → baris pertama adalah header
    // Ambil nama kolom dari row pertama
    cols = table.rows[0].c.map((cell) =>
      cell ? String(cell.v || '') : ''
    );
    dataRows = table.rows.slice(1); // Skip baris header
  }

  // ── Konversi setiap baris menjadi object { NamaKolom: nilai } ──
  return dataRows
    .map((row) => {
      const obj = {};
      row.c.forEach((cell, i) => {
        if (!cols[i]) return;

        if (!cell || cell.v == null) {
          obj[cols[i]] = '';
          return;
        }

        // Gunakan formatted value (f) jika ada, agar angka seperti
        // nomor WhatsApp (6.285E12) tetap tampil benar ("6285158424337")
        if (cell.f != null) {
          obj[cols[i]] = String(cell.f);
        } else {
          obj[cols[i]] = cell.v;
        }
      });
      return obj;
    })
    .filter((row) => {
      // Filter baris kosong (semua value empty string)
      return Object.values(row).some((v) => v !== '');
    });
}

/* ═══════════════════════════════════════════════════════════
   localStorage Cache — Mengurangi fetch & mempercepat load
   ═══════════════════════════════════════════════════════════ */
const CACHE_PREFIX = 'padukuhan_data_';
const CACHE_DURATION = 0; // 0 menit (langsung update saat di-refresh)

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null; // Cache expired
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // localStorage penuh atau tidak tersedia — abaikan
  }
}

/**
 * Mengubah URL Google Drive sharing menjadi URL gambar langsung.
 *
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 *
 * Jika bukan URL Google Drive, dikembalikan apa adanya.
 */
function toDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Pattern: drive.google.com/file/d/{FILE_ID}/...
  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Pattern: drive.google.com/open?id={FILE_ID}
  const openMatch = url.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
  );
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }

  return url;
}

/* ═══════════════════════════════════════════════════════════
   Mapper: row → format yang dipakai komponen
   ═══════════════════════════════════════════════════════════
   Satu sheet "Potensi Kaliwiru" berisi semua data.
   Kolom "Section" menentukan kategori:
   - "Fasilitas Umum"         → untuk komponen Fasilitas
   - "Direktori UMKM"         → untuk komponen UMKMDirectory
   - "Kebudayaan dan Kesenian" → untuk komponen Kebudayaan
   ═══════════════════════════════════════════════════════════ */

/* ── Helper pendeteksi section ── */
function detectSection(val) {
  const s = String(val || '').toLowerCase();
  if (s.includes('fasilitas')) return 'fasilitas';
  if (s.includes('umkm')) return 'umkm';
  if (s.includes('budaya') || s.includes('seni')) return 'kebudayaan';
  return null; // fallback
}

/* ── Mapper: row → format UMKM app ── */
function mapUmkmRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    image: toDirectImageUrl(rawImage),
    qris: String(row['QRIS'] || row['qris'] || '').toLowerCase() === 'ya',
    whatsapp: String(row['WhatsApp'] || row['whatsapp'] || ''),
    category: row['Kategori'] || row['kategori'] || 'Lainnya',
    gmaps: row['Gmaps'] || row['gmaps'] || null,
  };
}

/* ── Helper angka aman ── */
function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = String(val).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/* ── Mapper: rows → format statistik demografi app (Total & per RT) ── */
function mapStatsRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const rtList = [];
  let sumKK = 0;
  let sumRumah = 0;
  let sumLaki = 0;
  let sumPerempuan = 0;
  let sumTotal = 0;

  // Cek apakah ada format per RT
  const hasRT = rows.some((r) => {
    const keys = Object.keys(r);
    return (
      keys.some((k) => /rt|wilayah/i.test(k)) ||
      /rt\s*\d+/i.test(String(r['Label'] || r['Nama'] || r['RT'] || ''))
    );
  });

  if (hasRT) {
    rows.forEach((row, idx) => {
      const rtName =
        row['RT'] ||
        row['rt'] ||
        row['Nama RT'] ||
        row['Wilayah'] ||
        row['wilayah'] ||
        row['Nama'] ||
        row['nama'] ||
        row['Label'] ||
        `RT ${idx + 1}`;

      const kk = parseNum(
        row['Jumlah KK'] ||
          row['KK'] ||
          row['kk'] ||
          row['Kepala Keluarga'] ||
          row['jumlah kk']
      );
      const rumah = parseNum(
        row['Jumlah Rumah'] ||
          row['Rumah'] ||
          row['rumah'] ||
          row['jumlah rumah']
      );
      const laki = parseNum(
        row['Laki Laki'] ||
          row['Laki-laki'] ||
          row['Laki-Laki'] ||
          row['laki-laki'] ||
          row['Pria'] ||
          row['pria'] ||
          row['Laki']
      );
      const perempuan = parseNum(
        row['Perempuan'] ||
          row['perempuan'] ||
          row['Wanita'] ||
          row['wanita']
      );
      
      // Total selalu dihitung otomatis dari laki-laki + perempuan
      const total = laki + perempuan;

      // Hindari baris ringkasan / total eksplisit masuk ke list RT agar tidak dihitung ganda
      if (
        /total|jumlah|rekap|padukuhan/i.test(String(rtName)) &&
        !/rt\s*\d+/i.test(String(rtName))
      ) {
        if (laki) sumLaki = laki;
        if (perempuan) sumPerempuan = perempuan;
        if (kk) sumKK = kk;
        if (rumah) sumRumah = rumah;
        return;
      }

      // Validasi baris: harus memiliki minimal salah satu data
      if (kk > 0 || rumah > 0 || laki > 0 || perempuan > 0) {
        sumKK += kk;
        sumRumah += rumah;
        sumLaki += laki;
        sumPerempuan += perempuan;
        sumTotal += total;

        rtList.push({
          id: idx + 1,
          rt: String(rtName).trim(),
          kk,
          rumah,
          lakiLaki: laki,
          perempuan,
          total, // dihitung otomatis: laki + perempuan
        });
      }
    });

    if (rtList.length > 0) {
      return {
        totalPenduduk: sumLaki + sumPerempuan, // total otomatis dari semua laki-laki + perempuan
        lakiLaki: sumLaki,
        perempuan: sumPerempuan,
        jumlahKK: sumKK,
        jumlahRumah: sumRumah,
        rt: rtList,
      };
    }
  }

  // Fallback: format Key-Value (Label & Nilai)
  let kkVal = 0,
    rumahVal = 0,
    lakiVal = 0,
    perempuanVal = 0,
    totalVal = 0;

  rows.forEach((r) => {
    const label = String(
      r['Label'] || r['label'] || r['Nama'] || r['Keterangan'] || ''
    ).toLowerCase();
    const val = parseNum(r['Nilai'] || r['nilai'] || r['Value'] || r['Jumlah'] || 0);

    if (label.includes('kk') || label.includes('kepala keluarga')) kkVal = val;
    else if (label.includes('rumah')) rumahVal = val;
    else if (label.includes('laki') || label.includes('pria')) lakiVal = val;
    else if (label.includes('perempuan') || label.includes('wanita')) perempuanVal = val;
    else if (label.includes('total') || label.includes('penduduk')) totalVal = val;
  });

  if (kkVal || rumahVal || lakiVal || perempuanVal || totalVal) {
    return {
      totalPenduduk: totalVal || (lakiVal + perempuanVal),
      lakiLaki: lakiVal,
      perempuan: perempuanVal,
      jumlahKK: kkVal,
      jumlahRumah: rumahVal,
      rt: [],
    };
  }

  return null;
}

/* ── Mapper: row → format fasilitas app ── */
function mapFasilitasRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || row['Nama Fasilitas'] || row['nama fasilitas'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    category: row['Kategori'] || row['kategori'] || 'Umum',
    gmaps: row['Gmaps'] || row['gmaps'] || row['Maps'] || row['maps'] || null,
    image: toDirectImageUrl(rawImage),
  };
}

/* ── Mapper: row → format kebudayaan app ── */
function mapKebudayaanRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || row['Nama Kesenian'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    category: row['Kategori'] || row['kategori'] || 'Lainnya',
    gmaps: row['Gmaps'] || row['gmaps'] || row['Maps'] || row['maps'] || null,
    image: toDirectImageUrl(rawImage),
  };
}

/**
 * Fetch data dari Google Sheets langsung.
 * Cek cache dulu → kalau ada & belum expired, pakai cache.
 * Kalau tidak ada / expired → fetch dari Google Sheets → simpan cache.
 */
async function fetchGoogleSheet(url, cacheKey) {
  // 1. Cek cache
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // 2. Fetch dari Google Sheets
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Sheets: HTTP ${res.status}`);

  const text = await res.text();
  const rows = parseGoogleSheetsResponse(text);

  // 3. Simpan ke cache
  setCache(cacheKey, rows);

  return rows;
}

/**
 * SiteDataProvider — React Context yang:
 * 1. Mulai dengan data statis dari siteData.js (instant, tanpa loading)
 * 2. Jika API URL dikonfigurasi di apiConfig.js → fetch & replace data
 * 3. Jika fetch gagal → tetap tampilkan data statis (fallback)
 */
export function SiteDataProvider({ children }) {
  const [data, setData] = useState(siteConfig);
  const [loading, setLoading] = useState(() =>
    Boolean(API_CONFIG.potensi || API_CONFIG.stats)
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tidak ada API URL? Langsung pakai data statis.
    if (!API_CONFIG.potensi && !API_CONFIG.stats) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const updates = {};

        // ── Fetch Potensi Kaliwiru (gabungan Fasilitas + UMKM + Kebudayaan) ──
        if (API_CONFIG.potensi) {
          try {
            const rows = await fetchGoogleSheet(API_CONFIG.potensi, 'potensi');
            if (Array.isArray(rows) && rows.length > 0) {
              // Pisahkan berdasarkan kolom "Section"
              const fasilitasRows = [];
              const umkmRows = [];
              const kebudayaanRows = [];

              rows.forEach((row) => {
                const section = detectSection(row['Section'] || row['section']);
                switch (section) {
                  case 'fasilitas':
                    fasilitasRows.push(row);
                    break;
                  case 'umkm':
                    umkmRows.push(row);
                    break;
                  case 'kebudayaan':
                    kebudayaanRows.push(row);
                    break;
                  default:
                    // Jika kosong/tidak match, bisa default ke UMKM jika ada kolom QRIS
                    if (row['QRIS'] !== undefined) {
                      umkmRows.push(row);
                    }
                    break;
                }
              });

              if (fasilitasRows.length > 0) {
                updates.fasilitas = fasilitasRows.map(mapFasilitasRow);
              }
              if (umkmRows.length > 0) {
                updates.umkm = umkmRows.map(mapUmkmRow);
              }
              if (kebudayaanRows.length > 0) {
                updates.kebudayaan = kebudayaanRows.map(mapKebudayaanRow);
              }
            }
          } catch (err) {
            console.warn('⚠️ Gagal memuat Potensi dari Google Sheets:', err);
          }
        }

        // ── Fetch Statistik Kaliwiru dari Google Sheets ──
        if (API_CONFIG.stats) {
          try {
            const statsRows = await fetchGoogleSheet(API_CONFIG.stats, 'stats');
            if (Array.isArray(statsRows) && statsRows.length > 0) {
              const parsedStats = mapStatsRows(statsRows);
              if (
                parsedStats &&
                (parsedStats.totalPenduduk > 0 ||
                  parsedStats.jumlahKK > 0 ||
                  (parsedStats.rt && parsedStats.rt.length > 0))
              ) {
                updates.stats = parsedStats;
              }
            }
          } catch (err) {
            console.warn('⚠️ Gagal memuat Statistik dari Google Sheets:', err);
          }
        }

        if (!cancelled) {
          setData((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error('⚠️ Gagal memuat data dari Google Sheets:', err);
        if (!cancelled) setError(err.message);
        // Data statis dari siteData.js tetap tampil sebagai fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ ...data, loading, error }}>
      {children}
    </SiteDataContext.Provider>
  );
}

/**
 * Hook untuk mengakses data site dari context.
 * Gunakan di semua komponen yang butuh data:
 *
 *   const { umkm, stats, loading } = useSiteData();
 */
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData() harus digunakan di dalam <SiteDataProvider>');
  }
  return ctx;
}
