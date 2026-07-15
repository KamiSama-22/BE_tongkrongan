import { Request, Response } from "express";
import MenuService from "../services/menuService";

// Helper untuk cast request agar TypeScript tidak komplain
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    tenantId: number;
  };
}

// 1. Mengambil semua menu milik tenant yang login
export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ success: false, message: "Akses ditolak" });

    const data = await MenuService.getAll(tenantId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Mengambil menu berdasarkan ID
export const getById = async (req: AuthRequest, res: Response) => {
  try {
    // Service harus memastikan menu yang diambil memang milik tenantId user tersebut
    const data = await MenuService.getById(Number(req.params.id));
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// 3. Membuat menu baru (tenantId dipaksa dari token, bukan body)
export const create = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(403).json({ success: false, message: "Akses ditolak" });

    // Gabungkan data body dengan tenantId dari Token
    const menuData = { ...req.body, tenantId };
    
    const data = await MenuService.create(menuData);
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Update menu (Pastikan menu yang diupdate milik tenant yang login)
export const update = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    // Logika tambahan di Service nanti harus memastikan tenantId cocok
    const data = await MenuService.update(Number(req.params.id), req.body, tenantId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Menghapus menu
export const deleteMenu = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const result = await MenuService.delete(Number(req.params.id), tenantId);
    res.json({ success: true, message: result.message });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};