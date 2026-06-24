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
exports.obtenerHorasDisponibles = exports.eliminar = exports.actualizar = exports.crearDesdeLanding = exports.crear = exports.obtenerPorId = exports.listar = void 0;
const service = __importStar(require("./citas.service"));
const listar = async (_, res) => {
    try {
        const citas = await service.listarCitas();
        console.log('listar citas result:', citas);
        res.json({ success: true, data: citas });
    }
    catch (error) {
        console.error('Error in listar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.listar = listar;
const obtenerPorId = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = Number(rawId);
        const cita = await service.obtenerCitaConVenta(id);
        console.log('obtenerPorId cita result:', cita);
        if (!cita)
            return res.status(404).json({ success: false, message: "Cita no encontrada" });
        res.json({ success: true, data: cita });
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
        const result = await service.crearCita(req.body);
        console.log('crear result:', result);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in crear:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.crear = crear;
const crearDesdeLanding = async (req, res) => {
    try {
        console.log('crearDesdeLanding req.body:', req.body);
        const result = await service.crearCita(req.body);
        console.log('crearDesdeLanding result:', result);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in crearDesdeLanding:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.crearDesdeLanding = crearDesdeLanding;
const actualizar = async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = Number(rawId);
        console.log('actualizar req.body:', req.body);
        const result = await service.actualizarCita(id, req.body);
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
        console.log('eliminar id:', id);
        const result = await service.eliminarCita(id);
        console.log('eliminar result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Error in eliminar:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.eliminar = eliminar;
const obtenerHorasDisponibles = async (req, res) => {
    try {
        const { id_barbero, fecha } = req.query;
        if (!id_barbero || !fecha) {
            return res.status(400).json({ success: false, message: "Parámetros id_barbero y fecha son requeridos" });
        }
        const barberoId = Number(id_barbero);
        const fechaStr = String(fecha);
        console.log('obtenerHorasDisponibles:', { barberoId, fechaStr });
        const horas = await service.obtenerHorasDisponibles(barberoId, fechaStr);
        console.log('horas disponibles:', horas);
        res.json({ success: true, data: horas });
    }
    catch (error) {
        console.error('Error in obtenerHorasDisponibles:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.obtenerHorasDisponibles = obtenerHorasDisponibles;
