import prisma from "../config/prisma";

interface CreateFasilitasDTO {
  nama: string;
  poin: number;
}

class FasilitasService {
  async getAll() {
    return prisma.fasilitas.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getById(id: number) {
    const fasilitas = await prisma.fasilitas.findUnique({
      where: { id },
    });

    if (!fasilitas) {
      throw new Error("Fasilitas tidak ditemukan");
    }

    return fasilitas;
  }

  async create(data: CreateFasilitasDTO) {
    return prisma.fasilitas.create({
      data: {
        nama: data.nama,
        poin: data.poin,
      },
    });
  }

  async update(id: number, data: Partial<CreateFasilitasDTO>) {
    return prisma.fasilitas.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await prisma.fasilitas.delete({
      where: { id },
    });

    return {
      message: "Fasilitas berhasil dihapus",
    };
  }
}

export default new FasilitasService();