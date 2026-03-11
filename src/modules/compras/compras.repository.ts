import { pool } from "../../config/database";

export const crearCompra = async (data: any) => {
  const { id_proveedor, total } = data;

  await pool
    .request()
    .input("id_proveedor", id_proveedor)
    .input("total", total)
    .query(`
      INSERT INTO Compras (id_proveedor,total)
      VALUES (@id_proveedor,@total)
    `);
};

export const getAllCompras = async () => {
  const result = await pool.request().query(`
    SELECT c.id_compra, c.id_proveedor, p.nombre as proveedor_nombre, c.total, c.fecha_compra
    FROM Compras c
    JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    ORDER BY c.fecha_compra DESC
  `);
  return result.recordset;
};

export const getCompraById = async (id_compra: number) => {
  const compraResult = await pool.request()
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

  const detallesResult = await pool.request()
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

export const updateCompra = async (id_compra: number, data: any) => {
  const { id_proveedor, total } = data;

  let query = "UPDATE Compras SET ";
  const inputs: any[] = [];
  const params: string[] = [];

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

  const request = pool.request();
  inputs.forEach(input => request.input(input.name, input.value));
  request.input("id_compra", id_compra);

  await request.query(query);
};

export const deleteCompra = async (id_compra: number) => {
  // First delete detalles
  await pool.request()
    .input("id_compra", id_compra)
    .query("DELETE FROM Detalle_Compra WHERE id_compra = @id_compra");

  // Then delete compra
  await pool.request()
    .input("id_compra", id_compra)
    .query("DELETE FROM Compras WHERE id_compra = @id_compra");
};