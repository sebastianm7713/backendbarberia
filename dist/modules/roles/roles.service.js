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
exports.deleteRol = exports.updateRolEstado = exports.updateRol = exports.createRol = exports.getRolById = exports.getAllRoles = void 0;
const repository = __importStar(require("./roles.repository"));
const getAllRoles = async () => {
    return await repository.getAllRoles();
};
exports.getAllRoles = getAllRoles;
const getRolById = async (id) => {
    return await repository.getRolById(id);
};
exports.getRolById = getRolById;
const createRol = async (data) => {
    console.log('Service createRol called with:', data);
    const result = await repository.createRol(data);
    console.log('Repository returned:', result);
    return result;
};
exports.createRol = createRol;
const updateRol = async (id, data) => {
    const result = await repository.updateRol(id, data);
    return result;
};
exports.updateRol = updateRol;
const updateRolEstado = async (id, estado) => {
    const result = await repository.updateRol(id, { estado });
    return result;
};
exports.updateRolEstado = updateRolEstado;
const deleteRol = async (id) => {
    await repository.deleteRol(id);
    return { message: "Rol eliminado correctamente" };
};
exports.deleteRol = deleteRol;
