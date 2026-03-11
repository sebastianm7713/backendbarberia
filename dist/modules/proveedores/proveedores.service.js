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
exports.deleteProveedor = exports.updateProveedor = exports.createProveedor = exports.getProveedorById = exports.getAllProveedores = void 0;
const repository = __importStar(require("./proveedores.repository"));
const getAllProveedores = async () => {
    return await repository.getAllProveedores();
};
exports.getAllProveedores = getAllProveedores;
const getProveedorById = async (id_proveedor) => {
    return await repository.getProveedorById(id_proveedor);
};
exports.getProveedorById = getProveedorById;
const createProveedor = async (data) => {
    const id = await repository.createProveedor(data);
    return { message: "Proveedor creado correctamente", id_proveedor: id };
};
exports.createProveedor = createProveedor;
const updateProveedor = async (id_proveedor, data) => {
    await repository.updateProveedor(id_proveedor, data);
    return { message: "Proveedor actualizado correctamente" };
};
exports.updateProveedor = updateProveedor;
const deleteProveedor = async (id_proveedor) => {
    await repository.deleteProveedor(id_proveedor);
    return { message: "Proveedor eliminado correctamente" };
};
exports.deleteProveedor = deleteProveedor;
