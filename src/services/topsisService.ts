import { getRawData } from "./helpers/spkHelper";

class TOPSISService {
  async calculate(bobot: any, tenantId: number) {
    const rawData = await getRawData();
    if (!rawData || rawData.length === 0) throw new Error("Data tidak ditemukan.");

    // KONVERSI BOBOT: Input 35 jadi 7 (bagi 5)
    const k = {
      harga: Number(bobot.harga) / 5,
      jam: Number(bobot.jamOperasional) / 5,
      menu: Number(bobot.menu) / 5,
      fas: Number(bobot.fasilitas) / 5,
      rating: Number(bobot.rating) / 5,
      keb: Number(bobot.kebersihan) / 5
    };

    const criteria = [
      { key: 'harga', type: 'cost', label: 'Harga', w: k.harga },
      { key: 'jamOperasional', type: 'benefit', label: 'Jam', w: k.jam },
      { key: 'menu', type: 'benefit', label: 'Menu', w: k.menu },
      { key: 'fasilitas', type: 'benefit', label: 'Fasilitas', w: k.fas },
      { key: 'rating', type: 'benefit', label: 'Rating', w: k.rating },
      { key: 'kebersihan', type: 'benefit', label: 'Kebersihan', w: k.keb }
    ];

    const headers = ["Alternatif", "Harga", "Jam", "Menu", "Fasilitas", "Rating", "Kebersihan"];

    // 0. DATA MENTAH
    const rawDataFormatted = rawData.map((r: any) => ({
      nama: r.nama,
      harga: Number(r.harga),
      jam: Number(r.jamOperasional),
      menu: Number(r.menu),
      fas: Number(r.fasilitas),
      rating: Number(r.rating),
      keb: Number(r.kebersihan)
    }));

    // 1. HITUNG PEMBAGI (Akar Kuadrat)
    const divisors: any = {};
    criteria.forEach(c => {
      let sumSq = 0;
      rawData.forEach((r: any) => sumSq += Math.pow(Number(r[c.key]) || 0, 2));
      divisors[c.label] = Math.sqrt(sumSq) || 1;
    });

    // 2. NORMALISASI (R)
    const step1Data = rawData.map((r: any) => {
      const row: any = { nama: r.nama };
      criteria.forEach(c => {
        row[c.key] = (Number(r[c.key]) || 0) / divisors[c.label];
      });
      return row;
    });

    // 3. MATRIKS TERBOBOT (V)
    const step2Data = step1Data.map((r: any) => {
      const row: any = { nama: r.nama };
      criteria.forEach(c => {
        row[c.key] = r[c.key] * c.w;
      });
      return row;
    });

    // 4. SOLUSI IDEAL
    const apos: any = {};
    const aneg: any = {};
    criteria.forEach(c => {
      const vals = step2Data.map((r: any) => r[c.key]);
      apos[c.label] = c.type === 'benefit' ? Math.max(...vals) : Math.min(...vals);
      aneg[c.label] = c.type === 'benefit' ? Math.min(...vals) : Math.max(...vals);
    });

    // 5. JARAK & PERANGKINGAN
    const step4Data = step2Data.map((r: any) => {
      let dPlusSq = 0, dMinusSq = 0;
      criteria.forEach(c => {
        dPlusSq += Math.pow(r[c.key] - apos[c.label], 2);
        dMinusSq += Math.pow(r[c.key] - aneg[c.label], 2);
      });
      const dPlus = Math.sqrt(dPlusSq);
      const dMinus = Math.sqrt(dMinusSq);
      return { 
        nama: r.nama, 
        dPlus: parseFloat(dPlus.toFixed(6)), 
        dMinus: parseFloat(dMinus.toFixed(6)), 
        score: isNaN(dMinus / (dPlus + dMinus)) ? 0 : parseFloat((dMinus / (dPlus + dMinus)).toFixed(6)) 
      };
    }).sort((a: any, b: any) => b.score - a.score);

    return {
      name: "TOPSIS",
      bobot: k, // Mengirim bobot yang sudah dikonversi
      steps: [
        { title: "Data Mentah", headers, data: rawDataFormatted },
        { title: "Nilai Pembagi", data: [divisors] },
        { title: "Matriks Ternormalisasi (R)", headers, data: step1Data },
        { title: "Matriks Terbobot (V)", headers, data: step2Data },
        { title: "Solusi Ideal", data: { apos, aneg } },
        { title: "Perangkingan", data: step4Data }
      ]
    };
  }
}
export default new TOPSISService();