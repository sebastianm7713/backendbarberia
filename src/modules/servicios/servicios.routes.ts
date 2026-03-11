import { Router } from "express";
import { getServicios, createServicio } from "./services.routes";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// All authenticated users can view services
router.get("/", verifyToken, getServicios);
// Only admin can create
router.post("/", verifyToken, authorizeRoles(1), createServicio);

export default router;