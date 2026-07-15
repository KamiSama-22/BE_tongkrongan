import { Router } from "express";
import * as spkController from "../controllers/spkController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.post("/calculate", authenticate, spkController.calculate);

export default router;