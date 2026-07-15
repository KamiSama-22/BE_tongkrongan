import { getRawData } from "./helpers/spkHelper";

interface Bobot {
  harga: number;
  jamOperasional: number;
  menu: number;
  fasilitas: number;
  rating: number;
  kebersihan: number;
}

class SAWService {
  async calculate(bobot: Bobot, tenantId: number) {
    const rawData = await getRawData() || [];
    
    // Pastikan bobot default ada jika dari frontend kosong
    const safeBobot = (bobot && typeof bobot === 'object') 
      ? bobot 
      : { harga: 0, jamOperasional: 0, menu: 0, fasilitas: 0, rating: 0, kebersihan: 0 };

    const validData = Array.isArray(rawData) ? rawData.filter(item => item) : [];
    if (validData.length === 0) throw new Error("Data tidak ditemukan.");

    // 1. BERSINKAN DATA MENTAH
    const cleanData = validData.map(r => ({
      nama: r.nama || "Unknown",
      harga: Number(r.harga) || 1,
      jam: Number(r.jamOperasional) || 0,
      menu: Number(r.menu) || 0,
      fas: Number(r.fasilitas) || 0,
      rating: Number(r.rating) || 0,
      keb: Number(r.kebersihan) || 0
    }));

    // --- PERBAIKAN FATAL: CARI NILAI MAX DINAMIS DARI DATA AKTUAL ---
    // Menggunakan Math.max untuk mencari angka terbesar di kolom tersebut
    const maxHarga = Math.min(...cleanData.map(r => r.harga), 1);
    const maxJam = Math.max(...cleanData.map(r => r.jam), 1);
    const maxMenu = Math.max(...cleanData.map(r => r.menu), 1);
    const maxFas = Math.max(...cleanData.map(r => r.fas), 1);
    const maxRating = Math.max(...cleanData.map(r => r.rating), 1);
    const maxKeb = Math.max(...cleanData.map(r => r.keb), 1);

    // 2. NORMALISASI (Rumus Benefit: Nilai / Nilai Max)
    const normalized = cleanData.map(r => ({
      nama: r.nama,
      harga: parseFloat((maxHarga / r.harga).toFixed(3)),
      jam: parseFloat((r.jam / maxJam).toFixed(3)),
      menu: parseFloat((r.menu / maxMenu).toFixed(3)),
      fas: parseFloat((r.fas / maxFas).toFixed(3)),
      rating: parseFloat((r.rating / maxRating).toFixed(3)),
      keb: parseFloat((r.keb / maxKeb).toFixed(3))
    }));

    // 3. PREFERENSI (Normalisasi * Persentase Bobot)
    const preferensi = normalized.map(r => ({
      nama: r.nama,
      harga: parseFloat((r.harga * ((safeBobot.harga || 0) / 100)).toFixed(4)),
      jam: parseFloat((r.jam * ((safeBobot.jamOperasional || 0) / 100)).toFixed(4)),
      menu: parseFloat((r.menu * ((safeBobot.menu || 0) / 100)).toFixed(4)),
      fas: parseFloat((r.fas * ((safeBobot.fasilitas || 0) / 100)).toFixed(4)),
      rating: parseFloat((r.rating * ((safeBobot.rating || 0) / 100)).toFixed(4)),
      keb: parseFloat((r.keb * ((safeBobot.kebersihan || 0) / 100)).toFixed(4))
    }));

    // 4. PERANGKINGAN (Sum dari Preferensi)
    const ranking = preferensi.map(r => ({
      nama: r.nama,
      score: parseFloat((r.harga + r.jam + r.menu + r.fas + r.rating + r.keb).toFixed(4))
    })).sort((a, b) => b.score - a.score);

    // 5. RETURN 4 TAHAP KE FRONTEND
    return {
      name: "SAW",
      bobot: safeBobot, // WAJIB DIKIRIM AGAR TAMPIL DI FRONTEND
      steps: [
        { 
          title: "Matriks Keputusan", 
          headers: ["Nama", "Harga", "Jam", "Menu", "Fasilitas", "Rating", "Kebersihan"], 
          data: cleanData 
        },
        { 
          title: "Normalisasi (R)", 
          headers: ["Nama", "Harga", "Jam", "Menu", "Fasilitas", "Rating", "Kebersihan"], 
          data: normalized 
        },
        { 
          title: "Matriks Preferensi (V)", // TABEL BARU
          headers: ["Nama", "Harga", "Jam", "Menu", "Fasilitas", "Rating", "Kebersihan"], 
          data: preferensi 
        },
        { 
          title: "Perangkingan", 
          headers: ["Nama", "Skor Akhir"], 
          data: ranking 
        }
      ]
    };
  }
}

export default new SAWService();