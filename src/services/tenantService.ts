import prisma from "../config/prisma";

interface CreateTenantDTO {
  adminId: number;
  nama: string;
  alamat: string;
  ratingMaps?: number;
  email?: string;
  deskripsi?: string;
  jamOperasional: string;
  telepon?: string;
  mapsUrl?: string;
  logo?: string;
}

class TenantService {
  async getAll() {
    return await prisma.tenant.findMany({
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async getById(id: number) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        admin: true,
        menus: true,
        galeris: true,
      },
    });

    if (!tenant) {
      throw new Error("Tenant tidak ditemukan");
    }

    return tenant;
  }

async create(data: CreateTenantDTO) {
  return await prisma.tenant.create({
    data: {
      adminId: data.adminId,
      nama: data.nama,
      alamat: data.alamat,
      ratingMaps: data.ratingMaps,
      email: data.email,
      deskripsi: data.deskripsi,
      jamOperasional: data.jamOperasional,
      telepon: data.telepon,
      mapsUrl: data.mapsUrl,
      logo: data.logo,
    },
  });
}

async update(id: number, data: Partial<CreateTenantDTO>) {
  return await prisma.tenant.update({
    where: { id },
    data: {
      adminId: data.adminId,
      nama: data.nama,
      alamat: data.alamat,
      ratingMaps: data.ratingMaps,
      email: data.email,
      deskripsi: data.deskripsi,
      jamOperasional: data.jamOperasional,
      telepon: data.telepon,
      mapsUrl: data.mapsUrl,
      logo: data.logo,
    },
  });
}

  async delete(id: number) {
    await prisma.tenant.delete({
      where: { id },
    });

    return {
      message: "Tenant berhasil dihapus",
    };
  }
}

export default new TenantService();