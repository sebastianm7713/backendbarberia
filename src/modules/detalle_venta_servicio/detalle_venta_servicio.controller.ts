import { Request, Response, NextFunction } from 'express';
import { detalleVentaServicioService } from './detalle_venta_servicio.service';
import { createDetalleVentaServicioSchema } from './detalle_venta_servicio.schema';

export const detalleVentaServicioController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const detalles = await detalleVentaServicioService.getAll();
      res.json({
        success: true,
        message: 'Detalles de servicio obtenidos exitosamente',
        data: detalles,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      const detalle = await detalleVentaServicioService.getById(id_detalle);
      res.json({
        success: true,
        message: 'Detalle de servicio obtenido exitosamente',
        data: detalle,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByVentaId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id_venta) ? req.params.id_venta[0] : req.params.id_venta;
      const id_venta = parseInt(rawId);
      const detalles = await detalleVentaServicioService.getByVentaId(id_venta);
      res.json({
        success: true,
        message: 'Detalles de servicio obtenidos exitosamente',
        data: detalles,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = createDetalleVentaServicioSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.errors,
        });
      }

      const detalle = await detalleVentaServicioService.create(validationResult.data);
      res.status(201).json({
        success: true,
        message: 'Detalle de servicio creado exitosamente',
        data: detalle,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      const validationResult = createDetalleVentaServicioSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaServicioService.update(id_detalle, validationResult.data);
      res.json({
        success: true,
        message: 'Detalle de servicio actualizado exitosamente',
        data: detalle,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      await detalleVentaServicioService.delete(id_detalle);
      res.json({
        success: true,
        message: 'Detalle de servicio eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
