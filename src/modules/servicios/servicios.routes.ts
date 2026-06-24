import { Router } from "express";
import * as controller from "./servicios.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// public read endpoints
router.get("/", controller.getServicios);
router.get("/public", controller.getServicios); // Public endpoint for landing page

router.get("/:id", controller.getServicioById);

// admin modifications
router.post("/", verifyToken, authorizeByModule('Servicios'), controller.createServicio);

router.put("/:id", verifyToken, authorizeByModule('Servicios'), controller.updateServicio);

router.delete("/:id", verifyToken, authorizeByModule('Servicios'), controller.deleteServicio);

export default router;