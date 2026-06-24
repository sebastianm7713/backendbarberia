"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDetalleCompra = exports.updateDetalleCompra = exports.getDetallesPorCompra = exports.getDetalleCompraById = exports.getAllDetalleCompras = exports.crearDetalleCompra = void 0;
const database_1 = require("../../config/database");
const crearDetalleCompra = async (data) => {
    const { id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal } = data;
    await database_1.pool
        .request()
        .input("id_detalle_compra", id_detalle_compra)
        .input("id_compra", id_compra)
        .input("id_producto", id_producto)
        .input("cantidad", cantidad)
        .input("costo_unitario", costo_unitario)
        .input("subtotal", subtotal)
        .query(`
      INSERT INTO Detalle_Compra (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal)
      VALUES (@id_detalle_compra, @id_compra, @id_producto, @cantidad, @costo_unitario, @subtotal)
    `);
};
exports.crearDetalleCompra = crearDetalleCompra;
const getAllDetalleCompras = async () => {
    const result = await database_1.pool.request().query(`
    SELECT dc.id_detalle_compra, dc.id_compra, dc.id_producto, p.nombre as producto_nombre, 
           dc.cantidad, dc.costo_unitario, dc.subtotal
    FROM Detalle_Compra dc
    JOIN Productos p ON dc.id_producto = p.id_producto
    ORDER BY dc.id_compra, dc.id_detalle_compra
  `);
    return result.recordset;
};
exports.getAllDetalleCompras = getAllDetalleCompras;
const getDetalleCompraById = async (id_detalle_compra) => {
    const result = await database_1.pool.request()
        .input("id_detalle_compra", id_detalle_compra)
        .query(`
      SELECT dc.id_detalle_compra, dc.id_compra, dc.id_producto, p.nombre as producto_nombre,
             dc.cantidad, dc.costo_unitario, dc.subtotal
      FROM Detalle_Compra dc
      JOIN Productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_detalle_compra = @id_detalle_compra
    `);
    return result.recordset.length > 0 ? result.recordset[0] : null;
};
exports.getDetalleCompraById = getDetalleCompraById;
const getDetallesPorCompra = async (id_compra) => {
    const result = await database_1.pool.request()
        .input("id_compra", id_compra)
        .query(`
      SELECT dc.id_detalle_compra, dc.id_compra, dc.id_producto, p.nombre as producto_nombre,
             dc.cantidad, dc.costo_unitario, dc.subtotal
      FROM Detalle_Compra dc
      JOIN Productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_compra = @id_compra
      ORDER BY dc.id_detalle_compra
    `);
    return result.recordset;
};
exports.getDetallesPorCompra = getDetallesPorCompra;
const updateDetalleCompra = async (id_detalle_compra, data) => {
    const { id_producto, cantidad, costo_unitario } = data;
    let query = "UPDATE Detalle_Compra SET ";
    const inputs = [];
    const params = [];
    if (id_producto !== undefined) {
        params.push("id_producto = @id_producto");
        inputs.push({ name: "id_producto", value: id_producto });
    }
    if (cantidad !== undefined) {
        params.push("cantidad = @cantidad");
        inputs.push({ name: "cantidad", value: cantidad });
    }
    if (costo_unitario !== undefined) {
        params.push("costo_unitario = @costo_unitario");
        inputs.push({ name: "costo_unitario", value: costo_unitario });
    }
    if (params.length === 0) {
        throw new Error("No fields to update");
    }
    // Recalcular subtotal si cantidad o costo_unitario cambian
    if (cantidad !== undefined || costo_unitario !== undefined) {
        // Obtener valores actuales si no se actualizan
        const currentData = await (0, exports.getDetalleCompraById)(id_detalle_compra);
        const newCantidad = cantidad !== undefined ? cantidad : currentData.cantidad;
        const newCosto = costo_unitario !== undefined ? costo_unitario : currentData.costo_unitario;
        const newSubtotal = newCantidad * newCosto;
        params.push("subtotal = @subtotal");
        inputs.push({ name: "subtotal", value: newSubtotal });
    }
    query += params.join(", ") + " WHERE id_detalle_compra = @id_detalle_compra";
    const request = database_1.pool.request();
    inputs.forEach(input => request.input(input.name, input.value));
    request.input("id_detalle_compra", id_detalle_compra);
    await request.query(query);
};
exports.updateDetalleCompra = updateDetalleCompra;
const deleteDetalleCompra = async (id_detalle_compra) => {
    await database_1.pool.request()
        .input("id_detalle_compra", id_detalle_compra)
        .query("DELETE FROM Detalle_Compra WHERE id_detalle_compra = @id_detalle_compra");
};
exports.deleteDetalleCompra = deleteDetalleCompra;
