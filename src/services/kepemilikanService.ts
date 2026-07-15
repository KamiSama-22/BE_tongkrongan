import prisma from "../config/prisma";

class KepemilikanService {
  async getAll() {
    return prisma.kepemilikan.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            nama: true,
          },
        },
        fasilitas: true,
      },
    });
  }
  async getByTenant(tenantId: number) {
  return await prisma.kepemilikan.findMany({
    where: { tenantId },
  });
}

  async create(tenantId: number, fasilitasId: number) {
    return prisma.kepemilikan.create({
      data: {
        tenantId,
        fasilitasId,
      },
    });
  }

  async delete(tenantId: number, fasilitasId: number) {
    await prisma.kepemilikan.delete({
      where: {
        tenantId_fasilitasId: {
          tenantId,
          fasilitasId,
        },
      },
    });

    return {
      message: "Fasilitas berhasil dihapus dari tenant",
    };
  }
}

export default new KepemilikanService();