import { Router } from "express";
import userController from "../controllers/userController";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  userController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  userController.getById
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  userController.delete
);

export default router;