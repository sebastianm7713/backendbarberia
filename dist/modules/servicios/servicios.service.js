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
exports.deleteServicio = exports.updateServicio = exports.getServicioById = exports.createServicio = exports.getServicios = void 0;
const serviciosRepository = __importStar(require("./servicios.repository"));
const getServicios = async () => {
    const servicios = await serviciosRepository.getServicios();
    return servicios.map((servicio) => ({
        ...servicio,
        img: servicio.imagen ?? servicio.img ?? null,
    }));
};
exports.getServicios = getServicios;
const createServicio = async (data) => {
    const { imagen, img } = data;
    const servicioCreado = await serviciosRepository.createServicio(data);
    const imagenValue = imagen ?? img;
    return {
        id_servicio: servicioCreado.id_servicio,
        ...data,
        imagen: imagenValue,
        img: imagenValue,
    };
};
exports.createServicio = createServicio;
const getServicioById = async (id) => {
    const servicio = await serviciosRepository.getServicioById(id);
    if (!servicio)
        return servicio;
    const imagenValue = servicio.imagen ?? servicio.img ?? null;
    return { ...servicio, img: imagenValue };
};
exports.getServicioById = getServicioById;
const updateServicio = async (id, data) => {
    const servicioActualizado = await serviciosRepository.updateServicio(id, data);
    if (!servicioActualizado)
        return servicioActualizado;
    const imagenValue = servicioActualizado.imagen ?? servicioActualizado.img ?? null;
    return { ...servicioActualizado, img: imagenValue };
};
exports.updateServicio = updateServicio;
const deleteServicio = async (id) => {
    return await serviciosRepository.deleteServicio(id);
};
exports.deleteServicio = deleteServicio;
