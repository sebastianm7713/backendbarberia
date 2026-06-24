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
const serviciosService = __importStar(require("./services.service"));
const zod_1 = require("zod");
const services_schema_1 = require("./services.schema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// public read endpoints
router.get("/", async (_req, res) => {
    try {
        const data = await serviciosService.getServicios();
        console.log('obtenerTodos servicios result:', data);
        res.json({ success: true, data });
    }
    catch (error) {
        console.error('Error in obtenerTodos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = services_schema_1.servicioIdSchema.parse({ id });
        const servicio = await serviciosService.getServicioById(validatedId);
        console.log('obtenerPorId servicio result:', servicio);
        if (!servicio)
            return res.status(404).json({ success: false, message: "Servicio no encontrado" });
        res.json({ success: true, data: servicio });
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
});
// admin modifications
router.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), async (req, res) => {
    try {
        console.log('crear req.body:', req.body);
        const validated = services_schema_1.createServicioSchema.parse(req.body);
        const data = await serviciosService.createServicio(validated);
        console.log('crear result:', data);
        res.status(201).json({ success: true, data, message: "Servicio creado" });
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
});
router.put("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = services_schema_1.servicioIdSchema.parse({ id });
        console.log('actualizar req.body:', req.body);
        const validatedData = services_schema_1.updateServicioSchema.parse(req.body);
        const result = await serviciosService.updateServicio(validatedId, validatedData);
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
});
router.delete("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), async (req, res) => {
    try {
        const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const id = parseInt(rawId);
        if (isNaN(id))
            return res.status(400).json({ success: false, message: "ID inválido" });
        const { id: validatedId } = services_schema_1.servicioIdSchema.parse({ id });
        const result = await serviciosService.deleteServicio(validatedId);
        console.log('deleteServicio result:', result);
        res.json({ success: true, data: result });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
        }
        else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});
exports.default = router;
