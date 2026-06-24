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
const express_1 = require("express");
const citas_controller_1 = require("./citas.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const schema = __importStar(require("./citas.schema"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Crear cita (permitir usuarios con permiso sobre Citas o reservar)
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'reservar', 'gestión de citas'), (0, validation_middleware_1.validate)(schema.createCitaSchema), citas_controller_1.crear);
// Crear cita desde landing sin login
router.post("/landing", (0, validation_middleware_1.validate)(schema.createCitaLandingSchema), citas_controller_1.crearDesdeLanding);
// Listar citas públicas (para landing)
router.get("/public", citas_controller_1.listar);
// Listar citas (permitir usuarios con permiso de ver citas)
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'ver citas', 'ver citas propias'), citas_controller_1.listar);
// Obtener horas disponibles de un barbero en una fecha (solo usuarios autenticados)
router.get("/disponibilidad/horario", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'ver citas', 'ver citas propias'), citas_controller_1.obtenerHorasDisponibles);
// Obtener horas disponibles de un barbero en una fecha desde landing sin login
router.get("/landing/disponibilidad/horario", citas_controller_1.obtenerHorasDisponibles);
// Actualizar cita completa o estado
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'editar citas', 'gestión de citas'), (0, validation_middleware_1.validate)(schema.updateCitaSchema), citas_controller_1.actualizar);
// Obtener cita por ID
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'ver citas', 'ver citas propias'), citas_controller_1.obtenerPorId);
// Eliminar cita
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeAnyPermission)('citas', 'eliminar citas', 'gestión de citas'), citas_controller_1.eliminar);
exports.default = router;
