import prisma from "../config/prisma";

// Perbarui interface agar mencakup semua field yang dikirim dari form
interface CreateTenantDTO {
  adminId: number;
  nama: string;
  alamat: string;
  jamOperasional: string;
  harga?: string;
  ratingMaps?: number;
  deskripsi?: string;
  email?: string;
  mapsUrl?: string;
  telepon?: string;
  logo?: string | null;
}

class TenantService {
  async getAll() {
    return await prisma.tenant.findMany({
      where: { status: "APPROVED" },
      include: {
        admin: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async getPending() {
    return await prisma.tenant.findMany({
      where: { status: "PENDING" },
      include: {
        admin: { select: { id: true, username: true, email: true } },
      },
    });
  }

  async getById(id: number) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { admin: true, menus: true, galeris: true, kepemilikan: { include: { fasilitas: true } } },
    });
    if (!tenant) throw new Error("Tenant tidak ditemukan");
    return tenant;
  }

  // Tambahkan fungsi create ini
  async create(data: CreateTenantDTO) {
    return await prisma.tenant.create({
      data: {
        ...data,
        status: "PENDING", // Set default status ke PENDING saat tenant baru dibuat
      },
    });
  }

  async update(id: number, data: any) {
    // Pisahkan fasilitasIds dari data lainnya agar tidak error saat update tenant
    const { fasilitasIds, ...tenantData } = data;

    // 1. Update data dasar tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: tenantData,
    });

    // 2. Update Fasilitas (Hapus yang lama, pasang yang baru)
    if (fasilitasIds) {
      await prisma.kepemilikan.deleteMany({ where: { tenantId: id } });
      await prisma.kepemilikan.createMany({
        data: fasilitasIds.map((fId: number) => ({
          tenantId: id,
          fasilitasId: Number(fId),
        })),
      });
    }
    return updatedTenant;
  }

  async delete(id: number) {
    // Opsional: Hapus relasi fasilitas dulu sebelum hapus tenant
    await prisma.kepemilikan.deleteMany({ where: { tenantId: id } });
    await prisma.tenant.delete({ where: { id } });
    return { message: "Tenant berhasil dihapus" };
  }
}

export default new TenantService();