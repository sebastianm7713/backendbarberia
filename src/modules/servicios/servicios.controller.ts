import { Request, Response } from "express";
import * as service from "./servicios.service";
import { z } from "zod";
import {
  createServicioSchema,
  updateServicioSchema,
  servicioIdSchema,
} from "./servicios.schema";

export const getServicios = async (_req: Request, res: Response) => {
  try {
    const data = await service.getServicios();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
    const { id: validatedId } = servicioIdSchema.parse({ id });
    const servicio = await service.getServicioById(validatedId);
    if (!servicio) return res.status(404).json({ message: "Servicio no encontrado" });
    res.json(servicio);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const createServicio = async (req: Request, res: Response) => {
  try {
    const validated = createServicioSchema.parse(req.body);
    const data = await service.createServicio(validated);
    res.status(201).json({ message: "Servicio creado", data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateServicio = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
    const { id: validatedId } = servicioIdSchema.parse({ id });
    const validated = updateServicioSchema.parse(req.body);
    const data = await service.updateServicio(validatedId, validated);
    res.json({ message: "Servicio actualizado", data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteServicio = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });
    const { id: validatedId } = servicioIdSchema.parse({ id });
    await service.deleteServicio(validatedId);
    res.json({ message: "Servicio eliminado" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};