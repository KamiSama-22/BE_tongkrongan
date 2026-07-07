import prisma from "../config/prisma";

interface MenuDTO {
  tenantId: number;
  nama: string;
  deskripsi?: string;
  harga: number;
  foto?: string;
}

class MenuService {
  async getAll() {
    return prisma.menu.findMany({
      include: {
        tenant: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        tenant: true,
      },
    });

    if (!menu) throw new Error("Menu tidak ditemukan");

    return menu;
  }

  async create(data: MenuDTO) {
    return prisma.menu.create({
      data,
    });
  }

  async update(id: number, data: Partial<MenuDTO>) {
    await this.getById(id);

    return prisma.menu.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await this.getById(id);

    return prisma.menu.delete({
      where: { id },
    });
  }
}

export default new MenuService();