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
exports.eliminarFactura = exports.crearFactura = exports.getFactura = exports.getFacturas = void 0;
const service = __importStar(require("./facturas.service"));
const repository = __importStar(require("./facturas.repository"));
const getFacturas = async (req, res) => {
    const data = await repository.getFacturas();
    res.json(data);
};
exports.getFacturas = getFacturas;
const getFactura = async (req, res) => {
    const { id } = req.params;
    const factura = await repository.getFacturaById(Number(id));
    if (!factura)
        return res.status(404).json({ message: "Factura no encontrada" });
    res.json(factura);
};
exports.getFactura = getFactura;
const crearFactura = async (req, res) => {
    await service.crearFactura(req.body);
    res.json({ message: "Factura creada" });
};
exports.crearFactura = crearFactura;
const eliminarFactura = async (req, res) => {
    const { id } = req.params;
    await repository.deleteFactura(Number(id));
    res.json({ message: "Factura eliminada" });
};
exports.eliminarFactura = eliminarFactura;
