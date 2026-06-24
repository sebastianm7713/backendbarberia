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
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteByUsuarioId = exports.getClienteById = exports.getAllClientes = void 0;
const repository = __importStar(require("./clientes.repository"));
const getAllClientes = async () => {
    return await repository.getAllClientes();
};
exports.getAllClientes = getAllClientes;
const getClienteById = async (id_cliente) => {
    return await repository.getClienteById(id_cliente);
};
exports.getClienteById = getClienteById;
const getClienteByUsuarioId = async (id_usuario) => {
    return await repository.getClienteByUsuarioId(id_usuario);
};
exports.getClienteByUsuarioId = getClienteByUsuarioId;
const createCliente = async (data) => {
    const id = await repository.createCliente(data);
    return { message: "Cliente creado correctamente", id_cliente: id };
};
exports.createCliente = createCliente;
const updateCliente = async (id_cliente, data) => {
    const cliente = await repository.updateCliente(id_cliente, data);
    return { message: "Cliente actualizado correctamente", ...cliente };
};
exports.updateCliente = updateCliente;
const deleteCliente = async (id_cliente) => {
    await repository.deleteCliente(id_cliente);
    return { message: "Cliente eliminado correctamente" };
};
exports.deleteCliente = deleteCliente;
