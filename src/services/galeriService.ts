import prisma from "../config/prisma";

interface GaleriDTO {
  tenantId: number;
  gambar: string;
  caption?: string;
}

class GaleriService {
  async getAll() {
    return prisma.galeri.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      orderBy: {
        id: "asc",
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

  async create(data: GaleriDTO) {
    return prisma.galeri.create({
      data: {
        tenantId: data.tenantId,
        gambar: data.gambar,
        caption: data.caption,
      },
    });
  }

  async update(id: number, data: Partial<GaleriDTO>) {
    return prisma.galeri.update({
      where: { id },
      data,
    });
  }

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