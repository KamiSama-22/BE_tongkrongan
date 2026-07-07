import { Router } from "express";
import kategoriController from "../controllers/kategoriController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", authenticate, kategoriController.getAll);

router.get("/:id", authenticate, kategoriController.getById);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  kategoriController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  kategoriController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  kategoriController.delete
);

export default router;