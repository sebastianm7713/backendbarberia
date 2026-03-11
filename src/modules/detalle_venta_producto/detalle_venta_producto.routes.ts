import { Router } from 'express';
import { detalleVentaProductoController } from './detalle_venta_producto.controller';
import { verifyToken } from '../../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', detalleVentaProductoController.getAll);
router.get('/:id', detalleVentaProductoController.getById);
router.get('/venta/:id_venta', detalleVentaProductoController.getByVentaId);
router.post('/', detalleVentaProductoController.create);
router.put('/:id', detalleVentaProductoController.update);
router.delete('/:id', detalleVentaProductoController.delete);

export default router;
