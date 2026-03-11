"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompra = exports.updateCompra = exports.getCompraById = exports.getAllCompras = exports.crearCompra = void 0;
const database_1 = require("../../config/database");
const crearCompra = async (data) => {
    const { id_proveedor, total } = data;
    await database_1.pool
        .request()
        .input("id_proveedor", id_proveedor)
        .input("total", total)
        .query(`
      INSERT INTO Compras (id_proveedor,total)
      VALUES (@id_proveedor,@total)
    `);
};
exports.crearCompra = crearCompra;
const getAllCompras = async () => {
    const result = await database_1.pool.request().query(`
    SELECT c.id_compra, c.id_proveedor, p.nombre as proveedor_nombre, c.total, c.fecha_compra
    FROM Compras c
    JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    ORDER BY c.fecha_compra DESC
  `);
    return result.recordset;
};
exports.getAllCompras = getAllCompras;
const getCompraById = async (id_compra) => {
    const compraResult = await database_1.pool.request()
        .input("id_compra", id_compra)
        .query(`
      SELECT c.id_compra, c.id_proveedor, p.nombre as proveedor_nombre, c.total, c.fecha_compra
      FROM Compras c
      JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
      WHERE c.id_compra = @id_compra
    `);
    if (compraResult.recordset.length === 0) {
        return null;
    }
    const detallesResult = await database_1.pool.request()
        .input("id_compra", id_compra)
        .query(`
      SELECT dc.id_detalle_compra, dc.id_producto, pr.nombre as producto_nombre, dc.cantidad, dc.costo_unitario, dc.subtotal
      FROM Detalle_Compra dc
      JOIN Productos pr ON dc.id_producto = pr.id_producto
      WHERE dc.id_compra = @id_compra
    `);
    return {
        ...compraResult.recordset[0],
        detalles: detallesResult.recordset,
    };
};
exports.getCompraById = getCompraById;
const updateCompra = async (id_compra, data) => {
    const { id_proveedor, total } = data;
    let query = "UPDATE Compras SET ";
    const inputs = [];
    const params = [];
    if (id_proveedor !== undefined) {
        params.push("id_proveedor = @id_proveedor");
        inputs.push({ name: "id_proveedor", value: id_proveedor });
    }
    if (total !== undefined) {
        params.push("total = @total");
        inputs.push({ name: "total", value: total });
    }
    if (params.length === 0) {
        throw new Error("No fields to update");
    }
    query += params.join(", ") + " WHERE id_compra = @id_compra";
    const request = database_1.pool.request();
    inputs.forEach(input => request.input(input.name, input.value));
    request.input("id_compra", id_compra);
    await request.query(query);
};
exports.updateCompra = updateCompra;
const deleteCompra = async (id_compra) => {
    // First delete detalles
    await database_1.pool.request()
        .input("id_compra", id_compra)
        .query("DELETE FROM Detalle_Compra WHERE id_compra = @id_compra");
    // Then delete compra
    await database_1.pool.request()
        .input("id_compra", id_compra)
        .query("DELETE FROM Compras WHERE id_compra = @id_compra");
};
exports.deleteCompra = deleteCompra;
