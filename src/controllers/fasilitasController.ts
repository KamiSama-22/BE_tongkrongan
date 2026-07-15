import { Request, Response } from "express";
import prisma from "../config/prisma";

// =========================================================================
// 1. CRUD MASTER FASILITAS (Super Admin) - UNTUK HALAMAN YANG KOSONG TADI
// =========================================================================

// Ambil semua master fasilitas
export const getFasilitas = async (req: Request, res: Response) => {
  try {
    const fasilitas = await prisma.fasilitas.findMany();
    return res.json(fasilitas); // Langsung kirim array data ke frontend
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Ambil detail satu master fasilitas berdasarkan ID
export const getFasilitasById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fasilitas = await prisma.fasilitas.findUnique({
      where: { id: Number(id) },
    });

    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas tidak ditemukan" });
    }

    return res.json(fasilitas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Tambah master fasilitas baru
export const createFasilitas = async (req: Request, res: Response) => {
  try {
    const { nama, poin } = req.body;

    const baru = await prisma.fasilitas.create({
      data: {
        nama,
        poin: Number(poin),
      },
    });

    return res.status(201).json(baru);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Edit master fasilitas
export const updateFasilitas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama, poin } = req.body;

    const diperbarui = await prisma.fasilitas.update({
      where: { id: Number(id) },
      data: {
        nama,
        poin: Number(poin),
      },
    });

    return res.json(diperbarui);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Hapus master fasilitas
export const deleteFasilitas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.fasilitas.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Fasilitas berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


// =========================================================================
// 2. KELOLA PILIHAN FASILITAS TENANT (Tenant Admin) - KODE LAMA KAMU tetap aman di bawah
// =========================================================================

export const getTenantFasilitas = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tenant = await prisma.tenant.findUnique({
      where: {
        adminId: userId,
      },
    });

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant tidak ditemukan",
      });
    }

    const fasilitas = await prisma.kepemilikan.findMany({
      where: {
        tenantId: tenant.id,
      },
      include: {
        fasilitas: true // Opsional: Agar data master fasilitasnya ikut terbawa jika dibutuhkan frontend
      }
    });

    return res.json(fasilitas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateTenantFasilitas = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { fasilitasIds } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: {
        adminId: userId,
      },
    });

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant tidak ditemukan",
      });
    }

    // Hapus pilihan fasilitas lama di tabel relasi Many-to-Many (Kepemilikan)
    await prisma.kepemilikan.deleteMany({
      where: {
        tenantId: tenant.id,
      },
    });

    // Masukkan pilihan fasilitas baru
    if (fasilitasIds && fasilitasIds.length > 0) {
      await prisma.kepemilikan.createMany({
        data: fasilitasIds.map((id: number) => ({
          tenantId: tenant.id,
          fasilitasId: id,
        })),
      });
    }

    return res.json({
      message: "Fasilitas berhasil diperbarui",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};