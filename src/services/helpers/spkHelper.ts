import prisma from "../../config/prisma";

export class SpkHelper {
  async getData() {
    const tenants = await prisma.tenant.findMany({
      include: {
        nilaiKategori: {
          include: {
            kategori: true,
          },
        },
      },
    });

    const kategori = await prisma.kategori.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return {
      tenants,
      kategori,
    };
  }
}

export default new SpkHelper();