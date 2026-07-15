import { Router } from "express";
import {
  getFasilitas,          // Ambil fungsi untuk Master Fasilitas
  createFasilitas,       // Tambah Master Fasilitas
  getFasilitasById,      // Detail Master Fasilitas
  updateFasilitas,       // Edit Master Fasilitas
  deleteFasilitas,       // Hapus Master Fasilitas
  getTenantFasilitas,    
  updateTenantFasilitas, 
} from "../controllers/fasilitasController";
import { authenticate } from "../middleware/auth";

const router = Router();

// ==========================================
// 1. ROUTE MASTER FASILITAS (Super Admin / Umum)
// ==========================================

// GET /api/fasilitas (Mengambil SEMUA master fasilitas)
router.get("/", getFasilitas); 

// GET /api/fasilitas/:id (Detail satu master fasilitas)
router.get("/:id", getFasilitasById);

// POST /api/fasilitas (Membuat master fasilitas baru - Super Admin)
router.post("/", authenticate, createFasilitas);

// PUT /api/fasilitas/:id (Mengubah master fasilitas - Super Admin)
router.put("/:id", authenticate, updateFasilitas);

// DELETE /api/fasilitas/:id (Menghapus master fasilitas - Super Admin)
router.delete("/:id", authenticate, deleteFasilitas);


// ==========================================
// 2. ROUTE PILIHAN FASILITAS TENANT (Tenant Admin)
// ==========================================

// GET /api/fasilitas/tenant/my-facilities (Melihat pilihan fasilitas tenant yang login)
router.get("/tenant/my-facilities", authenticate, getTenantFasilitas);

// PUT /api/fasilitas/tenant/my-facilities (Menyimpan/mengupdate checklist fasilitas tenant)
router.put("/tenant/my-facilities", authenticate, updateTenantFasilitas);

export default router;