"use strict";
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
exports.eliminarUsuario = exports.actualizarUsuario = exports.crearUsuario = exports.obtenerUsuarioPorId = exports.getUsuarios = void 0;
const service = __importStar(require("./usuarios.service"));
const zod_1 = require("zod");
const usuarios_schema_1 = require("./usuarios.schema");
const getUsuarios = async (req, res) => {
    try {
        const data = await service.getUsuarios();
        console.log('getUsuarios result:', data);
        res.json({ success: true, data });
    }
    catch (error) {
        console.error('Error in getUsuarios:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUsuarios = getUsuarios;
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = usuarios_schema_1.usuarioIdSchema.parse({ id });
        const usuario = await service.getUsuarioById(validatedId);
        console.log('obtenerUsuarioPorId result:', usuario);
        if (!usuario)
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        res.json({ success: true, data: usuario });
    }
    catch (error) {
        console.error('Error in obtenerUsuarioPorId:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
const crearUsuario = async (req, res) => {
    try {
        console.log('crearUsuario req.body:', req.body);
        const validated = usuarios_schema_1.createUsuarioSchema.parse(req.body);
        const result = await service.crearUsuario(validated);
        console.log('crearUsuario result:', result);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in crearUsuario:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else if (error.message?.includes('no existe')) {
            res.status(400).json({ success: false, message: error.message });
        }
        else if (error.message?.includes('Ya existe')) {
            res.status(409).json({ success: false, message: error.message });
        }
        else if (error.message?.includes('Error al crear registro de cliente')) {
            res.status(400).json({ success: false, message: error.message });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.crearUsuario = crearUsuario;
const actualizarUsuario = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = usuarios_schema_1.usuarioIdSchema.parse({ id });
        console.log('actualizarUsuario req.body:', req.body);
        const validatedData = usuarios_schema_1.updateUsuarioSchema.parse(req.body);
        const result = await service.updateUsuario(validatedId, validatedData);
        console.log('actualizarUsuario result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in actualizarUsuario:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.actualizarUsuario = actualizarUsuario;
const eliminarUsuario = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = usuarios_schema_1.usuarioIdSchema.parse({ id });
        const result = await service.deleteUsuario(validatedId);
        console.log('eliminarUsuario result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in eliminarUsuario:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.eliminarUsuario = eliminarUsuario;
