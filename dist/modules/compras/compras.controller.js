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
exports.eliminar = exports.actualizar = exports.obtenerPorId = exports.obtenerTodos = exports.crear = void 0;
const service = __importStar(require("./compras.service"));
const zod_1 = require("zod");
const compras_schema_1 = require("./compras.schema");
const crear = async (req, res) => {
    try {
        const validatedData = compras_schema_1.createCompraSchema.parse(req.body);
        const result = await service.crearCompra(validatedData);
        res.status(201).json(result);
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
exports.crear = crear;
const obtenerTodos = async (req, res) => {
    try {
        const compras = await service.getAllCompras();
        res.json(compras);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.obtenerTodos = obtenerTodos;
const obtenerPorId = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const { id: validatedId } = compras_schema_1.compraIdSchema.parse({ id });
        const compra = await service.getCompraById(validatedId);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        res.json(compra);
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
exports.obtenerPorId = obtenerPorId;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const { id: validatedId } = compras_schema_1.compraIdSchema.parse({ id });
        const validatedData = compras_schema_1.updateCompraSchema.parse(req.body);
        const result = await service.updateCompra(validatedId, validatedData);
        res.json(result);
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
exports.actualizar = actualizar;
const eliminar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        const { id: validatedId } = compras_schema_1.compraIdSchema.parse({ id });
        const result = await service.deleteCompra(validatedId);
        res.json(result);
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
exports.eliminar = eliminar;
