"use strict";
// ===== AUTH.CONTROLLER.TS (CORREGIDO) =====
// Reemplaza el archivo auth.controller.ts en tu backend con esto
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getPermisos = exports.login = exports.validateResetToken = exports.resetPassword = exports.forgotPassword = exports.register = void 0;
const service = __importStar(require("./auth.service"));
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
const register = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email es requerido' });
        }
        const result = await service.forgotPassword(email);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token y nueva contraseña son requeridos' });
        }
        const result = await service.resetPassword(token, password);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.resetPassword = resetPassword;
const validateResetToken = async (req, res) => {
    try {
        const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ success: false, message: 'Token es requerido' });
        }
        const result = await service.validateResetToken(token);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in validateResetToken:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.validateResetToken = validateResetToken;
const login = async (req, res) => {
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
                secure: env_1.env.PORT !== '4000' ? true : false,
                sameSite: 'lax',
                maxAge: 8 * 60 * 60 * 1000, // 8 hours
            });
        }
        catch (cookieErr) {
            console.warn('Could not set auth cookie:', cookieErr);
        }
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in login:', error);
        const authErrorMessages = ["Usuario no encontrado", "Contraseña incorrecta"];
        const statusCode = authErrorMessages.some(msg => error.message?.includes(msg)) ? 401 : 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};
exports.login = login;
// devuelve los permisos decodificados del token
const getPermisos = (req, res) => {
    try {
        const user = req.user;
        const permisos = user?.permisos || [];
        console.log('getPermisos result:', permisos);
        res.json({ success: true, data: { permisos } });
    }
    catch (error) {
        console.error('Error in getPermisos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPermisos = getPermisos;
// obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Usuario no autenticado" });
        }
        // Obtener datos completos del usuario con la imagen
        const result = await database_1.pool.request()
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
    }
    catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProfile = getProfile;
