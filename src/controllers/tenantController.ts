import { Request, Response } from "express";
import tenantService from "../services/tenantService";
import prisma from "../config/prisma";


class TenantController {
  // =========================================================================
  // BARU: Mengambil profil gerai milik Tenant Admin yang sedang login
  // =========================================================================
  async getMyProfile(req: Request, res: Response) {
    try {
      const adminId = (req as any).user.id;

      // Cari tenant yang memiliki relasi adminId sesuai dengan token
      const tenant = await prisma.tenant.findFirst({
        where: { adminId }, // Pastikan adminId ini sesuai nama field relasi user di schema.prisma mu
        include: {
          kepemilikan: {
            include: {
              fasilitas: true, // Opsional: tarik relasi sekalian kalau dibutuhkan
            },
          },
        },
      });

      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Profil tenant belum terdaftar.",
        });
      }

      return res.json({
        success: true,
        data: tenant,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  
  async getAll(req: Request, res: Response) {
    try {
      const data = await tenantService.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      const data = await tenantService.getPending();

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await tenantService.getById(Number(req.params.id));

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }


// Di dalam class TenantController
async create(req: any, res: Response) {
    try {
      const adminId = req.user.id;
      // Menangkap field input
      const { nama, alamat, jamOperasional, harga, ratingMaps, deskripsi, email, mapsUrl, telepon, fasilitasIds } = req.body;
      
      // Ambil file dari multer
      const logoPath = req.file ? `uploads/${req.file.filename}` : null;
const tenant = await tenantService.create({
        nama,
        alamat,
        jamOperasional,
        harga,
        ratingMaps: ratingMaps ? Number(ratingMaps) : 0,
        deskripsi,
        email,
        mapsUrl,
        telepon,
        adminId,
        logo: logoPath, // Pastikan service kamu menerima field logo
      });

      // 2. Handle Fasilitas (Parse jika string, map jika array)
      if (fasilitasIds) {
        // Jika dari FormData, fasilitasIds biasanya berupa string "[1,2,3]"
        const parsedFasilitas = typeof fasilitasIds === 'string' ? JSON.parse(fasilitasIds) : fasilitasIds;

        if (Array.isArray(parsedFasilitas) && parsedFasilitas.length > 0) {
          await prisma.kepemilikan.createMany({
            data: parsedFasilitas.map((id: number) => ({
              tenantId: tenant.id,
              fasilitasId: Number(id),
            })),
          });
        }
      }

      res.status(201).json({ success: true, data: tenant });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await tenantService.update(
        Number(req.params.id),
        req.body
      );

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  async approve(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const tenant = await prisma.tenant.update({
        where: {
          id
        },
        data: {
          status: "APPROVED"
        }
      });

      return res.json({
        success: true,
        data: tenant
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const tenant = await prisma.tenant.update({
        where: {
          id,
        },
        data: {
          status: "REJECTED",
        },
      });

      return res.json({
        success: true,
        data: tenant,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await tenantService.delete(Number(req.params.id));

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TenantController();