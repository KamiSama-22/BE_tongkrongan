import { Request, Response } from "express";
import kepemilikanService from "../services/kepemilikanService";

class KepemilikanController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await kepemilikanService.getAll();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { tenantId, fasilitasId } = req.body;
      const data = await kepemilikanService.create(tenantId, fasilitasId);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { tenantId, fasilitasId } = req.body;
      const result = await kepemilikanService.delete(tenantId, fasilitasId);
      res.json({ success: true, message: result.message });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Method baru untuk EditTenant
  async getByTenant(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      const data = await kepemilikanService.getByTenant(Number(tenantId));
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new KepemilikanController();