import { Router } from "express";
import * as controller from "./auth.controller";
import { verifyToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/permisos", verifyToken, controller.getPermisos);

export default router;