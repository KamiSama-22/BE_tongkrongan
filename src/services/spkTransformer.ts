import prisma from "../config/prisma";

const getScoreByRange = (val: number, ranges: { min: number, max: number, score: number }[]) => {
  const match = ranges.find(r => val >= r.min && val <= r.max);
  return match ? match.score : 1;
};

const getHargaScore = (harga: string) => {
  const map: any = { 
    "Sangat Murah": 1, 
    "Murah": 2, 
    "Sedang": 3, 
    "Mahal": 4, 
    "Sangat Mahal": 5 
  };
  return map[harga] || 3;
};

// Map Enum Kebersihan ke Nilai 1-5
const mapKebersihanScore = (kebersihan: string) => {
  const map: any = { SANGAT_KOTOR: 1, KOTOR: 2, STANDAR: 3, BERSIH: 4, SANGAT_BERSIH: 5 };
  return map[kebersihan] || 3;
};

const calculateDuration = (jamStr: string) => {
  try {
    const parts = jamStr.split('-');
    if (parts.length !== 2) return 0;
    
    const startHour = parseInt(parts[0].trim().split(':')[0]);
    const endHour = parseInt(parts[1].trim().split(':')[0]);

    let duration = endHour - startHour;
    if (duration < 0) duration += 24;
    
    return duration;
  } catch { 
    return 0; 
  }
};

export const getTenantScores = async (tenantId: number) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { menus: true, kepemilikan: { include: { fasilitas: true } }, reviews: true }
  });

  if (!tenant) throw new Error("Tenant tidak ditemukan");

  const rawRating = parseFloat(tenant.ratingMaps?.toString() || "0");
  const rawMenuCount = tenant.menus.length;
  const rawFasilitas = tenant.kepemilikan.reduce((sum, k) => sum + (k.fasilitas.poin || 1), 0);
  const rawJam = calculateDuration(tenant.jamOperasional || ""); 
  const rawKebersihan = tenant.reviews.length > 0 
    ? tenant.reviews.reduce((s, r) => s + mapKebersihanScore(r.kebersihan), 0) / tenant.reviews.length 
    : 3; 

  return {
    harga: getHargaScore(tenant.harga || ""),
    
    jamOperasional: getScoreByRange(rawJam, [
      { min: 0, max: 8, score: 1 },
      { min: 9, max: 11, score: 2 },
      { min: 12, max: 14, score: 3 },
      { min: 15, max: 18, score: 4 },
      { min: 19, max: 24, score: 5 }
    ]),
    
    // Menu
    menu: getScoreByRange(rawMenuCount, [
      { min: 0, max: 10, score: 1 },
      { min: 11, max: 20, score: 2 },
      { min: 21, max: 30, score: 3 },
      { min: 31, max: 40, score: 4 },
      { min: 41, max: 999, score: 5 }
    ]),
  
    fasilitas: getScoreByRange(rawFasilitas, [
      { min: 0, max: 20, score: 1 },
      { min: 21, max: 40, score: 2 },
      { min: 41, max: 60, score: 3 },
      { min: 61, max: 80, score: 4 },
      { min: 81, max: 100, score: 5 }
    ]),
    
    rating: getScoreByRange(rawRating, [
      { min: 1.0, max: 2.0, score: 1 },
      { min: 2.1, max: 2.5, score: 2 },
      { min: 2.6, max: 3.0, score: 3 },
      { min: 3.1, max: 3.5, score: 4 },
      { min: 3.6, max: 4.0, score: 5 },
      { min: 4.1, max: 4.2, score: 6 },
      { min: 4.3, max: 4.4, score: 7 },
      { min: 4.5, max: 4.6, score: 8 },
      { min: 4.7, max: 4.8, score: 9 },
      { min: 4.9, max: 5.0, score: 10 }
    ]),

    kebersihan: parseFloat(rawKebersihan.toFixed(2))
  };
};