import { Request, Response } from "express";
import * as service from "./compras.service";
import { z } from "zod";
import { createCompraSchema, updateCompraSchema, compraIdSchema } from "./compras.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const compras = await service.getAllCompras();
    console.log('obtenerTodos compras result:', compras);
    res.json({ success: true, data: compras });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorEstado = async (req: Request, res: Response) => {
  try {
    const estado = Array.isArray(req.params.estado) ? req.params.estado[0] : req.params.estado;
    const compras = await service.getComprasByEstado(estado);
    console.log('obtenerPorEstado compras result:', compras);
    res.json({ success: true, data: compras });
  } catch (error: any) {
    console.error('Error in obtenerPorEstado:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = compraIdSchema.parse({ id });
    const compra = await service.getCompraById(validatedId);
    console.log('obtenerPorId compra result:', compra);
    if (!compra) {
      return res.status(404).json({ success: false, message: "Compra no encontrada" });
    }
    res.json({ success: true, data: compra });
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
    const validatedData = createCompraSchema.parse(req.body);
    const result = await service.crearCompra(validatedData);
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
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = compraIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateCompraSchema.parse(req.body);
    const result = await service.updateCompra(validatedId, validatedData);
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
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = compraIdSchema.parse({ id });
    const result = await service.deleteCompra(validatedId);
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