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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.validateResetToken = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
const repo = __importStar(require("./auth.repository"));
const mailer_1 = require("../../utils/mailer");
const register = async (data) => {
    return repo.createUser(data);
};
exports.register = register;
const login = async (email, password) => {
    const user = await repo.findUserByEmail(email);
    if (!user)
        throw new Error("Usuario no encontrado");
    let valid = false;
    if (typeof user.password === "string" && user.password.startsWith("$2")) {
        valid = await bcrypt_1.default.compare(password, user.password);
    }
    else {
        valid = user.password === password;
    }
    if (!valid)
        throw new Error("Contraseña incorrecta");
    const permisos = await repo.getPermisosByRol(user.rol_id);
    const rolName = await repo.getRolNameById(user.rol_id);
    console.log('🔵 Login para usuario:', user.email, 'rol_id:', user.rol_id);
    console.log('📋 Permisos cargados de BD:', permisos);
    const payload = {
        id: user.id_usuario,
        rol: user.rol_id,
        rol_nombre: rolName,
        nombre_rol: rolName,
        permisos,
    };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: "8h" });
    return {
        token,
        user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            id_rol: user.rol_id,
            nombre_rol: rolName,
            permisos,
            img: user.img ?? null,
            telefono: user.telefono ?? null,
            direccion: user.direccion ?? null,
            estado: user.estado ?? null,
        },
    };
};
exports.login = login;
const forgotPassword = async (email) => {
    const user = await repo.findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora
    await repo.createPasswordResetToken(user.id_usuario, token, expiresAt);
    const emailResult = await (0, mailer_1.sendPasswordResetEmail)(user.email, token);
    return {
        message: 'Token de recuperación generado',
        emailSent: emailResult.smtpConfigured,
        resetUrl: emailResult.smtpConfigured ? undefined : emailResult.resetUrl,
    };
};
exports.forgotPassword = forgotPassword;
const validateResetToken = async (token) => {
    const resetToken = await repo.findResetToken(token);
    if (!resetToken) {
        throw new Error('Token inválido');
    }
    if (resetToken.used) {
        throw new Error('Token ya fue usado');
    }
    if (new Date(resetToken.expires_at) < new Date()) {
        throw new Error('Token expirado');
    }
    return {
        valid: true,
        expiresAt: resetToken.expires_at,
    };
};
exports.validateResetToken = validateResetToken;
const resetPassword = async (token, password) => {
    const resetToken = await repo.findResetToken(token);
    if (!resetToken || resetToken.used) {
        throw new Error('Token inválido o ya usado');
    }
    if (new Date(resetToken.expires_at) < new Date()) {
        throw new Error('Token expirado');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await repo.updatePassword(resetToken.id_usuario, hashedPassword);
    await repo.markResetTokenUsed(token);
    return { message: 'Contraseña restablecida correctamente' };
};
exports.resetPassword = resetPassword;
