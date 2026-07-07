import { Request, Response } from "express";
import galeriService from "../services/galeriService";

class GaleriController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await galeriService.getAll();

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

async create(req: Request, res: Response) {
  try {
    const data = await galeriService.create({
      tenantId: Number(req.body.tenantId),
      gambar: req.file?.filename || "",
      caption: req.body.caption,
    });

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