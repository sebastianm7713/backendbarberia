import { Request, Response } from "express";
import * as service from "./proveedores.service";
import { z } from "zod";
import { createProveedorSchema, updateProveedorSchema, proveedorIdSchema } from "./proveedores.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const proveedores = await service.getAllProveedores();
    console.log('obtenerTodos proveedores result:', proveedores);
    res.json({ success: true, data: proveedores });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    const proveedor = await service.getProveedorById(id);
    console.log('obtenerPorId proveedor result:', proveedor);
    if (!proveedor) {
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }
    res.json({ success: true, data: proveedor });
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
    const validatedData = createProveedorSchema.parse(req.body);
    const result = await service.createProveedor(validatedData);
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
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateProveedorSchema.parse(req.body);
    const result = await service.updateProveedor(id, validatedData);
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
    const { id } = proveedorIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteProveedor(id);
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