import { Request, Response } from "express";
import * as service from "./proveedores.service";
import { z } from "zod";
import { createProveedorSchema, updateProveedorSchema, proveedorIdSchema } from "./proveedores.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const proveedores = await service.getAllProveedores();
    res.json(proveedores);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    const proveedor = await service.getProveedorById(id);
    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.json(proveedor);
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
    const validatedData = createProveedorSchema.parse(req.body);
    const result = await service.createProveedor(validatedData);
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
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateProveedorSchema.parse(req.body);
    const result = await service.updateProveedor(id, validatedData);
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
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteProveedor(id);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};