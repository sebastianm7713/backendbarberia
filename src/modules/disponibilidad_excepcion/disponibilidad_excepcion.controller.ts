import { Request, Response } from "express";
import * as service from "./disponibilidad_excepcion.service";
import { z } from "zod";
import { createDisponibilidadSchema, updateDisponibilidadSchema, disponibilidadIdSchema } from "./disponibilidad_excepcion.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const disponibilidades = await service.getAllDisponibilidades();
    res.json(disponibilidades);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    const disponibilidad = await service.getDisponibilidadById(id);
    if (!disponibilidad) return res.status(404).json({ message: "Disponibilidad no encontrada" });
    res.json(disponibilidad);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createDisponibilidadSchema.parse(req.body);
    const result = await service.createDisponibilidad(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateDisponibilidadSchema.parse(req.body);
    const result = await service.updateDisponibilidad(id, validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = disponibilidadIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteDisponibilidad(id);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};