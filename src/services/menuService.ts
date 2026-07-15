import prisma from "../config/prisma";

class MenuService {
// MenuService.ts
async getAll(tenantId: number) {
  return await prisma.menu.findMany({
    where: { tenantId: tenantId },
    include: { tenant: true },
  });
}

  async getById(id: number) {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        tenant: true,
      },
    });

    if (!menu) {
      throw new Error("Menu tidak ditemukan");
    }
    return menu;
  }

  // 3. Perbaikan fungsi create
  async create(data: any) {
    return await prisma.menu.create({
      data: {
        tenantId: Number(data.tenantId),
        nama: data.nama,
        deskripsi: data.deskripsi,
        harga: Number(data.harga),
        foto: data.foto ?? null,
      },
    });
  }

  async update(id: number, data: any, tenantId: number | undefined) {
    return await prisma.menu.update({
      where: { id },
      data: {
        nama: data.nama,
        deskripsi: data.deskripsi,
        harga: Number(data.harga),
        foto: data.foto,
      },
    });
  }

  async delete(id: number, tenantId: number | undefined) {
    await prisma.menu.delete({ where: { id } });
    return { message: "Menu berhasil dihapus" };
  }
}

export default new MenuService();