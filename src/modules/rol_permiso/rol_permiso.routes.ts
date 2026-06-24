import { Router } from 'express';
import { rolPermisoController } from './rol_permiso.controller';
import { verifyToken } from '../../middleware/auth.middleware';
import { authorizeByModule } from '../../middleware/permission.middleware';

const router = Router();

router.use(verifyToken, authorizeByModule('Rol Permiso')); // Solo admin-equivalente via permisos

router.get('/', rolPermisoController.getAll);
router.get('/rol/:id_rol', rolPermisoController.getByRolId);
router.post('/', rolPermisoController.create);
router.delete('/rol/:id_rol', rolPermisoController.deleteByRolId);
router.delete('/:id_rol/:id_permiso', rolPermisoController.delete);

export default router;
