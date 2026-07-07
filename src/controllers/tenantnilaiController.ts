import { Request, Response } from "express";
import tenantNilaiService from "../services/tenantnilaiService";

class TenantNilaiController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await tenantNilaiService.getAll();

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
      const data = await tenantNilaiService.getById(Number(req.params.id));

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

  async create(req: Request, res: Response) {
    try {
      const data = await tenantNilaiService.create(req.body);

      res.status(201).json({
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

  async update(req: Request, res: Response) {
    try {
      const data = await tenantNilaiService.update(
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
      await tenantNilaiService.delete(Number(req.params.id));

      res.json({
        success: true,
        message: "Data berhasil dihapus",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TenantNilaiController();