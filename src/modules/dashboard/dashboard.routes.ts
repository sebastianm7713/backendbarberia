import { Router } from "express";
import { obtenerDashboardHoy } from "./dashboard.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

router.get("/hoy", verifyToken, authorizeRoles(1,2), obtenerDashboardHoy);

export default router;