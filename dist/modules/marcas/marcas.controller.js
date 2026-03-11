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
const service = __importStar(require("./marcas.service"));
const zod_1 = require("zod");
const marcas_schema_1 = require("./marcas.schema");
const obtenerTodos = async (req, res) => {
    try {
        const marcas = await service.getAllMarcas();
        res.json(marcas);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.obtenerTodos = obtenerTodos;
const obtenerPorId = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = marcas_schema_1.marcaIdSchema.parse({ id: parseInt(rawId) });
        const marca = await service.getMarcaById(id);
        if (!marca)
            return res.status(404).json({ message: "Marca no encontrada" });
        res.json(marca);
    }
    catch (error) {
        res.status(error instanceof zod_1.z.ZodError ? 400 : 500).json({ message: error.message });
    }
};
exports.obtenerPorId = obtenerPorId;
const crear = async (req, res) => {
    try {
        const validatedData = marcas_schema_1.createMarcaSchema.parse(req.body);
        const result = await service.createMarca(validatedData);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(error instanceof zod_1.z.ZodError ? 400 : 500).json({ message: error.message });
    }
};
exports.crear = crear;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = marcas_schema_1.marcaIdSchema.parse({ id: parseInt(rawId) });
        const validatedData = marcas_schema_1.updateMarcaSchema.parse(req.body);
        const result = await service.updateMarca(id, validatedData);
        res.json(result);
    }
    catch (error) {
        res.status(error instanceof zod_1.z.ZodError ? 400 : 500).json({ message: error.message });
    }
};
exports.actualizar = actualizar;
const eliminar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { id } = marcas_schema_1.marcaIdSchema.parse({ id: parseInt(rawId) });
        const result = await service.deleteMarca(id);
        res.json(result);
    }
    catch (error) {
        res.status(error instanceof zod_1.z.ZodError ? 400 : 500).json({ message: error.message });
    }
};
exports.eliminar = eliminar;
