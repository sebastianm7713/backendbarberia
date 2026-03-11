"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearVenta = void 0;
const database_1 = require("../../config/database");
const crearVenta = async (data) => {
    const { id_cliente, id_barbero, total } = data;
    await database_1.pool
        .request()
        .input("id_cliente", id_cliente)
        .input("id_barbero", id_barbero)
        .input("total", total)
        .query(`
      INSERT INTO Ventas (id_cliente,id_barbero,total)
      VALUES (@id_cliente,@id_barbero,@total)
    `);
};
exports.crearVenta = crearVenta;
