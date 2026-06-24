import { Request, Response } from "express";
import * as service from "./detalle_compra.service";
import { z } from "zod";
import { createDetalleCompraSchema, updateDetalleCompraSchema, detalleIdSchema } from "./detalle_compra.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const detalles = await service.getAllDetalleCompras();
    console.log('obtenerTodos detalles result:', detalles);
    res.json({ success: true, data: detalles });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = detalleIdSchema.parse({ id });
    const detalle = await service.getDetalleCompraById(validatedId);
    console.log('obtenerPorId detalle result:', detalle);
    if (!detalle) {
      return res.status(404).json({ success: false, message: "Detalle no encontrado" });
    }
    res.json({ success: true, data: detalle });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const obtenerPorCompra = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = detalleIdSchema.parse({ id });
    const detalles = await service.getDetallesPorCompra(validatedId);
    console.log('obtenerPorCompra detalles result:', detalles);
    res.json({ success: true, data: detalles });
  } catch (error: any) {
    console.error('Error in obtenerPorCompra:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const validatedData = createDetalleCompraSchema.parse(req.body);
    const result = await service.crearDetalleCompra(validatedData);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = detalleIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateDetalleCompraSchema.parse(req.body);
    const result = await service.updateDetalleCompra(validatedId, validatedData);
    console.log('actualizar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = detalleIdSchema.parse({ id });
    const result = await service.deleteDetalleCompra(validatedId);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};