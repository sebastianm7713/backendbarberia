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
exports.deletePermiso = exports.updatePermiso = exports.createPermiso = exports.getPermisoById = exports.getAllPermisos = void 0;
const repository = __importStar(require("./permisos.repository"));
const getAllPermisos = async () => await repository.getAllPermisos();
exports.getAllPermisos = getAllPermisos;
const getPermisoById = async (id) => await repository.getPermisoById(id);
exports.getPermisoById = getPermisoById;
const createPermiso = async (data) => {
    await repository.createPermiso(data);
    return { message: "Permiso creado correctamente" };
};
exports.createPermiso = createPermiso;
const updatePermiso = async (id, data) => {
    await repository.updatePermiso(id, data);
    return { message: "Permiso actualizado correctamente" };
};
exports.updatePermiso = updatePermiso;
const deletePermiso = async (id) => {
    await repository.deletePermiso(id);
    return { message: "Permiso eliminado correctamente" };
};
exports.deletePermiso = deletePermiso;
