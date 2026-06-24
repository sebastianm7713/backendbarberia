import { Request, Response } from "express";
import * as service from "./permisos.service";
import { z } from "zod";
import { createPermisoSchema, updatePermisoSchema, permisoIdSchema } from "./permisos.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const permisos = await service.getAllPermisos();
    console.log('obtenerTodos result:', permisos);
    res.json({ success: true, data: permisos });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPermisosEstructurados = async (req: Request, res: Response) => {
  try {
    const permisos = await service.getPermisosTree();
    console.log('obtenerPermisosEstructurados result:', permisos);
    res.json({ success: true, data: permisos });
  } catch (error: any) {
    console.error('Error in obtenerPermisosEstructurados:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedPermisosDefault = async (req: Request, res: Response) => {
  try {
    const inserted = await service.seedDefaultPermisos();
    console.log('seedPermisosDefault result:', inserted);
    res.status(201).json({ success: true, data: inserted });
  } catch (error: any) {
    console.error('Error in seedPermisosDefault:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    const permiso = await service.getPermisoById(id);
    if (!permiso) return res.status(404).json({ success: false, message: "Permiso no encontrado" });
    console.log('obtenerPorId result:', permiso);
    res.json({ success: true, data: permiso });
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
    const validatedData = createPermisoSchema.parse(req.body);
    const result = await service.createPermiso(validatedData);
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
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updatePermisoSchema.parse(req.body);
    const result = await service.updatePermiso(id, validatedData);
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
    const { id } = permisoIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deletePermiso(id);
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