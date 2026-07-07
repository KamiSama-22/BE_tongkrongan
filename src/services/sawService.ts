import spkHelper from "./helpers/spkHelper";

class SawService {
  async calculate(bobot: Record<number, number>) {
    // Ambil data
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
      1: "COST", // Harga
      2: "BENEFIT", // Jam Operasional
      3: "BENEFIT", // Menu
      4: "BENEFIT", // Fasilitas
      5: "BENEFIT", // Rating
      6: "BENEFIT", // Kebersihan
    };

    const pembagi: Record<number, number> = {};

    for (const k of kategori) {
      const semuaNilai = tenants
        .flatMap((t) => t.nilaiKategori)
        .filter((x) => x.kategoriId === k.id)
        .map((x) => x.nilai);

      pembagi[k.id] =
        atribut[k.id] === "BENEFIT"
          ? Math.max(...semuaNilai)
          : Math.min(...semuaNilai);
    }

    // ==========================
    // STEP 3 - Normalisasi
    // ==========================

    const normalisasi = matriksKeputusan.map((tenant) => ({
      tenantId: tenant.tenantId,
      nama: tenant.nama,
      nilai: tenant.nilai.map((item) => {
        const hasil =
          atribut[item.kategoriId] === "BENEFIT"
            ? item.nilai / pembagi[item.kategoriId]
            : pembagi[item.kategoriId] / item.nilai;

        return {
          kategoriId: item.kategoriId,
          kategori: item.kategori,
          nilai: Number(hasil.toFixed(4)),
        };
      }),
    }));

    // ==========================
    // STEP 4 - Preferensi
    // ==========================

    const preferensi = normalisasi.map((tenant) => {
      let total = 0;

      const detail = tenant.nilai.map((item) => {
        const bobotKategori = bobot[item.kategoriId] || 0;

        const hasil = item.nilai * bobotKategori;

        total += hasil;

        return {
          kategoriId: item.kategoriId,
          kategori: item.kategori,
          normalisasi: item.nilai,
          bobot: bobotKategori,
          hasil: Number(hasil.toFixed(4)),
          rumus: `${item.nilai.toFixed(4)} × ${bobotKategori} = ${hasil.toFixed(
            4
          )}`,
        };
      });

      return {
        tenantId: tenant.tenantId,
        nama: tenant.nama,
        detail,
        total: Number(total.toFixed(4)),
        rumusTotal: `${detail
          .map((d) => d.hasil.toFixed(4))
          .join(" + ")} = ${total.toFixed(4)}`,
      };
    });

    // ==========================
    // STEP 5 - Ranking
    // ==========================

    const ranking = [...preferensi]
      .sort((a, b) => b.total - a.total)
      .map((item, index) => ({
        peringkat: index + 1,
        tenantId: item.tenantId,
        nama: item.nama,
        nilai: item.total,
        status:
          index === 0
            ? "Sangat Direkomendasikan"
            : index < 5
            ? "Direkomendasikan"
            : "Alternatif",
      }));

    // ==========================
    // STEP 6 - Rekomendasi
    // ==========================

    const rekomendasi = ranking.slice(0, 5);

    // ==========================
    // STEP 7 - Informasi Kategori
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
      metode: "SAW",
      kategori: informasiKategori,
      bobot,
      matriksKeputusan,
      normalisasi,
      preferensi,
      ranking,
      rekomendasi,
    };
  }
}

export default new SawService();