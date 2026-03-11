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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
const repo = __importStar(require("./auth.repository"));
const register = async (data) => {
    return repo.createUser(data);
};
exports.register = register;
const login = async (email, password) => {
    const user = await repo.findUserByEmail(email);
    if (!user)
        throw new Error("Usuario no encontrado");
    const valid = await bcrypt_1.default.compare(password, user.password);
    if (!valid)
        throw new Error("Contraseña incorrecta");
    // traer permisos del rol
    const permisos = await repo.getPermisosByRol(user.rol_id);
    const payload = { id: user.id_usuario, rol: user.rol_id, permisos };
    const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: "8h" });
    return {
        token,
        user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            id_rol: user.rol_id,
            permisos,
        },
    };
};
exports.login = login;
