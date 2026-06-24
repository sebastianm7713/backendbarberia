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
const service = __importStar(require("./ventas.service"));
const obtenerTodos = async (_, res) => {
    try {
        const ventas = await service.getVentas();
        console.log('obtenerTodos ventas result:', ventas);
        res.json({ success: true, data: ventas });
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
        const id = Number(rawId);
        const venta = await service.getVentaById(id);
        console.log('obtenerPorId venta result:', venta);
        if (!venta)
            return res.status(404).json({ success: false, message: "Venta no encontrada" });
        res.json({ success: true, data: venta });
    }
    catch (error) {
        console.error('Error in obtenerPorId:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.obtenerPorId = obtenerPorId;
const crear = async (req, res) => {
    try {
        console.log('crear req.body:', req.body);
        const result = await service.crearVenta(req.body);
        console.log('crear result:', result);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in crear:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.crear = crear;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = Number(rawId);
        console.log('actualizar req.body:', req.body);
        const result = await service.updateVenta(id, req.body);
        console.log('actualizar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in actualizar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.actualizar = actualizar;
const eliminar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = Number(rawId);
        const result = await service.deleteVenta(id);
        console.log('eliminar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in eliminar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.eliminar = eliminar;
