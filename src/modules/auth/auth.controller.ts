// ===== AUTH.CONTROLLER.TS (CORREGIDO) =====
// Reemplaza el archivo auth.controller.ts en tu backend con esto

import { Request, Response } from "express";
import * as service from "./auth.service";
import { pool } from "../../config/database";
import { env } from "../../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    console.log('register req.body:', req.body);
    // ✅ AHORA CAPTURA EL CAMPO img
    const { nombre, email, password, id_tipo_documento, numero_documento, telefono, direccion, img, imagen } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: "Faltan campos requeridos: nombre, email, password" });
    }

    // ✅ AHORA PASA img AL SERVICIO
    const result = await service.register({
      nombre,
      email,
      password,
      id_rol: 3,
      id_tipo_documento: id_tipo_documento || null,
      numero_documento: numero_documento || null,
      telefono: telefono || null,
      direccion: direccion || null,
      img: img ?? imagen ?? null,
    });
    console.log('register result:', result);
    res.status(201).json({ success: true, data: result, message: "Usuario creado como cliente" });
  } catch (error: any) {
    console.error('Error in register:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email es requerido' });
    }

    const result = await service.forgotPassword(email);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos' });
    }

    const result = await service.resetPassword(token, password);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, message: 'Token es requerido' });
    }

    const result = await service.validateResetToken(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in validateResetToken:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('login req.body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y contraseña son obligatorios" });
    }

    const result = await service.login(email, password);
    console.log('login result:', result);

    // Set auth token as httpOnly cookie for cookie-based auth clients
    try {
      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: env.PORT !== '4000' ? true : false,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
      });
    } catch (cookieErr) {
      console.warn('Could not set auth cookie:', cookieErr);
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in login:', error);
    const authErrorMessages = ["Usuario no encontrado", "Contraseña incorrecta"];
    const statusCode = authErrorMessages.some(msg => error.message?.includes(msg)) ? 401 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// devuelve los permisos decodificados del token
export const getPermisos = (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const permisos = user?.permisos || [];
    console.log('getPermisos result:', permisos);
    res.json({ success: true, data: { permisos } });
  } catch (error: any) {
    console.error('Error in getPermisos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// obtener perfil del usuario autenticado
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }

    // Obtener datos completos del usuario con la imagen
    const result = await pool.request()
      .input("id", user.id_usuario)
      .query(`
        SELECT 
          id_usuario, 
          nombre, 
          email, 
          id_rol,
          img,
          telefono,
          direccion,
          estado
        FROM usuarios 
        WHERE id_usuario = @id
      `);

    const usuarioCompleto = result.recordset[0];
    if (!usuarioCompleto) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    console.log('getProfile result:', usuarioCompleto);
    res.json({ success: true, data: usuarioCompleto });
  } catch (error: any) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
