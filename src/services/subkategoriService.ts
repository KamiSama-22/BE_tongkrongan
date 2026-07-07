import prisma from "../config/prisma";

interface CreateSubKategoriDTO {
  kategoriId: number;
  nama: string;
  nilai: number;
  keterangan: string;
}

class SubKategoriService {
  async getAll() {
    return prisma.subKategori.findMany({
      include: {
        kategori: true,
      },
      orderBy: {
        kategoriId: "asc",
      },
    });
  }

  async getById(id: number) {
    const subKategori = await prisma.subKategori.findUnique({
      where: { id },
      include: {
        kategori: true,
      },
    });

    if (!subKategori) {
      throw new Error("Sub kategori tidak ditemukan");
    }

    return subKategori;
  }

  async create(data: CreateSubKategoriDTO) {
    return prisma.subKategori.create({
      data: {
        kategoriId: data.kategoriId,
        nama: data.nama,
        nilai: data.nilai,
        keterangan: data.keterangan,
      },
    });
  }

  async update(id: number, data: Partial<CreateSubKategoriDTO>) {
    return prisma.subKategori.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.subKategori.delete({
      where: { id },
    });
  }
}

export default new SubKategoriService();