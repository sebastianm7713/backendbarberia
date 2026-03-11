import { Router } from "express";
import * as controller from "./facturas.controller";
import { validate } from "../../middleware/validation.middleware";
import * as schema from "./facturas.schema";

const router = Router();

router.get("/", controller.getFacturas);
router.get("/:id", controller.getFactura);
router.post("/", validate(schema.createFacturaSchema), controller.crearFactura);
router.delete("/:id", controller.eliminarFactura);

export default router;
