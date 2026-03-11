"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFactura = exports.getFacturaById = exports.getFacturas = void 0;
const database_1 = require("../../config/database");
const getFacturas = async () => {
    const result = await database_1.pool.request().query(`SELECT * FROM facturas ORDER BY id`);
    return result.recordset;
};
exports.getFacturas = getFacturas;
const getFacturaById = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`SELECT * FROM facturas WHERE id = @id`);
    return result.recordset[0];
};
exports.getFacturaById = getFacturaById;
// the creation logic is handled in service using transaction
const deleteFactura = async (id) => {
    await database_1.pool
        .request()
        .input("id", id)
        .query(`DELETE FROM factura_detalle WHERE factura_id = @id`);
    await database_1.pool
        .request()
        .input("id", id)
        .query(`DELETE FROM facturas WHERE id = @id`);
};
exports.deleteFactura = deleteFactura;
