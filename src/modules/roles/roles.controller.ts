import { Request, Response } from "express";
import * as service from "./roles.service";
import { z } from "zod";
import { createRolSchema, updateRolSchema, rolIdSchema } from "./roles.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const roles = await service.getAllRoles();
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
    const rol = await service.getRolById(id);
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createRolSchema.parse(req.body);
    const result = await service.createRol(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateRolSchema.parse(req.body);
    const result = await service.updateRol(id, validatedData);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteRol(id);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};