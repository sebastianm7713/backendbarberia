"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const auth_repository_1 = require("../modules/auth/auth.repository");
const normalizeRoleValue = (value) => {
    if (value == null)
        return null;
    const normalized = String(value).trim().toLowerCase();
    if (!Number.isNaN(Number(normalized)))
        return Number(normalized);
    if (['admin', 'administrador', 'administrator', 'adm'].includes(normalized))
        return 1;
    if (['barbero', 'barber'].includes(normalized))
        return 2;
    if (['cliente', 'client'].includes(normalized))
        return 3;
    if (['empleado', 'employee'].includes(normalized))
        return 4;
    if (['gerente', 'manager'].includes(normalized))
        return 5;
    return null;
};
const verifyToken = async (req, res, next) => {
    const headerToken = req.headers.authorization?.split(" ")[1]?.trim();
    const cookieToken = req.cookies?.authToken;
    const token = headerToken || cookieToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "No autorizado" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // Log token and payload for debugging
        console.log('verifyToken headerToken present:', !!headerToken, 'cookieToken present:', !!cookieToken);
        console.log('verifyToken decoded payload:', decoded);
        const normalizedRole = normalizeRoleValue(decoded.rol ?? decoded.role ?? decoded.id_rol ?? decoded.rol_nombre ?? decoded.nombre_rol ?? null);
        const roleId = decoded.rol ?? decoded.role ?? decoded.id_rol ?? null;
        const permisosFromPayload = Array.isArray(decoded.permisos)
            ? decoded.permisos
            : typeof decoded.permisos === 'string'
                ? [decoded.permisos]
                : Array.isArray(decoded.permissions)
                    ? decoded.permissions
                    : typeof decoded.permissions === 'string'
                        ? [decoded.permissions]
                        : [];
        const latestPermisos = roleId ? await (0, auth_repository_1.getPermisosByRol)(Number(roleId)) : permisosFromPayload;
        const normalizedUser = {
            ...decoded,
            id_usuario: decoded.id_usuario ?? decoded.id ?? decoded.userId ?? null,
            rol: normalizedRole ?? decoded.rol ?? decoded.role ?? decoded.id_rol ?? null,
            role: decoded.role ?? decoded.rol ?? decoded.id_rol ?? null,
            id_rol: decoded.rol ?? decoded.role ?? decoded.id_rol ?? null,
            rol_nombre: decoded.rol_nombre ?? decoded.nombre_rol ?? null,
            nombre_rol: decoded.nombre_rol ?? decoded.rol_nombre ?? null,
            permisos: latestPermisos,
        };
        req.user = normalizedUser;
        next();
    }
    catch (err) {
        console.error('verifyToken error:', err?.message ?? err);
        return res.status(401).json({ success: false, message: "Token inválido" });
    }
};
exports.verifyToken = verifyToken;
