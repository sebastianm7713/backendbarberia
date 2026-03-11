import { Router } from "express";
import * as controller from "./usuarios.controller";

const router = Router();

router.get("/", controller.getUsuarios);
router.post("/", controller.crearUsuario);

export default router;