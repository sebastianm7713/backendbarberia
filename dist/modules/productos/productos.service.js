"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductos = void 0;
const database_1 = require("../../config/database");
const getProductos = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM productos");
    return result.recordset;
};
exports.getProductos = getProductos;
