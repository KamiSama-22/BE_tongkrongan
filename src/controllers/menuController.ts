import { Request, Response } from "express";
import menuService from "../services/menuService";

class MenuController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await menuService.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await menuService.getById(Number(req.params.id));

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await menuService.create(req.body);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await menuService.update(
        Number(req.params.id),
        req.body
      );

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await menuService.delete(Number(req.params.id));

      res.json({
        success: true,
        message: "Menu berhasil dihapus",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default new MenuController();