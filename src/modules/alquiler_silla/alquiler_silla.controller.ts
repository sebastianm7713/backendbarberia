import { Request, Response } from "express";
import * as service from "./alquiler_silla.service";
import { z } from "zod";
import { createAlquilerSchema, updateAlquilerSchema, alquilerIdSchema } from "./alquiler_silla.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const alquileres = await service.getAllAlquileres();
    res.json(alquileres);
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
    const { id: validatedId } = alquilerIdSchema.parse({ id });
    const alquiler = await service.getAlquilerById(validatedId);
    if (!alquiler) return res.status(404).json({ message: "Alquiler no encontrado" });
    res.json(alquiler);
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
    const validatedData = createAlquilerSchema.parse(req.body);
    const result = await service.createAlquiler(validatedData);
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
    const { id: validatedId } = alquilerIdSchema.parse({ id });
    const validatedData = updateAlquilerSchema.parse(req.body);
    const result = await service.updateAlquiler(validatedId, validatedData);
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
    const { id: validatedId } = alquilerIdSchema.parse({ id });
    const result = await service.deleteAlquiler(validatedId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};