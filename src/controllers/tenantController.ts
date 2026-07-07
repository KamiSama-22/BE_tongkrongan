import { Request, Response } from "express";
import tenantService from "../services/tenantService";

class TenantController {
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

  async create(req: Request, res: Response) {
    try {
      const data = await tenantService.create(req.body);

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