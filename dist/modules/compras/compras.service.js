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
exports.deleteCompra = exports.updateCompra = exports.getCompraById = exports.getAllCompras = exports.crearCompra = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
const repository = __importStar(require("./compras.repository"));
const crearCompra = async (data) => {
    const transaction = new mssql_1.default.Transaction(database_1.pool);
    try {
        await transaction.begin();
        const request = new mssql_1.default.Request(transaction);
        // 1️⃣ Obtener nuevo id_compra manual
        const idCompraResult = await request.query(`
      SELECT ISNULL(MAX(id_compra), 0) + 1 AS nextId FROM Compras
    `);
        const id_compra = idCompraResult.recordset[0].nextId;
        let totalCompra = 0;
        // 2️⃣ Calcular total desde detalles
        for (const item of data.detalles) {
            totalCompra += item.cantidad * item.costo_unitario;
        }
        // 3️⃣ Insertar compra
        await request
            .input("id_compra", id_compra)
            .input("id_proveedor", data.id_proveedor)
            .input("total", totalCompra)
            .query(`
        INSERT INTO Compras (id_compra, id_proveedor, total)
        VALUES (@id_compra, @id_proveedor, @total)
      `);
        // 4️⃣ Insertar detalles y actualizar stock
        for (const item of data.detalles) {
            // Obtener nuevo id_detalle_compra
            const idDetalleResult = await request.query(`
        SELECT ISNULL(MAX(id_detalle_compra), 0) + 1 AS nextId 
        FROM Detalle_Compra
      `);
            const id_detalle_compra = idDetalleResult.recordset[0].nextId;
            const subtotal = item.cantidad * item.costo_unitario;
            // Insertar detalle
            await request
                .input("id_detalle_compra", id_detalle_compra)
                .input("id_compra", id_compra)
                .input("id_producto", item.id_producto)
                .input("cantidad", item.cantidad)
                .input("costo_unitario", item.costo_unitario)
                .input("subtotal", subtotal)
                .query(`
          INSERT INTO Detalle_Compra
          (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal)
          VALUES
          (@id_detalle_compra, @id_compra, @id_producto, @cantidad, @costo_unitario, @subtotal)
        `);
            // Actualizar stock
            await request
                .input("id_producto", item.id_producto)
                .input("cantidad", item.cantidad)
                .query(`
          UPDATE Productos
          SET stock = stock + @cantidad
          WHERE id_producto = @id_producto
        `);
        }
        await transaction.commit();
        return { message: "Compra registrada correctamente", id_compra };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.crearCompra = crearCompra;
const getAllCompras = async () => {
    return await repository.getAllCompras();
};
exports.getAllCompras = getAllCompras;
const getCompraById = async (id_compra) => {
    return await repository.getCompraById(id_compra);
};
exports.getCompraById = getCompraById;
const updateCompra = async (id_compra, data) => {
    // Note: Updating purchases might not be common, but for completeness
    await repository.updateCompra(id_compra, data);
    return { message: "Compra actualizada correctamente" };
};
exports.updateCompra = updateCompra;
const deleteCompra = async (id_compra) => {
    // Note: Deleting purchases might affect stock, but for simplicity
    await repository.deleteCompra(id_compra);
    return { message: "Compra eliminada correctamente" };
};
exports.deleteCompra = deleteCompra;
