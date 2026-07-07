import spkHelper from "./helpers/spkHelper";

class WpService {
  async calculate(bobot: Record<number, number>) {
    const { tenants, kategori } = await spkHelper.getData();

    // ======================
    // STEP 1 - Matriks
    // ======================

    const matriksKeputusan = tenants.map((tenant) => ({
      tenantId: tenant.id,
      nama: tenant.nama,
      nilai: tenant.nilaiKategori.map((item) => ({
        kategoriId: item.kategoriId,
        kategori: item.kategori.nama,
        nilai: item.nilai,
      })),
    }));

    // ======================
    // STEP 2 - Atribut
    // ======================

    const atribut: Record<number, "BENEFIT" | "COST"> = {
      1: "COST",
      2: "BENEFIT",
      3: "BENEFIT",
      4: "BENEFIT",
      5: "BENEFIT",
      6: "BENEFIT",
    };

    // ======================
    // STEP 3 - Normalisasi Bobot
    // ======================

    const totalBobot = Object.values(bobot).reduce((a, b) => a + b, 0);

    const bobotNormalisasi: Record<number, number> = {};

    for (const id in bobot) {
      const nilai = bobot[Number(id)] / totalBobot;

      bobotNormalisasi[Number(id)] =
        atribut[Number(id)] === "COST" ? -nilai : nilai;
    }

    // ======================
    // STEP 4 - Vektor S
    // ======================

    const vektorS = matriksKeputusan.map((tenant) => {
      let hasil = 1;

      const detail = tenant.nilai.map((item) => {
        const pangkat = bobotNormalisasi[item.kategoriId];
        const nilai = Math.pow(item.nilai, pangkat);

        hasil *= nilai;

        return {
          kategori: item.kategori,
          nilai: item.nilai,
          bobot: pangkat,
          hasil: Number(nilai.toFixed(6)),
          rumus: `${item.nilai}^${pangkat.toFixed(4)} = ${nilai.toFixed(6)}`,
        };
      });

      return {
        tenantId: tenant.tenantId,
        nama: tenant.nama,
        detail,
        total: Number(hasil.toFixed(6)),
      };
    });

    // ======================
    // STEP 5 - Vektor V
    // ======================

    const totalS = vektorS.reduce((a, b) => a + b.total, 0);

    const preferensi = vektorS.map((item) => ({
      tenantId: item.tenantId,
      nama: item.nama,
      detail: item.detail,
      totalS: item.total,
      nilaiV: Number((item.total / totalS).toFixed(6)),
    }));

    // ======================
    // STEP 6 - Ranking
    // ======================

    const ranking = [...preferensi]
      .sort((a, b) => b.nilaiV - a.nilaiV)
      .map((item, index) => ({
        peringkat: index + 1,
        tenantId: item.tenantId,
        nama: item.nama,
        nilai: item.nilaiV,
        status:
          index === 0
            ? "Sangat Direkomendasikan"
            : index < 5
            ? "Direkomendasikan"
            : "Alternatif",
      }));

    const rekomendasi = ranking.slice(0, 5);

    return {
      metode: "WP",
      bobotInput: bobot,
      bobotNormalisasi,
      matriksKeputusan,
      vektorS,
      preferensi,
      ranking,
      rekomendasi,
    };
  }
}

export default new WpService();