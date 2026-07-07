import { Router } from "express";
import fasilitasController from "../controllers/fasilitasController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get("/", authenticate, fasilitasController.getAll);

router.get("/:id", authenticate, fasilitasController.getById);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  fasilitasController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  fasilitasController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  fasilitasController.delete
);

export default router;