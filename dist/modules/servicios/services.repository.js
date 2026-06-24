"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServicio = exports.updateServicio = exports.getServicioById = exports.createServicio = exports.getServicios = void 0;
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
const getServicioById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`SELECT * FROM Servicios WHERE id_servicio = @id`);
    return result.recordset[0];
};
exports.getServicioById = getServicioById;
const updateServicio = async (id, data) => {
    const { nombre, descripcion, precio, duracion, porcentaje_barbero } = data;
    let query = "UPDATE Servicios SET ";
    const request = database_1.pool.request().input("id", id);
    const updates = [];
    if (nombre !== undefined) {
        updates.push("nombre = @nombre");
        request.input("nombre", nombre);
    }
    if (descripcion !== undefined) {
        updates.push("descripcion = @descripcion");
        request.input("descripcion", descripcion);
    }
    if (precio !== undefined) {
        updates.push("precio = @precio");
        request.input("precio", precio);
    }
    if (duracion !== undefined) {
        updates.push("duracion = @duracion");
        request.input("duracion", duracion);
    }
    if (porcentaje_barbero !== undefined) {
        updates.push("porcentaje_barbero = @porcentaje_barbero");
        request.input("porcentaje_barbero", porcentaje_barbero);
    }
    if (updates.length === 0)
        return;
    query += updates.join(", ") + " WHERE id_servicio = @id";
    await request.query(query);
};
exports.updateServicio = updateServicio;
const deleteServicio = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Servicios WHERE id_servicio = @id");
};
exports.deleteServicio = deleteServicio;
