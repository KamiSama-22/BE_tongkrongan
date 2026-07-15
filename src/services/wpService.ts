import { getRawData } from "./helpers/spkHelper";

interface Bobot {
  harga: number;
  jamOperasional: number;
  menu: number;
  fasilitas: number;
  rating: number;
  kebersihan: number;
}

class WPService {
  async calculate(bobot: Bobot, tenantId: number) {
    console.trace("WPService.calculate dipanggil dari:");
    const rawData = await getRawData();
    if (!rawData || rawData.length === 0) throw new Error("Data tidak ditemukan.");

    // 1. KEPENTINGAN (Input dibagi 5) & JUMLAHNYA
    const kepentingan = {
      harga: Number(bobot.harga) / 5,
      jam: Number(bobot.jamOperasional) / 5,
      menu: Number(bobot.menu) / 5,
      fas: Number(bobot.fasilitas) / 5,
      rating: Number(bobot.rating) / 5,
      keb: Number(bobot.kebersihan) / 5
    };
    const totalKepentingan = Object.values(kepentingan).reduce((a, b) => a + b, 0);

    const w = {
      harga: -(kepentingan.harga / totalKepentingan),
      jam: (kepentingan.jam / totalKepentingan),
      menu: (kepentingan.menu / totalKepentingan),
      fas: (kepentingan.fas / totalKepentingan),
      rating: (kepentingan.rating / totalKepentingan),
      keb: (kepentingan.keb / totalKepentingan)
    };

    // 3. DATA MENTAH
    const rawDataFormatted = rawData.map((r: any) => ({
      nama: r.nama,
      harga: Number(r.harga),
      jam: Number(r.jamOperasional),
      menu: Number(r.menu),
      fas: Number(r.fasilitas),
      rating: Number(r.rating),
      keb: Number(r.kebersihan)
    }));

    // 4. PANGKAT (X^W)
    const pangkatData = rawDataFormatted.map((r: any) => ({
      nama: r.nama,
      harga: Math.pow(r.harga || 1, w.harga),
      jam: Math.pow(r.jam || 1, w.jam),
      menu: Math.pow(r.menu || 1, w.menu),
      fas: Math.pow(r.fas || 1, w.fas),
      rating: Math.pow(r.rating || 1, w.rating),
      keb: Math.pow(r.keb || 1, w.keb)
    }));

    // 5. NILAI S + JUMLAH S
    const sValues = pangkatData.map((r: any) => ({
      nama: r.nama,
      s: r.harga * r.jam * r.menu * r.fas * r.rating * r.keb
    }));
    const totalS = sValues.reduce((a, b) => a + b.s, 0);

    // 6. NILAI V (S / Total S)
    const vValues = sValues.map(r => ({
      nama: r.nama,
      v: r.s / totalS
    }));

    // 7. RANGKING
    const ranking = [...vValues]
      .map(r => ({ nama: r.nama, skor: r.v }))
      .sort((a, b) => b.skor - a.skor);

    // Return Data dengan Struktur yang Teratur
    return {
      name: "WP",
      steps: [
        { 
          // Step 0 (Index 0): Kepentingan
          data: [kepentingan], 
          total: totalKepentingan 
        },
        { 
          // Step 1 (Index 1): Bobot W
          data: [w] 
        },
        { 
          // Step 2 (Index 2): Data Mentah
          data: rawDataFormatted 
        },
        { 
          // Step 3 (Index 3): Pangkat
          data: pangkatData 
        },
        { 
          // Step 4 (Index 4): Nilai S
          data: sValues, 
          totalS: totalS 
        },
        { 
          // Step 5 (Index 5): Nilai V
          data: vValues 
        },
        { 
          // Step 6 (Index 6): Ranking
          data: ranking 
        }
      ]
    };
  }
}

export default new WPService();