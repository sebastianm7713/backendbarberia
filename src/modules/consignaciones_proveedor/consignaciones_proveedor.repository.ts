import { pool } from "../../config/database";

export const getAllConsignaciones = async () => {
  const result = await pool.request().query(`
    SELECT c.*, p.nombre as proveedor, pr.nombre as producto
    FROM Consignaciones_Proveedor c
    JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    JOIN Productos pr ON c.id_producto = pr.id_producto
    ORDER BY c.fecha_entrega DESC
  `);
  return result.recordset;
};

export const getConsignacionById = async (id: number) => {
  const result = await pool.request()
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

export const createConsignacion = async (data: any) => {
  const { id_proveedor, id_producto, cantidad_recibida, precio_proveedor, precio_venta, fecha_entrega, observaciones } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_consignacion), 0) + 1 AS nextId FROM Consignaciones_Proveedor");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
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

export const updateConsignacion = async (id: number, data: any) => {
  const { cantidad_vendida, fecha_pago, estado, observaciones } = data;
  const updates = [];
  const request = pool.request().input("id", id);
  
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

export const deleteConsignacion = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Consignaciones_Proveedor WHERE id_consignacion = @id");
};