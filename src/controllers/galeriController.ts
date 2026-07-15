import { Request, Response } from "express";
import galeriService from "../services/galeriService";

class GaleriController {
async getAll(req: any, res: Response) {
  const tenantId = req.user.tenantId;
  const data = await galeriService.getAll(tenantId);
  res.json({ success: true, data });
}

  async getById(req: Request, res: Response) {
    try {
      const data = await galeriService.getById(Number(req.params.id));

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

  async create(req: any, res: Response) { // Ubah req menjadi 'any'
    try {
      // Validasi keberadaan tenantId
      const tenantId = req.user?.tenantId; 

      if (!tenantId) {
        return res.status(401).json({ 
          success: false, 
          message: "Akses ditolak: Tenant ID tidak ditemukan. Silakan login kembali." 
        });
      }

      const data = await galeriService.create({
        tenantId: Number(tenantId), // Pastikan jadi Number
        gambar: req.body.gambar,
        caption: req.body.caption || "",
        tipe: req.body.tipe || "MENU" // Bisa diubah dari frontend
      });

      res.status(201).json({ success: true, data });
    } catch (err: any) {
      console.error("Error saat simpan galeri:", err);
      res.status(500).json({ success: false, message: err.message || "Gagal simpan" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await galeriService.update(
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

  async delete(req: Request, res: Response) {
    try {
      const result = await galeriService.delete(Number(req.params.id));

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

export default new GaleriController();