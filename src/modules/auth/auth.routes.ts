import { Router } from "express";
import * as controller from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.get("/reset-password/validate", controller.validateResetToken);
router.get("/permisos", verifyToken, controller.getPermisos);
router.get("/profile", verifyToken, controller.getProfile);

export default router;