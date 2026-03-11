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
exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getCategoriaById = exports.getAllCategorias = void 0;
const repository = __importStar(require("./categorias_productos.repository"));
const getAllCategorias = async () => await repository.getAllCategorias();
exports.getAllCategorias = getAllCategorias;
const getCategoriaById = async (id) => await repository.getCategoriaById(id);
exports.getCategoriaById = getCategoriaById;
const createCategoria = async (data) => {
    await repository.createCategoria(data);
    return { message: "Categoria creada correctamente" };
};
exports.createCategoria = createCategoria;
const updateCategoria = async (id, data) => {
    await repository.updateCategoria(id, data);
    return { message: "Categoria actualizada correctamente" };
};
exports.updateCategoria = updateCategoria;
const deleteCategoria = async (id) => {
    await repository.deleteCategoria(id);
    return { message: "Categoria eliminada correctamente" };
};
exports.deleteCategoria = deleteCategoria;
