import { Request, Response } from "express";
import sawService from "../services/sawService";
import wpService from "../services/wpService";
import topsisService from "../services/topsisService";

class SpkController {
  async calculate(req: Request, res: Response) {
  try {
    const { metode, bobot } = req.body;

    // ==========================
    // VALIDASI BOBOT
    // ==========================

    if (!bobot) {
      return res.status(400).json({
        success: false,
        message: "Bobot wajib diisi",
      });
    }

    if (Object.keys(bobot).length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Semua kategori harus memiliki bobot",
      });
    }

    const totalBobot = Object.values(bobot).reduce(
      (a: number, b: any) => a + Number(b),
      0
    );

    if (totalBobot !== 100) {
      return res.status(400).json({
        success: false,
        message: "Total bobot harus 100",
      });
    }

    // ==========================
    // PILIH METODE
    // ==========================

    let hasil;

    switch (metode.toUpperCase()) {
      case "SAW":
        hasil = await sawService.calculate(bobot);
        break;

      case "WP":
        hasil = await wpService.calculate(bobot);
        break;

      case "TOPSIS":
        hasil = await topsisService.calculate(bobot);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Metode tidak valid",
        });
    }

    return res.json({
      success: true,
      data: hasil,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
}

export default new SpkController();