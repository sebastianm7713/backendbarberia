import { Request, Response, NextFunction } from 'express';
import { detalleVentaProductoService } from './detalle_venta_producto.service';
import { createDetalleVentaProductoSchema } from './detalle_venta_producto.schema';

export const detalleVentaProductoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const detalles = await detalleVentaProductoService.getAll();
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
      const detalle = await detalleVentaProductoService.getById(id_detalle);
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
      const detalles = await detalleVentaProductoService.getByVentaId(id_venta);
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
      console.log('create req.body:', JSON.stringify(req.body, null, 2));
      console.log('Field types:', {
        id_venta: typeof req.body.id_venta,
        id_producto: typeof req.body.id_producto,
        cantidad: typeof req.body.cantidad,
        precio_unitario: typeof req.body.precio_unitario,
      });
      const validationResult = createDetalleVentaProductoSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error('Validation errors:', validationResult.error.issues);
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaProductoService.create(validationResult.data);
      console.log('create result:', detalle);
      res.status(201).json({
        success: true,
        data: detalle,
      });
    } catch (error: any) {
      console.error('Error in create:', error);
      const statusCode = error?.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error?.message || 'Error al crear detalle de venta producto',
        error: error?.details || error?.stack || null,
      });
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id_detalle = parseInt(rawId);
      console.log('update req.body:', req.body);
      const validationResult = createDetalleVentaProductoSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaProductoService.update(id_detalle, validationResult.data);
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
      await detalleVentaProductoService.delete(id_detalle);
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
