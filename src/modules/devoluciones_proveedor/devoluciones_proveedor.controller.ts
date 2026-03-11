import { Request, Response } from "express";
import * as service from "./devoluciones_proveedor.service";
import { z } from "zod";
import { createDevolucionProveedorSchema, updateDevolucionProveedorSchema, devolucionProveedorIdSchema } from "./devoluciones_proveedor.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const devoluciones = await service.getAllDevoluciones();
    res.json(devoluciones);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    const devolucion = await service.getDevolucionById(id);
    if (!devolucion) return res.status(404).json({ message: "Devolucion no encontrada" });
    res.json(devolucion);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createDevolucionProveedorSchema.parse(req.body);
    const result = await service.createDevolucion(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateDevolucionProveedorSchema.parse(req.body);
    const result = await service.updateDevolucion(id, validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionProveedorIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteDevolucion(id);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};