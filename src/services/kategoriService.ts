import prisma from "../config/prisma";

interface CreateKategoriDTO {
  nama: string;
}

class KategoriService {
  async getAll() {
    return prisma.kategori.findMany({
      include: {
        subKategori: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getById(id: number) {
    const kategori = await prisma.kategori.findUnique({
      where: { id },
      include: {
        subKategori: true,
      },
    });

    if (!kategori) {
      throw new Error("Kategori tidak ditemukan");
    }

    return kategori;
  }

  async create(data: CreateKategoriDTO) {
    return prisma.kategori.create({
      data: {
        nama: data.nama,
      },
    });
  }

  async update(id: number, data: Partial<CreateKategoriDTO>) {
    return prisma.kategori.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.kategori.delete({
      where: { id },
    });
  }
}

export default new KategoriService();