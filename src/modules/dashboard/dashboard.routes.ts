import { Router } from "express";
import { obtenerDashboardHoy } from "./dashboard.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/hoy", verifyToken, authorizeByModule('Dashboard'), obtenerDashboardHoy);

export default router;