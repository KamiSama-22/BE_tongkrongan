import { Router } from "express";
import kepemilikanController from "../controllers/kepemilikanController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

// Bungkus setiap controller dengan (req, res) => ...
router.get("/tenant/:tenantId", authenticate, (req, res) => kepemilikanController.getByTenant(req, res));
router.get("/", authenticate, (req, res) => kepemilikanController.getAll(req, res));
router.post("/", authenticate, authorize("TENANT_ADMIN"), (req, res) => kepemilikanController.create(req, res));
router.delete("/", authenticate, authorize("TENANT_ADMIN"), (req, res) => kepemilikanController.delete(req, res));

export default router;