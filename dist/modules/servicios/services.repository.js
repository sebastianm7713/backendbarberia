"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServicio = exports.getServicios = void 0;
const database_1 = require("../../config/database");
const getServicios = async () => {
    const result = await database_1.pool.request().query(`
    SELECT * FROM Servicios
  `);
    return result.recordset;
};
exports.getServicios = getServicios;
const createServicio = async (data) => {
    const { nombre, descripcion, precio, duracion, porcentaje_barbero } = data;
    const result = await database_1.pool
        .request()
        .input("nombre", nombre)
        .input("descripcion", descripcion)
        .input("precio", precio)
        .input("duracion", duracion)
        .input("porcentaje_barbero", porcentaje_barbero)
        .query(`
      INSERT INTO Servicios
      (nombre, descripcion, precio, duracion, porcentaje_barbero)
      VALUES
      (@nombre, @descripcion, @precio, @duracion, @porcentaje_barbero)
    `);
    return result;
};
exports.createServicio = createServicio;
