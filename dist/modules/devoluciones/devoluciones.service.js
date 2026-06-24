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
exports.getProductosPorProveedor = exports.deleteDevolucion = exports.updateDevolucion = exports.createDevolucion = exports.getDevolucionById = exports.getAllDevoluciones = void 0;
const repository = __importStar(require("./devoluciones.repository"));
const database_1 = require("../../config/database");
const getAllDevoluciones = async () => await repository.getAllDevoluciones();
exports.getAllDevoluciones = getAllDevoluciones;
const getDevolucionById = async (id) => await repository.getDevolucionById(id);
exports.getDevolucionById = getDevolucionById;
const createDevolucion = async (data) => {
    const result = await repository.createDevolucion(data);
    // Si la devolución va a stock, DISMINUIR el inventario del producto
    if (data.remitido === 'stock') {
        await ajustarStockProducto(data.id_detalle_producto || data.id_producto, data.cantidad, 'disminuir');
    }
    return {
        message: "Devolucion creada correctamente",
        id_devolucion: result.id_devolucion
    };
};
exports.createDevolucion = createDevolucion;
const updateDevolucion = async (id, data) => {
    await repository.updateDevolucion(id, data);
    return { message: "Devolucion actualizada correctamente" };
};
exports.updateDevolucion = updateDevolucion;
const deleteDevolucion = async (id) => {
    // Obtener la devolución antes de eliminarla para saber si hay que ajustar stock
    const devolucion = await repository.getDevolucionById(id);
    if (!devolucion) {
        throw new Error("Devolución no encontrada");
    }
    await repository.deleteDevolucion(id);
    // Si la devolución iba a stock, AUMENTAR el inventario del producto (volverlo al stock)
    if (devolucion.remitido === 'stock') {
        await ajustarStockProducto(devolucion.id_detalle_producto || devolucion.id_producto, devolucion.cantidad, 'aumentar');
    }
    return { message: "Devolucion eliminada correctamente" };
};
exports.deleteDevolucion = deleteDevolucion;
// Nueva función para obtener productos por proveedor
const getProductosPorProveedor = async (id_proveedor) => {
    return await repository.getProductosPorProveedor(id_proveedor);
};
exports.getProductosPorProveedor = getProductosPorProveedor;
// Función auxiliar para ajustar el stock de productos
const ajustarStockProducto = async (id_detalle_o_producto, cantidad, operacion) => {
    try {
        let id_producto;
        // Si es un id_detalle_producto, obtener el id_producto
        if (id_detalle_o_producto && typeof id_detalle_o_producto === 'number') {
            // Verificar si es un id_detalle_producto
            const detalleResult = await database_1.pool.request()
                .input("id_detalle_o_producto", id_detalle_o_producto)
                .query("SELECT id_producto FROM Detalle_Venta_Producto WHERE id_detalle_producto = @id_detalle_o_producto");
            if (detalleResult.recordset.length > 0) {
                id_producto = detalleResult.recordset[0].id_producto;
            }
            else {
                // Asumir que es directamente un id_producto
                id_producto = id_detalle_o_producto;
            }
        }
        else {
            throw new Error("ID de producto o detalle no válido");
        }
        const operador = operacion === 'aumentar' ? '+' : '-';
        // Actualizar el stock del producto
        await database_1.pool.request()
            .input("id_producto", id_producto)
            .input("cantidad", cantidad)
            .query(`UPDATE Productos SET stock = stock ${operador} @cantidad WHERE id_producto = @id_producto`);
    }
    catch (error) {
        throw new Error(`Error al ajustar stock del producto: ${error}`);
    }
};
