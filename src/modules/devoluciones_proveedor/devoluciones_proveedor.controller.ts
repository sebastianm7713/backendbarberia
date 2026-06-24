import { Request, Response } from "express";
import * as service from "./devoluciones_proveedor.service";
import { z } from "zod";
import { createDevolucionProveedorSchema, updateDevolucionProveedorSchema, devolucionProveedorIdSchema } from "./devoluciones_proveedor.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const devoluciones = await service.getAllDevoluciones();
    console.log('obtenerTodos result:', devoluciones);
    res.json({ success: true, data: devoluciones });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    const devolucion = await service.getDevolucionById(id);
    if (!devolucion) return res.status(404).json({ success: false, message: "Devolucion no encontrada" });
    console.log('obtenerPorId result:', devolucion);
    res.json({ success: true, data: devolucion });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
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
    const validatedData = createDevolucionProveedorSchema.parse(req.body);
    const result = await service.createDevolucion(validatedData);
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
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateDevolucionProveedorSchema.parse(req.body);
    const result = await service.updateDevolucion(id, validatedData);
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
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteDevolucion(id);
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