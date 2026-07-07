import { Router } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Token valid",
  });
});

export default router;