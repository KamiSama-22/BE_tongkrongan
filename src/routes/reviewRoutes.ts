import { Router } from "express";
import reviewController from "../controllers/reviewController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", reviewController.getAll);

router.get("/:id", reviewController.getById);

router.post(
  "/",
  authenticate,
  authorize("PENGGUNA"),
  reviewController.create
);

router.put(
  "/balasan/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  reviewController.balas
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "TENANT_ADMIN"),
  reviewController.delete
);

export default router;