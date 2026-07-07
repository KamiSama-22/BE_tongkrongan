import { Router } from "express";
import tenantNilaiController from "../controllers/tenantnilaiController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", authenticate, tenantNilaiController.getAll);

router.get("/:id", authenticate, tenantNilaiController.getById);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantNilaiController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantNilaiController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  tenantNilaiController.delete
);

export default router;