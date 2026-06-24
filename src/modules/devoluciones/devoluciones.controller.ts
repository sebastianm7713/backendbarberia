import { Request, Response } from "express";
import * as service from "./devoluciones.service";
import { z } from "zod";
import {
  createDevolucionSchema,
  updateDevolucionSchema,
  devolucionIdSchema,
  productosPorProveedorSchema,
} from "./devoluciones.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const devoluciones = await service.getAllDevoluciones();
    console.log('obtenerTodos devoluciones result:', devoluciones);
    res.json({ success: true, data: devoluciones });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionIdSchema.parse({ id: parseInt(rawId) });
    const devolucion = await service.getDevolucionById(id);
    console.log('obtenerPorId devolucion result:', devolucion);
    if (!devolucion)
      return res.status(404).json({ success: false, message: "Devolucion no encontrada" });
    res.json({ success: true, data: devolucion });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const validatedData = createDevolucionSchema.parse(req.body);
    const result = await service.createDevolucion(validatedData);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateDevolucionSchema.parse(req.body);
    const result = await service.updateDevolucion(id, validatedData);
    console.log('actualizar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizar:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = devolucionIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteDevolucion(id);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const obtenerProductosPorProveedor = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id_proveedor) ? req.params.id_proveedor[0] : req.params.id_proveedor;
    const { id_proveedor } = productosPorProveedorSchema.parse({ id_proveedor: parseInt(rawId) });
    const productos = await service.getProductosPorProveedor(id_proveedor);
    console.log('obtenerProductosPorProveedor result:', productos);
    res.json({ success: true, data: productos });
  } catch (error: any) {
    console.error('Error in obtenerProductosPorProveedor:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID de proveedor inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};