"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crear = void 0;
const database_1 = require("../../config/database");
const crear = async (data) => {
    await database_1.pool.request()
        .input("cliente_id", data.cliente_id)
        .input("fecha", data.fecha)
        .input("servicio_id", data.servicio_id)
        .query(`
      INSERT INTO citas (cliente_id, fecha, servicio_id)
      VALUES (@cliente_id, @fecha, @servicio_id)
    `);
};
exports.crear = crear;
