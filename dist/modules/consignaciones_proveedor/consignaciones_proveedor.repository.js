"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConsignacion = exports.updateConsignacion = exports.createConsignacion = exports.getConsignacionById = exports.getAllConsignaciones = void 0;
const database_1 = require("../../config/database");
const getAllConsignaciones = async () => {
    const result = await database_1.pool.request().query(`
    SELECT c.*, p.nombre as proveedor, pr.nombre as producto
    FROM Consignaciones_Proveedor c
    JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    JOIN Productos pr ON c.id_producto = pr.id_producto
    ORDER BY c.fecha_entrega DESC
  `);
    return result.recordset;
};
exports.getAllConsignaciones = getAllConsignaciones;
const getConsignacionById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`
      SELECT c.*, p.nombre as proveedor, pr.nombre as producto
      FROM Consignaciones_Proveedor c
      JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
      JOIN Productos pr ON c.id_producto = pr.id_producto
      WHERE c.id_consignacion = @id
    `);
    return result.recordset[0];
};
exports.getConsignacionById = getConsignacionById;
const createConsignacion = async (data) => {
    const { id_proveedor, id_producto, cantidad_recibida, precio_proveedor, precio_venta, fecha_entrega, observaciones } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_consignacion), 0) + 1 AS nextId FROM Consignaciones_Proveedor");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("id_proveedor", id_proveedor)
        .input("id_producto", id_producto)
        .input("cantidad_recibida", cantidad_recibida)
        .input("precio_proveedor", precio_proveedor)
        .input("precio_venta", precio_venta)
        .input("fecha_entrega", fecha_entrega)
        .input("observaciones", observaciones || null)
        .query(`
      INSERT INTO Consignaciones_Proveedor (id_consignacion, id_proveedor, id_producto, cantidad_recibida, precio_proveedor, precio_venta, fecha_entrega, observaciones)
      VALUES (@id, @id_proveedor, @id_producto, @cantidad_recibida, @precio_proveedor, @precio_venta, @fecha_entrega, @observaciones)
    `);
};
exports.createConsignacion = createConsignacion;
const updateConsignacion = async (id, data) => {
    const { cantidad_vendida, fecha_pago, estado, observaciones } = data;
    const updates = [];
    const request = database_1.pool.request().input("id", id);
    if (cantidad_vendida !== undefined) {
        updates.push("cantidad_vendida = @cantidad_vendida");
        request.input("cantidad_vendida", cantidad_vendida);
    }
    if (fecha_pago !== undefined) {
        updates.push("fecha_pago = @fecha_pago");
        request.input("fecha_pago", fecha_pago);
    }
    if (estado !== undefined) {
        updates.push("estado = @estado");
        request.input("estado", estado);
    }
    if (observaciones !== undefined) {
        updates.push("observaciones = @observaciones");
        request.input("observaciones", observaciones);
    }
    if (updates.length > 0) {
        await request.query(`UPDATE Consignaciones_Proveedor SET ${updates.join(", ")} WHERE id_consignacion = @id`);
    }
};
exports.updateConsignacion = updateConsignacion;
const deleteConsignacion = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Consignaciones_Proveedor WHERE id_consignacion = @id");
};
exports.deleteConsignacion = deleteConsignacion;
