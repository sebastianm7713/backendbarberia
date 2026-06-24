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
exports.deleteDetalleCompra = exports.updateDetalleCompra = exports.getDetallesPorCompra = exports.getDetalleCompraById = exports.getAllDetalleCompras = exports.crearDetalleCompra = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
const repository = __importStar(require("./detalle_compra.repository"));
const crearDetalleCompra = async (data) => {
    const transaction = new mssql_1.default.Transaction(database_1.pool);
    try {
        await transaction.begin();
        const request = new mssql_1.default.Request(transaction);
        // Obtener nuevo id_detalle_compra
        const idDetalleResult = await request.query(`
      SELECT ISNULL(MAX(id_detalle_compra), 0) + 1 AS nextId 
      FROM Detalle_Compra
    `);
        const id_detalle_compra = idDetalleResult.recordset[0].nextId;
        const subtotal = data.cantidad * data.costo_unitario;
        // Insertar detalle
        await request
            .input("id_detalle_compra", id_detalle_compra)
            .input("id_compra", data.id_compra)
            .input("id_producto", data.id_producto)
            .input("cantidad", data.cantidad)
            .input("costo_unitario", data.costo_unitario)
            .input("subtotal", subtotal)
            .query(`
        INSERT INTO Detalle_Compra
        (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal)
        VALUES
        (@id_detalle_compra, @id_compra, @id_producto, @cantidad, @costo_unitario, @subtotal)
      `);
        // Actualizar stock del producto
        await request
            .input("id_producto", data.id_producto)
            .input("cantidad", data.cantidad)
            .query(`
        UPDATE Productos
        SET stock = stock + @cantidad
        WHERE id_producto = @id_producto
      `);
        // Actualizar total de la compra
        const totalResult = await request
            .input("id_compra", data.id_compra)
            .query(`
        SELECT SUM(subtotal) AS nuevo_total
        FROM Detalle_Compra
        WHERE id_compra = @id_compra
      `);
        const nuevoTotal = totalResult.recordset[0].nuevo_total || 0;
        await request
            .input("id_compra", data.id_compra)
            .input("total", nuevoTotal)
            .query(`
        UPDATE Compras
        SET total = @total
        WHERE id_compra = @id_compra
      `);
        await transaction.commit();
        return { message: "Detalle de compra creado correctamente", id_detalle_compra };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.crearDetalleCompra = crearDetalleCompra;
const getAllDetalleCompras = async () => {
    return await repository.getAllDetalleCompras();
};
exports.getAllDetalleCompras = getAllDetalleCompras;
const getDetalleCompraById = async (id_detalle_compra) => {
    return await repository.getDetalleCompraById(id_detalle_compra);
};
exports.getDetalleCompraById = getDetalleCompraById;
const getDetallesPorCompra = async (id_compra) => {
    return await repository.getDetallesPorCompra(id_compra);
};
exports.getDetallesPorCompra = getDetallesPorCompra;
const updateDetalleCompra = async (id_detalle_compra, data) => {
    await repository.updateDetalleCompra(id_detalle_compra, data);
    return { message: "Detalle de compra actualizado correctamente" };
};
exports.updateDetalleCompra = updateDetalleCompra;
const deleteDetalleCompra = async (id_detalle_compra) => {
    await repository.deleteDetalleCompra(id_detalle_compra);
    return { message: "Detalle de compra eliminado correctamente" };
};
exports.deleteDetalleCompra = deleteDetalleCompra;
