"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDevolucion = exports.updateDevolucion = exports.createDevolucion = exports.getDevolucionById = exports.getAllDevoluciones = void 0;
const database_1 = require("../../config/database");
const getAllDevoluciones = async () => {
    const result = await database_1.pool.request().query(`
    SELECT d.*, dp.id_ventas, dp.id_producto, dp.precio_unitario, p.nombre as producto
    FROM Devoluciones d
    JOIN Detalle_Venta_Producto dp ON d.id_detalle_producto = dp.id_detalle_producto
    JOIN Productos p ON dp.id_producto = p.id_producto
    ORDER BY d.fecha DESC
  `);
    return result.recordset;
};
exports.getAllDevoluciones = getAllDevoluciones;
const getDevolucionById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`
      SELECT d.*, dp.id_ventas, dp.id_producto, dp.precio_unitario, p.nombre as producto
      FROM Devoluciones d
      JOIN Detalle_Venta_Producto dp ON d.id_detalle_producto = dp.id_detalle_producto
      JOIN Productos p ON dp.id_producto = p.id_producto
      WHERE d.id_devolucion = @id
    `);
    return result.recordset[0];
};
exports.getDevolucionById = getDevolucionById;
const createDevolucion = async (data) => {
    const { id_detalle_producto, motivo, remitido } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_devolucion), 0) + 1 AS nextId FROM Devoluciones");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("id_detalle_producto", id_detalle_producto)
        .input("motivo", motivo || null)
        .input("remitido", remitido)
        .query(`
      INSERT INTO Devoluciones (id_devolucion, id_detalle_producto, motivo, remitido)
      VALUES (@id, @id_detalle_producto, @motivo, @remitido)
    `);
};
exports.createDevolucion = createDevolucion;
const updateDevolucion = async (id, data) => {
    const { motivo, remitido } = data;
    const updates = [];
    const request = database_1.pool.request().input("id", id);
    if (motivo !== undefined) {
        updates.push("motivo = @motivo");
        request.input("motivo", motivo);
    }
    if (remitido !== undefined) {
        updates.push("remitido = @remitido");
        request.input("remitido", remitido);
    }
    if (updates.length > 0) {
        await request.query(`UPDATE Devoluciones SET ${updates.join(", ")} WHERE id_devolucion = @id`);
    }
};
exports.updateDevolucion = updateDevolucion;
const deleteDevolucion = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Devoluciones WHERE id_devolucion = @id");
};
exports.deleteDevolucion = deleteDevolucion;
