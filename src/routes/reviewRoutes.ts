import { Router } from "express";
import ReviewController from "../controllers/reviewController"; 
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";

const router = Router();

const checkHandler = (handler: any, name: string) => {
    if (typeof handler !== 'function') {
        console.error(`!!! ERROR: Handler '${name}' is ${typeof handler}. Mungkin salah import/ekspor!`);
    }
    return handler;
};
// --- FIX: TAMBAHKAN authenticate DI SINI ---
router.get("/", authenticate, ReviewController.getAll);

// Endpoint Create Review: Hanya PENGGUNA yang bisa
router.post(
  "/",
  authenticate,
  authorize("PENGGUNA"),
  ReviewController.create
);

// Endpoint Update Review
router.put(
  "/:id", 
  authenticate, 
  ReviewController.update
);

// Endpoint Get Review by Tenant
router.get(
  "/tenant/:tenantId", 
  authenticate, 
  authorize("TENANT_ADMIN", "SUPER_ADMIN"), 
  ReviewController.getByTenant
);

// Endpoint Get Detail Review
router.get(
  "/:id", 
  ReviewController.getById
);

// Endpoint Balas Review
router.put(
  "/balasan/:id", 
  authenticate, 
  authorize("TENANT_ADMIN"), 
  ReviewController.balas
);

// Endpoint Delete Review
router.delete(
  "/:id", 
  authenticate, 
  authorize("SUPER_ADMIN", "TENANT_ADMIN"), 
  ReviewController.delete
);

export default router;