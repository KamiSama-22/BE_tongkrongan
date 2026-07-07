import prisma from "../config/prisma";

interface CreateTenantNilaiDTO {
  tenantId: number;
  kategoriId: number;
  subKategoriId: number;
  nilai: number;
}

class TenantNilaiService {
  async getAll() {
    return prisma.tenantNilai.findMany({
      include: {
        tenant: true,
        kategori: true,
        subKategori: true,
      },
      orderBy: {
        tenantId: "asc",
      },
    });
  }

  async getById(id: number) {
    const data = await prisma.tenantNilai.findUnique({
      where: { id },
      include: {
        tenant: true,
        kategori: true,
        subKategori: true,
      },
    });

    if (!data) {
      throw new Error("Data tidak ditemukan");
    }

    return data;
  }

  async create(data: CreateTenantNilaiDTO) {
    return prisma.tenantNilai.create({
      data,
    });
  }

  async update(id: number, data: Partial<CreateTenantNilaiDTO>) {
    return prisma.tenantNilai.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.tenantNilai.delete({
      where: { id },
    });
  }
}

export default new TenantNilaiService();