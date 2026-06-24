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
exports.eliminar = exports.actualizar = exports.crear = exports.obtenerPorId = exports.obtenerTodos = void 0;
const service = __importStar(require("./disponibilidad_excepcion.service"));
const zod_1 = require("zod");
const disponibilidad_excepcion_schema_1 = require("./disponibilidad_excepcion.schema");
const obtenerTodos = async (req, res) => {
    try {
        const disponibilidades = await service.getAllDisponibilidades();
        console.log('obtenerTodos result:', disponibilidades);
        res.json({ success: true, data: disponibilidades });
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
        const { id } = disponibilidad_excepcion_schema_1.disponibilidadIdSchema.parse({ id: parseInt(rawId) });
        const disponibilidad = await service.getDisponibilidadById(id);
        if (!disponibilidad)
            return res.status(404).json({ success: false, message: "Disponibilidad no encontrada" });
        console.log('obtenerPorId result:', disponibilidad);
        res.json({ success: true, data: disponibilidad });
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
        const validatedData = disponibilidad_excepcion_schema_1.createDisponibilidadSchema.parse(req.body);
        const result = await service.createDisponibilidad(validatedData);
        console.log('crear result:', result);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in crear:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.crear = crear;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = disponibilidad_excepcion_schema_1.disponibilidadIdSchema.parse({ id: parseInt(rawId) });
        console.log('actualizar req.body:', req.body);
        const validatedData = disponibilidad_excepcion_schema_1.updateDisponibilidadSchema.parse(req.body);
        const result = await service.updateDisponibilidad(id, validatedData);
        console.log('actualizar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in actualizar:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.actualizar = actualizar;
const eliminar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = disponibilidad_excepcion_schema_1.disponibilidadIdSchema.parse({ id: parseInt(rawId) });
        const result = await service.deleteDisponibilidad(id);
        console.log('eliminar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in eliminar:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.eliminar = eliminar;
