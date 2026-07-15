import prisma from "../config/prisma";

// DTO disesuaikan: tenantId wajib, karena setiap data di sistem ini 
// harus terikat dengan tenant pemiliknya.
interface GaleriDTO {
  tenantId: number; 
  gambar: string;   // Ini adalah URL atau path gambar
  caption?: string;
  tipe: string;     // Contoh: "MENU", "LOGO", "BANNER"
}

class GaleriService {
  // Mengambil semua galeri berdasarkan tenant yang sedang login
  // (Ini akan mencegah data galeri tercampur antar tenant)
  async getAll(tenantId: number) {
    return await prisma.galeri.findMany({
      where: {
        tenantId: tenantId,
      },
      include: {
        tenant: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Foto terbaru muncul di atas
      },
    });
  }

  async getById(id: number) {
    const galeri = await prisma.galeri.findUnique({
      where: { id },
      include: {
        tenant: true,
      },
    });

    if (!galeri) {
      throw new Error("Galeri tidak ditemukan");
    }

    return galeri;
  }

  // Membuat data baru
  async create(data: GaleriDTO) {
    return await prisma.galeri.create({
      data: {
        tenantId: Number(data.tenantId),
        url: data.gambar,
        caption: data.caption || "",
        tipe: data.tipe,
      },
    });
  }

  // Update data
  async update(id: number, data: Partial<GaleriDTO>) {
    return await prisma.galeri.update({
      where: { id },
      data: {
        url: data.gambar,
        caption: data.caption,
        tipe: data.tipe,
      },
    });
  }

  // Hapus data
  async delete(id: number) {
    await prisma.galeri.delete({
      where: { id },
    });

    return {
      message: "Galeri berhasil dihapus",
    };
  }
}

export default new GaleriService();