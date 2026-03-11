import { Router } from 'express';
import { detalleVentaServicioController } from './detalle_venta_servicio.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', detalleVentaServicioController.getAll);
router.get('/:id', detalleVentaServicioController.getById);
router.get('/venta/:id_venta', detalleVentaServicioController.getByVentaId);
router.post('/', detalleVentaServicioController.create);
router.put('/:id', detalleVentaServicioController.update);
router.delete('/:id', detalleVentaServicioController.delete);

export default router;
