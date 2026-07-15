import { Response } from "express";
import SAWService from "../services/sawService";
import WPService from "../services/wpService";
import TOPSISService from "../services/topsisService";

export const calculate = async (req: any, res: Response) => {
    console.log("Data yang diterima backend:", req.body);
  try {
    const { bobot } = req.body;
    
    // VALIDASI BOBOT: Jika bobot tidak ada/null, berikan error yang jelas
    if (!bobot || typeof bobot !== 'object') {
      return res.status(400).json({ success: false, message: "Data bobot tidak valid atau kosong" });
    }

    const user = req.user as any; 
    const tenantId = user?.tenantId || null; 

    const data = {
        SAW: await SAWService.calculate(bobot, tenantId),
        WP: await WPService.calculate(bobot, tenantId),
        TOPSIS: await TOPSISService.calculate(bobot, tenantId)
    };

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};