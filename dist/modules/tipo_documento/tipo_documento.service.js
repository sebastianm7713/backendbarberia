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
exports.deleteTipoDocumento = exports.updateTipoDocumento = exports.createTipoDocumento = exports.getTipoDocumentoById = exports.getAllTiposDocumento = void 0;
const repository = __importStar(require("./tipo_documento.repository"));
const getAllTiposDocumento = async () => await repository.getAllTiposDocumento();
exports.getAllTiposDocumento = getAllTiposDocumento;
const getTipoDocumentoById = async (id) => await repository.getTipoDocumentoById(id);
exports.getTipoDocumentoById = getTipoDocumentoById;
const createTipoDocumento = async (data) => {
    await repository.createTipoDocumento(data);
    return { message: "Tipo de documento creado correctamente" };
};
exports.createTipoDocumento = createTipoDocumento;
const updateTipoDocumento = async (id, data) => {
    await repository.updateTipoDocumento(id, data);
    return { message: "Tipo de documento actualizado correctamente" };
};
exports.updateTipoDocumento = updateTipoDocumento;
const deleteTipoDocumento = async (id) => {
    await repository.deleteTipoDocumento(id);
    return { message: "Tipo de documento eliminado correctamente" };
};
exports.deleteTipoDocumento = deleteTipoDocumento;
