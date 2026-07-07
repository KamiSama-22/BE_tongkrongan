import { Router } from "express";
import subKategoriController from "../controllers/subkategoriController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", authenticate, subKategoriController.getAll);

router.get("/:id", authenticate, subKategoriController.getById);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  subKategoriController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  subKategoriController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  subKategoriController.delete
);

export default router;