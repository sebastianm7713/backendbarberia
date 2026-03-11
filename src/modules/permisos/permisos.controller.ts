import { Request, Response } from "express";
import * as service from "./permisos.service";
import { z } from "zod";
import { createPermisoSchema, updatePermisoSchema, permisoIdSchema } from "./permisos.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const permisos = await service.getAllPermisos();
    res.json(permisos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    const permiso = await service.getPermisoById(id);
    if (!permiso) return res.status(404).json({ message: "Permiso no encontrado" });
    res.json(permiso);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createPermisoSchema.parse(req.body);
    const result = await service.createPermiso(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updatePermisoSchema.parse(req.body);
    const result = await service.updatePermiso(id, validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deletePermiso(id);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};