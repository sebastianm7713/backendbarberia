import { pool } from "../../config/database";

export const crearDetalleCompra = async (data: any) => {
  const { id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal } = data;

  await pool
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

export const getAllDetalleCompras = async () => {
  const result = await pool.request().query(`
    SELECT dc.id_detalle_compra, dc.id_compra, dc.id_producto, p.nombre as producto_nombre, 
           dc.cantidad, dc.costo_unitario, dc.subtotal
    FROM Detalle_Compra dc
    JOIN Productos p ON dc.id_producto = p.id_producto
    ORDER BY dc.id_compra, dc.id_detalle_compra
  `);
  return result.recordset;
};

export const getDetalleCompraById = async (id_detalle_compra: number) => {
  const result = await pool.request()
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

export const getDetallesPorCompra = async (id_compra: number) => {
  const result = await pool.request()
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

export const updateDetalleCompra = async (id_detalle_compra: number, data: any) => {
  const { id_producto, cantidad, costo_unitario } = data;

  let query = "UPDATE Detalle_Compra SET ";
  const inputs: any[] = [];
  const params: string[] = [];

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
    const currentData = await getDetalleCompraById(id_detalle_compra);
    const newCantidad = cantidad !== undefined ? cantidad : currentData.cantidad;
    const newCosto = costo_unitario !== undefined ? costo_unitario : currentData.costo_unitario;
    const newSubtotal = newCantidad * newCosto;

    params.push("subtotal = @subtotal");
    inputs.push({ name: "subtotal", value: newSubtotal });
  }

  query += params.join(", ") + " WHERE id_detalle_compra = @id_detalle_compra";

  const request = pool.request();
  inputs.forEach(input => request.input(input.name, input.value));
  request.input("id_detalle_compra", id_detalle_compra);

  await request.query(query);
};

export const deleteDetalleCompra = async (id_detalle_compra: number) => {
  await pool.request()
    .input("id_detalle_compra", id_detalle_compra)
    .query("DELETE FROM Detalle_Compra WHERE id_detalle_compra = @id_detalle_compra");
};