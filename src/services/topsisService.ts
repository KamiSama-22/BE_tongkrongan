import spkHelper from "./helpers/spkHelper";

class TopsisService {
  async calculate(bobot: Record<number, number>) {

    const { tenants, kategori } = await spkHelper.getData();

    // ==========================
    // STEP 1 - Matriks Keputusan
    // ==========================

    const matriksKeputusan = tenants.map((tenant) => ({
      tenantId: tenant.id,
      nama: tenant.nama,
      nilai: tenant.nilaiKategori.map((item) => ({
        kategoriId: item.kategoriId,
        kategori: item.kategori.nama,
        nilai: item.nilai,
      })),
    }));

    // ==========================
    // STEP 2 - Atribut
    // ==========================

    const atribut: Record<number, "BENEFIT" | "COST"> = {
      1: "COST",
      2: "BENEFIT",
      3: "BENEFIT",
      4: "BENEFIT",
      5: "BENEFIT",
      6: "BENEFIT",
    };

    // ==========================
    // STEP 3 - Penyebut Normalisasi
    // ==========================

    const penyebut: Record<number, number> = {};

    for (const k of kategori) {

      const jumlahKuadrat = tenants
        .flatMap((t) => t.nilaiKategori)
        .filter((x) => x.kategoriId === k.id)
        .reduce((total, item) => total + Math.pow(item.nilai, 2), 0);

      penyebut[k.id] = Math.sqrt(jumlahKuadrat);
    }

    // ==========================
    // STEP 4 - Normalisasi
    // ==========================

    const normalisasi = matriksKeputusan.map((tenant) => ({

      tenantId: tenant.tenantId,

      nama: tenant.nama,

      nilai: tenant.nilai.map((item) => {

        const hasil = item.nilai / penyebut[item.kategoriId];

        return {

          kategoriId: item.kategoriId,

          kategori: item.kategori,

          nilai: Number(hasil.toFixed(4))

        };

      })

    }));

    // ==========================
    // STEP 5 - Normalisasi Berbobot
    // ==========================

    const totalBobot = Object.values(bobot).reduce(
      (a, b) => a + b,
      0
    );

    const bobotNormalisasi: Record<number, number> = {};

    for (const id in bobot) {
      bobotNormalisasi[Number(id)] =
        bobot[Number(id)] / totalBobot;
    }

    const normalisasiBerbobot = normalisasi.map((tenant) => ({

      tenantId: tenant.tenantId,

      nama: tenant.nama,

      nilai: tenant.nilai.map((item) => {

        const hasil =
          item.nilai *
          bobotNormalisasi[item.kategoriId];

        return {

          kategoriId: item.kategoriId,

          kategori: item.kategori,

          nilai: Number(hasil.toFixed(4))

        };

      })

    }));

    // ==========================
    // STEP 6 - Solusi Ideal
    // ==========================

    const solusiIdealPositif: Record<number, number> = {};
    const solusiIdealNegatif: Record<number, number> = {};

    for (const k of kategori) {
      const semuaNilai = normalisasiBerbobot
        .flatMap((t) => t.nilai)
        .filter((n) => n.kategoriId === k.id)
        .map((n) => n.nilai);

      if (atribut[k.id] === "BENEFIT") {
        solusiIdealPositif[k.id] = Math.max(...semuaNilai);
        solusiIdealNegatif[k.id] = Math.min(...semuaNilai);
      } else {
        solusiIdealPositif[k.id] = Math.min(...semuaNilai);
        solusiIdealNegatif[k.id] = Math.max(...semuaNilai);
      }
    }

    // ==========================
    // STEP 7 - Jarak Positif (D+)
    // ==========================

    const jarakPositif = normalisasiBerbobot.map((tenant) => {

      let total = 0;

      const detail = tenant.nilai.map((item) => {

        const selisih = Math.pow(
          item.nilai - solusiIdealPositif[item.kategoriId],
          2
        );

        total += selisih;

        return {
          kategoriId: item.kategoriId,
          kategori: item.kategori,
          nilai: item.nilai,
          ideal: solusiIdealPositif[item.kategoriId],
          selisih: Number(selisih.toFixed(6)),
        };
      });

      return {
        tenantId: tenant.tenantId,
        nama: tenant.nama,
        detail,
        total: Number(Math.sqrt(total).toFixed(6)),
      };
    });

    // ==========================
    // STEP 8 - Jarak Negatif (D-)
    // ==========================

    const jarakNegatif = normalisasiBerbobot.map((tenant) => {

      let total = 0;

      const detail = tenant.nilai.map((item) => {

        const selisih = Math.pow(
          item.nilai - solusiIdealNegatif[item.kategoriId],
          2
        );

        total += selisih;

        return {
          kategoriId: item.kategoriId,
          kategori: item.kategori,
          nilai: item.nilai,
          ideal: solusiIdealNegatif[item.kategoriId],
          selisih: Number(selisih.toFixed(6)),
        };
      });

      return {
        tenantId: tenant.tenantId,
        nama: tenant.nama,
        detail,
        total: Number(Math.sqrt(total).toFixed(6)),
      };
    });

    // ==========================
    // STEP 9 - Nilai Preferensi
    // ==========================

    const preferensi = jarakPositif.map((positif, index) => {
      const negatif = jarakNegatif[index];

      const nilaiV =
        negatif.total / (positif.total + negatif.total);

      return {
        tenantId: positif.tenantId,
        nama: positif.nama,
        dPlus: positif.total,
        dMinus: negatif.total,
        nilai: Number(nilaiV.toFixed(6)),
        rumus: `${negatif.total.toFixed(6)} / (${positif.total.toFixed(
          6
        )} + ${negatif.total.toFixed(6)}) = ${nilaiV.toFixed(6)}`,
      };
    });

    // ==========================
    // STEP 10 - Ranking
    // ==========================

    const ranking = [...preferensi]
      .sort((a, b) => b.nilai - a.nilai)
      .map((item, index) => ({
        peringkat: index + 1,
        tenantId: item.tenantId,
        nama: item.nama,
        nilai: item.nilai,
        status:
          index === 0
            ? "Sangat Direkomendasikan"
            : index < 5
            ? "Direkomendasikan"
            : "Alternatif",
      }));

    // ==========================
    // STEP 11 - Top 5
    // ==========================

    const rekomendasi = ranking.slice(0, 5);

    // ==========================
    // Informasi Kategori
    // ==========================

    const informasiKategori = kategori.map((k) => ({
      id: k.id,
      nama: k.nama,
      atribut: atribut[k.id],
    }));

    // ==========================
    // RESPONSE
    // ==========================

    return {
      metode: "TOPSIS",

      kategori: informasiKategori,

      bobot,

      bobotNormalisasi,

      matriksKeputusan,

      normalisasi,

      normalisasiBerbobot,

      solusiIdealPositif,

      solusiIdealNegatif,

      jarakPositif,

      jarakNegatif,

      preferensi,

      ranking,

      rekomendasi,
    };
  }
}

export default new TopsisService();