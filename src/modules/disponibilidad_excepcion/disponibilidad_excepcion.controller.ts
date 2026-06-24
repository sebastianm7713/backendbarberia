import { Request, Response } from "express";
import * as service from "./disponibilidad_excepcion.service";
import { z } from "zod";
import { createDisponibilidadSchema, updateDisponibilidadSchema, disponibilidadIdSchema } from "./disponibilidad_excepcion.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const disponibilidades = await service.getAllDisponibilidades();
    console.log('obtenerTodos result:', disponibilidades);
    res.json({ success: true, data: disponibilidades });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    const disponibilidad = await service.getDisponibilidadById(id);
    if (!disponibilidad) return res.status(404).json({ success: false, message: "Disponibilidad no encontrada" });
    console.log('obtenerPorId result:', disponibilidad);
    res.json({ success: true, data: disponibilidad });
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
    const validatedData = createDisponibilidadSchema.parse(req.body);
    const result = await service.createDisponibilidad(validatedData);
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
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateDisponibilidadSchema.parse(req.body);
    const result = await service.updateDisponibilidad(id, validatedData);
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
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteDisponibilidad(id);
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