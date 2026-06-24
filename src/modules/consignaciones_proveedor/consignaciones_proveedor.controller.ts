import { Request, Response } from "express";
import * as service from "./consignaciones_proveedor.service";
import { z } from "zod";
import { createConsignacionSchema, updateConsignacionSchema, consignacionIdSchema } from "./consignaciones_proveedor.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const consignaciones = await service.getAllConsignaciones();
    console.log('obtenerTodos result:', consignaciones);
    res.json({ success: true, data: consignaciones });
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
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    const consignacion = await service.getConsignacionById(validatedId);
    if (!consignacion) return res.status(404).json({ success: false, message: "Consignacion no encontrada" });
    console.log('obtenerPorId result:', consignacion);
    res.json({ success: true, data: consignacion });
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
    const validatedData = createConsignacionSchema.parse(req.body);
    const result = await service.createConsignacion(validatedData);
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
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateConsignacionSchema.parse(req.body);
    const result = await service.updateConsignacion(validatedId, validatedData);
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
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    const result = await service.deleteConsignacion(validatedId);
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