import { Router } from "express";
import kepemilikanController from "../controllers/kepemilikanController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get(
  "/",
  authenticate,
  kepemilikanController.getAll
);

router.post(
  "/",
  authenticate,
  authorize("TENANT_ADMIN"),
  kepemilikanController.create
);

router.delete(
  "/",
  authenticate,
  authorize("TENANT_ADMIN"),
  kepemilikanController.delete
);

export default router;