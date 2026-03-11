import { Request, Response } from "express";
import * as service from "./consignaciones_proveedor.service";
import { z } from "zod";
import { createConsignacionSchema, updateConsignacionSchema, consignacionIdSchema } from "./consignaciones_proveedor.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const consignaciones = await service.getAllConsignaciones();
    res.json(consignaciones);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    const consignacion = await service.getConsignacionById(validatedId);
    if (!consignacion) return res.status(404).json({ message: "Consignacion no encontrada" });
    res.json(consignacion);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createConsignacionSchema.parse(req.body);
    const result = await service.createConsignacion(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    const validatedData = updateConsignacionSchema.parse(req.body);
    const result = await service.updateConsignacion(validatedId, validatedData);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = consignacionIdSchema.parse({ id });
    const result = await service.deleteConsignacion(validatedId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};