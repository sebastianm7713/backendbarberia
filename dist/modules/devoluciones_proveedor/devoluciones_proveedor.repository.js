"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDevolucion = exports.updateDevolucion = exports.createDevolucion = exports.getDevolucionById = exports.getAllDevoluciones = void 0;
const database_1 = require("../../config/database");
const getAllDevoluciones = async () => {
    const result = await database_1.pool.request().query(`
    SELECT dp.*, p.nombre as proveedor, dc.id_compra, pr.nombre as producto
    FROM Devoluciones_Proveedor dp
    JOIN Proveedores p ON dp.id_proveedor = p.id_proveedor
    JOIN Detalle_Compra dc ON dp.id_detalle_compra = dc.id_detalle_compra
    JOIN Productos pr ON dc.id_producto = pr.id_producto
    ORDER BY dp.fecha DESC
  `);
    return result.recordset;
};
exports.getAllDevoluciones = getAllDevoluciones;
const getDevolucionById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`
      SELECT dp.*, p.nombre as proveedor, dc.id_compra, pr.nombre as producto
      FROM Devoluciones_Proveedor dp
      JOIN Proveedores p ON dp.id_proveedor = p.id_proveedor
      JOIN Detalle_Compra dc ON dp.id_detalle_compra = dc.id_detalle_compra
      JOIN Productos pr ON dc.id_producto = pr.id_producto
      WHERE dp.id_dev_prov = @id
    `);
    return result.recordset[0];
};
exports.getDevolucionById = getDevolucionById;
const createDevolucion = async (data) => {
    const { id_detalle_compra, id_proveedor, motivo, cantidad_devuelta } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_dev_prov), 0) + 1 AS nextId FROM Devoluciones_Proveedor");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("id_detalle_compra", id_detalle_compra)
        .input("id_proveedor", id_proveedor)
        .input("motivo", motivo || null)
        .input("cantidad_devuelta", cantidad_devuelta)
        .query(`
      INSERT INTO Devoluciones_Proveedor (id_dev_prov, id_detalle_compra, id_proveedor, motivo, cantidad_devuelta)
      VALUES (@id, @id_detalle_compra, @id_proveedor, @motivo, @cantidad_devuelta)
    `);
};
exports.createDevolucion = createDevolucion;
const updateDevolucion = async (id, data) => {
    const { motivo, cantidad_devuelta, estado } = data;
    const updates = [];
    const request = database_1.pool.request().input("id", id);
    if (motivo !== undefined) {
        updates.push("motivo = @motivo");
        request.input("motivo", motivo);
    }
    if (cantidad_devuelta !== undefined) {
        updates.push("cantidad_devuelta = @cantidad_devuelta");
        request.input("cantidad_devuelta", cantidad_devuelta);
    }
    if (estado !== undefined) {
        updates.push("estado = @estado");
        request.input("estado", estado);
    }
    if (updates.length > 0) {
        await request.query(`UPDATE Devoluciones_Proveedor SET ${updates.join(", ")} WHERE id_dev_prov = @id`);
    }
};
exports.updateDevolucion = updateDevolucion;
const deleteDevolucion = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Devoluciones_Proveedor WHERE id_dev_prov = @id");
};
exports.deleteDevolucion = deleteDevolucion;
