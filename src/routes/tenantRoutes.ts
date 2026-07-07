import { Router } from "express";
import tenantController from "../controllers/tenantController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.getById
);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantController.delete
);

export default router;