import { Router } from "express";
import * as menuController from "../controllers/menuController"; 
import { authenticate } from "../middleware/auth"; // Pastikan import ini ada

const router = Router();

// Tambahkan 'authenticate' agar 'req.user' tersedia di controller
router.get("/", authenticate, menuController.getAll);
router.get("/:id", menuController.getById);

// Tambahkan 'authenticate' juga di sini agar aman
router.post("/", authenticate, menuController.create);
router.put("/:id", authenticate, menuController.update);
router.delete("/:id", authenticate, menuController.deleteMenu);

export default router;