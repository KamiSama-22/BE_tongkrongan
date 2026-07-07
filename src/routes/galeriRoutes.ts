import { Router } from "express";
import galeriController from "../controllers/galeriController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";
import upload from "../config/multer";

const router = Router();

router.get("/", galeriController.getAll);

router.get("/:id", galeriController.getById);

router.post(
  "/",
  authenticate,
  authorize("TENANT_ADMIN"),
  upload.single("gambar"),
  galeriController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  galeriController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  galeriController.delete
);

export default router;