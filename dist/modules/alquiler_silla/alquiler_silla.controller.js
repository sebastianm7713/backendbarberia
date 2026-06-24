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
const service = __importStar(require("./alquiler_silla.service"));
const zod_1 = require("zod");
const alquiler_silla_schema_1 = require("./alquiler_silla.schema");
const obtenerTodos = async (req, res) => {
    try {
        const alquileres = await service.getAllAlquileres();
        console.log('obtenerTodos result:', alquileres);
        res.json({ success: true, data: alquileres });
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
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }
        const { id: validatedId } = alquiler_silla_schema_1.alquilerIdSchema.parse({ id });
        const alquiler = await service.getAlquilerById(validatedId);
        if (!alquiler)
            return res.status(404).json({ success: false, message: "Alquiler no encontrado" });
        console.log('obtenerPorId result:', alquiler);
        res.json({ success: true, data: alquiler });
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
        const validatedData = alquiler_silla_schema_1.createAlquilerSchema.parse(req.body);
        const result = await service.createAlquiler(validatedData);
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
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }
        const { id: validatedId } = alquiler_silla_schema_1.alquilerIdSchema.parse({ id });
        console.log('actualizar req.body:', req.body);
        const validatedData = alquiler_silla_schema_1.updateAlquilerSchema.parse(req.body);
        const result = await service.updateAlquiler(validatedId, validatedData);
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
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }
        const { id: validatedId } = alquiler_silla_schema_1.alquilerIdSchema.parse({ id });
        const result = await service.deleteAlquiler(validatedId);
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
