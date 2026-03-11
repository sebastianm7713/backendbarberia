import { Router } from 'express';
import { rolPermisoController } from './rol_permiso.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';

const router = Router();

router.use(verifyToken, authorizeRoles(1)); // Solo admin

router.get('/', rolPermisoController.getAll);
router.get('/rol/:id_rol', rolPermisoController.getByRolId);
router.get('/permiso/:id_permiso', rolPermisoController.getByPermisoId);
router.post('/', rolPermisoController.create);
router.delete('/:id_rol/:id_permiso', rolPermisoController.delete);
router.delete('/rol/:id_rol', rolPermisoController.deleteByRolId);

export default router;
