import { Request, Response } from "express";
import * as service from "./roles.service";
import { z } from "zod";
import { createRolSchema, updateRolSchema, rolIdSchema } from "./roles.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const roles = await service.getAllRoles();
    console.log('obtenerTodos roles result:', roles);
    res.json({ success: true, data: roles });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
    const rol = await service.getRolById(id);
    console.log('obtenerPorId rol result:', rol);
    if (!rol) {
      return res.status(404).json({ success: false, message: "Rol no encontrado" });
    }
    res.json({ success: true, data: rol });
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
    
    const validatedData = createRolSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    
    const result = await service.createRol(validatedData);
    console.log('Service result:', result);
    
    res.status(201).json({ 
      success: true, 
      data: result 
    });
  } catch (error: any) {
    console.error('Error in crear:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false, 
        message: "Datos inválidos", 
        errors: error.issues 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error al crear el rol' 
      });
    }
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
      console.log('🔵 actualizar rol ID:', id);
      console.log('📋 actualizar req.body:', JSON.stringify(req.body, null, 2));
    const validatedData = updateRolSchema.parse(req.body);
      console.log('✅ Validated data:', JSON.stringify(validatedData, null, 2));
      const result = await service.updateRol(id, validatedData);
      console.log('✅ actualizar result permisos guardados:', result.permisos?.length || 0, 'permisos:', result.permisos?.map((p: any) => p.nombre));
    res.json({ success: true, data: result });
  } catch (error: any) {
      console.error('❌ Error in actualizar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const actualizarEstado = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });

    const { estado } = z.object({ estado: z.enum(['activo', 'inactivo']) }).parse(req.body);

    const result = await service.updateRolEstado(id, estado);

    console.log('actualizarEstado result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizarEstado:', error);
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
    const { id } = rolIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteRol(id);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else if (error.message?.includes('no existe')) {
      res.status(404).json({ success: false, message: error.message });
    } else if (error.message?.includes('usuarios asignado') || error.message?.includes('No se puede eliminar')) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};