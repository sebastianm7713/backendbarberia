import { Router } from 'express';
import { configuracionLandingController } from './configuracion_landing.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { authorizeByModule } from '../../middleware/permission.middleware';

const router = Router();

// GET - Obtener configuración (público)
router.get('/', configuracionLandingController.getDefault);

// POST, PUT, DELETE - requieren autenticación y rol de admin (1)
router.post('/', verifyToken, authorizeByModule('Configuración'), configuracionLandingController.create);
router.put('/:id', verifyToken, authorizeByModule('Configuración'), configuracionLandingController.update);
router.delete('/:id', verifyToken, authorizeByModule('Configuración'), configuracionLandingController.delete);

export default router;