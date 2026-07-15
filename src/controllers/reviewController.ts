import { Request, Response } from "express";
import reviewService from "../services/reviewService";

class ReviewController {
  async getAll(req: any, res: Response) {
  console.log("--- DEBUGGING DATA ---");
console.log("User dari Token:", req.user);
  try {
    const user = req.user;

    // 1. Jika TENANT_ADMIN, hanya boleh lihat tenant-nya sendiri
    if (user.role === "TENANT_ADMIN") {
      if (!user.tenantId) return res.status(400).json({ message: "Tenant ID tidak ditemukan" });
      const data = await reviewService.getByTenantId(Number(user.tenantId));
      return res.json({ success: true, data });
    }

    // 2. Jika SUPER_ADMIN, boleh lihat semuanya
    if (user.role === "SUPER_ADMIN") {
      const data = await reviewService.getAll();
      return res.json({ success: true, data });
    }


    const data = await reviewService.getByUserId(user.id);
    return res.json({ success: true, data });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
  async getById(req: Request, res: Response) {
    try {
      const data = await reviewService.getById(Number(req.params.id));
      if (!data) return res.status(404).json({ success: false, message: "Review tidak ditemukan" });
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
async getByTenant(req: any, res: Response) {
    try {
      const user = req.user;
      const targetTenantId = Number(req.params.tenantId);

      // Proteksi: Jika dia Tenant Admin, pastikan dia hanya akses tenant miliknya
      if (user.role === "TENANT_ADMIN" && user.tenantId !== targetTenantId) {
          return res.status(403).json({ success: false, message: "Akses ditolak! Anda tidak berwenang melihat data tenant ini." });
      }

      const data = await reviewService.getByTenantId(targetTenantId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

async create(req: any, res: Response) {
    try {
      const { tenantId, rating, kebersihan, komentar } = req.body;
      const userId = req.user?.id;

      // Cek apakah user sudah pernah review tenant ini
      const existing = await reviewService.checkUserReviewExists(userId, Number(tenantId));
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: "Anda sudah memberikan review untuk tenant ini. Silakan gunakan fitur update." 
        });
      }

      const data = await reviewService.create({
        tenantId: Number(tenantId),
        userId: userId,
        rating: Number(rating),
        kebersihan,
        komentar
      });

      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

async update(req: any, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { rating, kebersihan, komentar } = req.body;
        
        // Ambil review lama
        const oldReview = await reviewService.getById(parseInt(id));
        
        // Cek Ownership
        if (oldReview.userId !== userId) {
            return res.status(403).json({ success: false, message: "Anda tidak bisa mengedit review orang lain!" });
        }

        const updated = await reviewService.update(parseInt(id), { rating, kebersihan, komentar });
        res.json({ success: true, data: updated });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
  }

async balas(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { balasan } = req.body;
      const user = req.user; // Ambil info admin yang login

      // 1. Ambil review target
      const review = await reviewService.getById(Number(id));

      // 2. Proteksi: Admin hanya boleh balas review tenant-nya sendiri
      if (user.role === "TENANT_ADMIN" && review.tenantId !== user.tenantId) {
        return res.status(403).json({ success: false, message: "Akses ditolak! Anda tidak bisa membalas review tenant lain." });
      }

      const data = await reviewService.updateBalasan(Number(id), balasan);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

async delete(req: any, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      // 1. Ambil review target
      const review = await reviewService.getById(Number(id));

      // 2. Proteksi: Admin hanya boleh hapus review di tenant-nya
      if (user.role === "TENANT_ADMIN" && review.tenantId !== user.tenantId) {
        return res.status(403).json({ success: false, message: "Akses ditolak! Anda tidak bisa menghapus review tenant lain." });
      }

      await reviewService.delete(Number(id));
      res.json({ success: true, message: "Review berhasil dihapus" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  
}

export default new ReviewController();