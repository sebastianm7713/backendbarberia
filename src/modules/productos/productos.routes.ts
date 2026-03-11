import { Router } from "express";
import { listar } from "./productos.controller";

const router = Router();
router.get("/", listar);

export default router;