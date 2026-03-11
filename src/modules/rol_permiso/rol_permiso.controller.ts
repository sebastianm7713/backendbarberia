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

  async getByPermisoId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;
      const id_permiso = parseInt(rawId);
      const roles = await rolPermisoService.getByPermisoId(id_permiso);
      res.json({
        success: true,
        message: 'Roles con permiso obtenidos exitosamente',
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = createRolPermisoSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.errors,
        });
      }

      const asignacion = await rolPermisoService.create(validationResult.data);
      res.status(201).json({
        success: true,
        message: 'Permiso asignado al rol exitosamente',
        data: asignacion,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRolId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
      const rawPermisoId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;
      const id_rol = parseInt(rawRolId);
      const id_permiso = parseInt(rawPermisoId);
      await rolPermisoService.delete(id_rol, id_permiso);
      res.json({
        success: true,
        message: 'Permiso removido del rol exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteByRolId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
      const id_rol = parseInt(rawId);
      await rolPermisoService.deleteByRolId(id_rol);
      res.json({
        success: true,
        message: 'Todos los permisos del rol eliminados exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
