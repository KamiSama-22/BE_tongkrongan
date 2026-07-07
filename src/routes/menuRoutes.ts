import { Router } from "express";
import menuController from "../controllers/menuController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", menuController.getAll);
router.get("/:id", menuController.getById);

router.post(
  "/",
  authenticate,
  authorize("TENANT_ADMIN"),
  menuController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  menuController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("TENANT_ADMIN"),
  menuController.delete
);

export default router;