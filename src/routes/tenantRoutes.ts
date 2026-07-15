import { Router } from "express";
import tenantController from "../controllers/tenantController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";
import upload from "../middleware/upload";

const router = Router();

router.get(
  "/pending",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.getPending
);

router.get(
  "/",
  tenantController.getAll
);


router.get(
  "/profile",
  authenticate,
  authorize("TENANT_ADMIN"),
  tenantController.getMyProfile
);


router.get(
  "/:id",
  tenantController.getById
);

router.post(
  "/",
  authenticate,
  authorize("TENANT_ADMIN"),
  upload.single("logo"), // Taruh multer setelah cek otoritas
  tenantController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  tenantController.update
);

router.patch(
    "/:id/approve",
    authenticate,
    authorize("SUPER_ADMIN"),
    tenantController.approve
);

router.patch(
    "/:id/reject",
    authenticate,
    authorize("SUPER_ADMIN"),
    tenantController.reject
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.delete
);

export default router;