import { pool } from "../../config/database";

export const getAllDevoluciones = async () => {
  const result = await pool.request().query(`
    SELECT d.*, dp.id_ventas, dp.id_producto, dp.precio_unitario, p.nombre as producto
    FROM Devoluciones d
    JOIN Detalle_Venta_Producto dp ON d.id_detalle_producto = dp.id_detalle_producto
    JOIN Productos p ON dp.id_producto = p.id_producto
    ORDER BY d.fecha DESC
  `);
  return result.recordset;
};

export const getDevolucionById = async (id: number) => {
  const result = await pool.request()
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

export const createDevolucion = async (data: any) => {
  const { id_detalle_producto, motivo, remitido } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_devolucion), 0) + 1 AS nextId FROM Devoluciones");
  const id = idResult.recordset[0].nextId;

  await pool.request()
    .input("id", id)
    .input("id_detalle_producto", id_detalle_producto)
    .input("motivo", motivo || null)
    .input("remitido", remitido)
    .query(`
      INSERT INTO Devoluciones (id_devolucion, id_detalle_producto, motivo, remitido)
      VALUES (@id, @id_detalle_producto, @motivo, @remitido)
    `);
};

export const updateDevolucion = async (id: number, data: any) => {
  const { motivo, remitido } = data;
  const updates: string[] = [];
  const request = pool.request().input("id", id);

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

export const deleteDevolucion = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Devoluciones WHERE id_devolucion = @id");
};