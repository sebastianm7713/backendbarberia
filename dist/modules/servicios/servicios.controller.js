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
exports.deleteServicio = exports.updateServicio = exports.createServicio = exports.getServicioById = exports.getServicios = void 0;
const service = __importStar(require("./servicios.service"));
const zod_1 = require("zod");
const servicios_schema_1 = require("./servicios.schema");
const getServicios = async (_req, res) => {
    try {
        const data = await service.getServicios();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getServicios = getServicios;
const getServicioById = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido" });
        const { id: validatedId } = servicios_schema_1.servicioIdSchema.parse({ id });
        const servicio = await service.getServicioById(validatedId);
        if (!servicio)
            return res.status(404).json({ message: "Servicio no encontrado" });
        res.json(servicio);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.getServicioById = getServicioById;
const createServicio = async (req, res) => {
    try {
        const validated = servicios_schema_1.createServicioSchema.parse(req.body);
        const data = await service.createServicio(validated);
        res.status(201).json({ message: "Servicio creado", data });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.createServicio = createServicio;
const updateServicio = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido" });
        const { id: validatedId } = servicios_schema_1.servicioIdSchema.parse({ id });
        const validated = servicios_schema_1.updateServicioSchema.parse(req.body);
        const data = await service.updateServicio(validatedId, validated);
        res.json({ message: "Servicio actualizado", data });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: "Datos inválidos", errors: error.issues });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.updateServicio = updateServicio;
const deleteServicio = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ message: "ID inválido" });
        const { id: validatedId } = servicios_schema_1.servicioIdSchema.parse({ id });
        await service.deleteServicio(validatedId);
        res.json({ message: "Servicio eliminado" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.deleteServicio = deleteServicio;
