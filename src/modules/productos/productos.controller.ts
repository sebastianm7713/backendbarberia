import { Request, Response } from "express";
import * as service from "./productos.service";
import { z } from "zod";
import {
  createProductoSchema,
  updateProductoSchema,
  productoIdSchema,
} from "./productos.schema";

export const listar = async (_: Request, res: Response) => {
  try {
    const productos = await service.getProductos();
    console.log('listar productos result:', productos);
    res.json({ success: true, data: productos });
  } catch (error: any) {
    console.error('Error in listar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = productoIdSchema.parse({ id });
    const producto = await service.getProductoById(validatedId);
    console.log('obtenerPorId producto result:', producto);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, data: producto });
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
    const validated = createProductoSchema.parse(req.body);
    const result = await service.createProducto(validated);
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
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = productoIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateProductoSchema.parse(req.body);
    const result = await service.updateProducto(validatedId, validatedData);
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
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = productoIdSchema.parse({ id });
    await service.deleteProducto(validatedId);
    console.log('eliminar success');
    res.json({ success: true, data: { message: "Producto eliminado correctamente" } });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};