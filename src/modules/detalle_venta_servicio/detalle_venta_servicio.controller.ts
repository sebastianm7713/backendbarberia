import { Request, Response, NextFunction } from 'express';
import { detalleVentaServicioService } from './detalle_venta_servicio.service';
import { createDetalleVentaServicioSchema } from './detalle_venta_servicio.schema';

export const detalleVentaServicioController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const detalles = await detalleVentaServicioService.getAll();
      console.log('getAll result:', detalles);
      res.json({
        success: true,
        data: detalles,
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      const detalle = await detalleVentaServicioService.getById(id_detalle);
      console.log('getById result:', detalle);
      res.json({
        success: true,
        data: detalle,
      });
    } catch (error) {
      console.error('Error in getById:', error);
      next(error);
    }
  },

  async getByVentaId(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id_venta) ? req.params.id_venta[0] : req.params.id_venta;
      const id_venta = parseInt(rawId);

      if (Number.isNaN(id_venta)) {
        return res.status(400).json({
          success: false,
          message: 'ID de venta inválido',
        });
      }

      const detalles = await detalleVentaServicioService.getByVentaId(id_venta);
      console.log('getByVentaId result:', detalles);
      res.json({
        success: true,
        data: detalles,
      });
    } catch (error) {
      console.error('Error in getByVentaId:', error);
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('create req.body:', req.body);
      const validationResult = createDetalleVentaServicioSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaServicioService.create(validationResult.data);
      console.log('create result:', detalle);
      res.status(201).json({
        success: true,
        data: detalle,
      });
    } catch (error) {
      console.error('Error in create:', error);
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      console.log('update req.body:', req.body);
      const validationResult = createDetalleVentaServicioSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaServicioService.update(id_detalle, validationResult.data);
      console.log('update result:', detalle);
      res.json({
        success: true,
        data: detalle,
      });
    } catch (error) {
      console.error('Error in update:', error);
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      await detalleVentaServicioService.delete(id_detalle);
      console.log('delete result: deleted id', id_detalle);
      res.json({
        success: true,
        data: null,
      });
    } catch (error) {
      console.error('Error in delete:', error);
      next(error);
    }
  },
};
