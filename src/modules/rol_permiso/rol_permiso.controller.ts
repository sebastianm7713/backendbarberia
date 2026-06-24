import { Request, Response, NextFunction } from 'express';
import { rolPermisoService } from './rol_permiso.service';
import { createRolPermisoSchema } from './rol_permiso.schema';

export const rolPermisoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const asignaciones = await rolPermisoService.getAll();
      res.json({
        success: true,
        message: 'Asignaciones rol-permiso obtenidas exitosamente',
        data: asignaciones,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByRolId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
      const id_rol = parseInt(rawId);
      const permisos = await rolPermisoService.getByRolId(id_rol);
      res.json({
        success: true,
        message: 'Permisos del rol obtenidos exitosamente',
        data: permisos,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Create rol permiso req.body:', req.body);
      
      const validationResult = createRolPermisoSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log('Validation errors:', validationResult.error.issues);
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: validationResult.error.issues,
        });
      }

      const asignacion = await rolPermisoService.create(validationResult.data);
      console.log('Create result:', asignacion);
      res.status(201).json({
        success: true,
        message: 'Permiso asignado al rol exitosamente',
        data: asignacion,
      });
    } catch (error: any) {
      console.error('Error in create rol_permiso:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al crear permiso de rol',
      });
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Controller delete called with params:', req.params);
      const rawRolId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
      const rawPermisoId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;

      console.log('Raw params:', { rawRolId, rawPermisoId });

      const id_rol = parseInt(rawRolId);
      const id_permiso = parseInt(rawPermisoId);

      console.log('Parsed params:', { id_rol, id_permiso });

      if (isNaN(id_rol) || isNaN(id_permiso)) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros inválidos: id_rol e id_permiso deben ser números',
        });
      }

      console.log('Delete rol_permiso:', { id_rol, id_permiso });

      await rolPermisoService.delete(id_rol, id_permiso);
      res.json({
        success: true,
        message: 'Permiso removido del rol exitosamente',
      });
    } catch (error: any) {
      console.error('Error in delete rol_permiso:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar permiso de rol',
      });
    }
  },

  async deleteByRolId(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Controller deleteByRolId called with params:', req.params);
      const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
      const id_rol = parseInt(rawId);

      console.log('Delete by rol id:', id_rol);

      if (isNaN(id_rol)) {
        return res.status(400).json({
          success: false,
          message: 'ID de rol inválido',
        });
      }

      await rolPermisoService.deleteByRolId(id_rol);
      console.log('Controller deleteByRolId completed successfully');
      res.json({
        success: true,
        message: 'Todos los permisos del rol eliminados exitosamente',
      });
    } catch (error: any) {
      console.error('Error in deleteByRolId controller:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al eliminar permisos del rol',
      });
    }
  },
};
