import { Request, Response, NextFunction } from 'express';
import { detalleVentaProductoService } from './detalle_venta_producto.service';
import { createDetalleVentaProductoSchema } from './detalle_venta_producto.schema';

export const detalleVentaProductoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const detalles = await detalleVentaProductoService.getAll();
      res.json({
        success: true,
        message: 'Detalles de venta obtenidos exitosamente',
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
      const detalle = await detalleVentaProductoService.getById(id_detalle);
      res.json({
        success: true,
        message: 'Detalle de venta obtenido exitosamente',
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
      const detalles = await detalleVentaProductoService.getByVentaId(id_venta);
      res.json({
        success: true,
        message: 'Detalles de venta obtenidos exitosamente',
        data: detalles,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validationResult = createDetalleVentaProductoSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.issues,
        });
      }

      const detalle = await detalleVentaProductoService.create(validationResult.data);
      res.status(201).json({
        success: true,
        message: 'Detalle de venta creado exitosamente',
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
      const validationResult = createDetalleVentaProductoSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          errors: validationResult.error.errors,
        });
      }

      const detalle = await detalleVentaProductoService.update(id_detalle, validationResult.data);
      res.json({
        success: true,
        message: 'Detalle de venta actualizado exitosamente',
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
      await detalleVentaProductoService.delete(id_detalle);
      res.json({
        success: true,
        message: 'Detalle de venta eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
