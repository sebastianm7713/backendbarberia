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
exports.eliminar = exports.actualizarEstado = exports.actualizar = exports.crear = exports.obtenerPorId = exports.obtenerTodos = void 0;
const service = __importStar(require("./roles.service"));
const zod_1 = require("zod");
const roles_schema_1 = require("./roles.schema");
const obtenerTodos = async (req, res) => {
    try {
        const roles = await service.getAllRoles();
        console.log('obtenerTodos roles result:', roles);
        res.json({ success: true, data: roles });
    }
    catch (error) {
        console.error('Error in obtenerTodos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.obtenerTodos = obtenerTodos;
const obtenerPorId = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = roles_schema_1.rolIdSchema.parse({ id: parseInt(rawId) });
        const rol = await service.getRolById(id);
        console.log('obtenerPorId rol result:', rol);
        if (!rol) {
            return res.status(404).json({ success: false, message: "Rol no encontrado" });
        }
        res.json({ success: true, data: rol });
    }
    catch (error) {
        console.error('Error in obtenerPorId:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.obtenerPorId = obtenerPorId;
const crear = async (req, res) => {
    try {
        console.log('crear req.body:', req.body);
        const validatedData = roles_schema_1.createRolSchema.parse(req.body);
        console.log('Validated data:', validatedData);
        const result = await service.createRol(validatedData);
        console.log('Service result:', result);
        res.status(201).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Error in crear:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errors: error.issues
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear el rol'
            });
        }
    }
};
exports.crear = crear;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = roles_schema_1.rolIdSchema.parse({ id: parseInt(rawId) });
        console.log('🔵 actualizar rol ID:', id);
        console.log('📋 actualizar req.body:', JSON.stringify(req.body, null, 2));
        const validatedData = roles_schema_1.updateRolSchema.parse(req.body);
        console.log('✅ Validated data:', JSON.stringify(validatedData, null, 2));
        const result = await service.updateRol(id, validatedData);
        console.log('✅ actualizar result permisos guardados:', result.permisos?.length || 0, 'permisos:', result.permisos?.map((p) => p.nombre));
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('❌ Error in actualizar:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.actualizar = actualizar;
const actualizarEstado = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = roles_schema_1.rolIdSchema.parse({ id: parseInt(rawId) });
        const { estado } = zod_1.z.object({ estado: zod_1.z.enum(['activo', 'inactivo']) }).parse(req.body);
        const result = await service.updateRolEstado(id, estado);
        console.log('actualizarEstado result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in actualizarEstado:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.actualizarEstado = actualizarEstado;
const eliminar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = roles_schema_1.rolIdSchema.parse({ id: parseInt(rawId) });
        const result = await service.deleteRol(id);
        console.log('eliminar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in eliminar:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else if (error.message?.includes('no existe')) {
            res.status(404).json({ success: false, message: error.message });
        }
        else if (error.message?.includes('usuarios asignado') || error.message?.includes('No se puede eliminar')) {
            res.status(400).json({ success: false, message: error.message });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.eliminar = eliminar;
