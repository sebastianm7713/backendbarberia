import { Request, Response } from "express";
import * as service from "./usuarios.service";
import { z } from "zod";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  usuarioIdSchema,
} from "./usuarios.schema";

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const data = await service.getUsuarios();
    console.log('getUsuarios result:', data);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in getUsuarios:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = usuarioIdSchema.parse({ id });
    const usuario = await service.getUsuarioById(validatedId);
    console.log('obtenerUsuarioPorId result:', usuario);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, data: usuario });
  } catch (error: any) {
    console.error('Error in obtenerUsuarioPorId:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    console.log('crearUsuario req.body:', req.body);
    const validated = createUsuarioSchema.parse(req.body);
    const result = await service.crearUsuario(validated);
    console.log('crearUsuario result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crearUsuario:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else if (error.message?.includes('no existe')) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.message?.includes('Ya existe')) {
      res.status(409).json({ success: false, message: error.message });
    } else if (error.message?.includes('Error al crear registro de cliente')) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = usuarioIdSchema.parse({ id });
    console.log('actualizarUsuario req.body:', req.body);
    const validatedData = updateUsuarioSchema.parse(req.body);
    const result = await service.updateUsuario(validatedId, validatedData);
    console.log('actualizarUsuario result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizarUsuario:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });
    const { id: validatedId } = usuarioIdSchema.parse({ id });
    const result = await service.deleteUsuario(validatedId);
    console.log('eliminarUsuario result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminarUsuario:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};