"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearFactura = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
const crearFactura = async (data) => {
    const transaction = new mssql_1.default.Transaction(database_1.pool);
    try {
        await transaction.begin();
        const request = new mssql_1.default.Request(transaction);
        const facturaResult = await request
            .input("cliente_id", data.cliente_id)
            .query(`
        INSERT INTO facturas (cliente_id, fecha)
        OUTPUT INSERTED.id
        VALUES (@cliente_id, GETDATE())
      `);
        const facturaId = facturaResult.recordset[0].id;
        for (const item of data.detalles) {
            await request
                .input("factura_id", facturaId)
                .input("producto_id", item.producto_id)
                .input("cantidad", item.cantidad)
                .query(`
          INSERT INTO factura_detalle (factura_id, producto_id, cantidad)
          VALUES (@factura_id, @producto_id, @cantidad)
        `);
        }
        await transaction.commit();
        return { message: "Factura creada" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.crearFactura = crearFactura;
