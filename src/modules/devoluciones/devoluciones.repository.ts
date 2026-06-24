import { pool } from "../../config/database";

export const getAllDevoluciones = async () => {
  const result = await pool.request().query(`
    SELECT d.*, dp.id_ventas, dp.id_producto, dp.precio_unitario, p.nombre as producto,
           prov.nombre as proveedor, p.id_proveedor
    FROM Devoluciones d
    JOIN Detalle_Venta_Producto dp ON d.id_detalle_producto = dp.id_detalle_producto
    JOIN Productos p ON dp.id_producto = p.id_producto
    LEFT JOIN Proveedores prov ON p.id_proveedor = prov.id_proveedor
    ORDER BY d.fecha DESC
  `);
  return result.recordset;
};

export const getDevolucionById = async (id: number) => {
  const result = await pool.request()
    .input("id", id)
    .query(`
      SELECT d.*, dp.id_ventas, dp.id_producto, dp.precio_unitario, p.nombre as producto,
             prov.nombre as proveedor, p.id_proveedor
      FROM Devoluciones d
      JOIN Detalle_Venta_Producto dp ON d.id_detalle_producto = dp.id_detalle_producto
      JOIN Productos p ON dp.id_producto = p.id_producto
      LEFT JOIN Proveedores prov ON p.id_proveedor = prov.id_proveedor
      WHERE d.id_devolucion = @id
    `);
  return result.recordset[0];
};

export const createDevolucion = async (data: any) => {
  const { id_detalle_producto, cantidad, motivo, remitido } = data;

  const result = await pool.request()
    .input("id_detalle_producto", id_detalle_producto)
    .input("cantidad", cantidad)
    .input("motivo", motivo || null)
    .input("remitido", remitido)
    .query(`
      INSERT INTO Devoluciones (id_detalle_producto, cantidad, motivo, remitido)
      OUTPUT INSERTED.id_devolucion
      VALUES (@id_detalle_producto, @cantidad, @motivo, @remitido)
    `);

  return { id_devolucion: result.recordset[0].id_devolucion };
};

export const updateDevolucion = async (id: number, data: any) => {
  const { cantidad, motivo, remitido } = data;
  const updates: string[] = [];
  const request = pool.request().input("id", id);

  if (cantidad !== undefined) {
    updates.push("cantidad = @cantidad");
    request.input("cantidad", cantidad);
  }
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

// Nueva función para obtener productos disponibles para devolución por proveedor
export const getProductosPorProveedor = async (id_proveedor: number) => {
  // Productos en consignación con este proveedor
  const consignacionResult = await pool.request()
    .input("id_proveedor", id_proveedor)
    .query(`
      SELECT DISTINCT
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        'consignacion' as tipo_adquisicion,
        c.cantidad_recibida,
        c.cantidad_vendida,
        (c.cantidad_recibida - ISNULL(c.cantidad_vendida, 0)) as disponible_devolucion,
        c.fecha_entrega,
        c.estado as estado_consignacion
      FROM Productos p
      JOIN Consignaciones_Proveedor c ON p.id_producto = c.id_producto
      WHERE p.id_proveedor = @id_proveedor
        AND c.estado IN ('pendiente', 'pagado')
        AND (c.cantidad_recibida - ISNULL(c.cantidad_vendida, 0)) > 0
    `);

  // Productos comprados directamente a este proveedor (que aún no han sido vendidos completamente)
  const compraResult = await pool.request()
    .input("id_proveedor", id_proveedor)
    .query(`
      SELECT DISTINCT
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        'compra_directa' as tipo_adquisicion,
        dc.cantidad as cantidad_comprada,
        0 as cantidad_vendida,
        p.stock as disponible_devolucion,
        comp.fecha_compra as fecha_adquisicion,
        'comprado' as estado_compra
      FROM Productos p
      JOIN Detalle_Compra dc ON p.id_producto = dc.id_producto
      JOIN Compras comp ON dc.id_compra = comp.id_compra
      WHERE comp.id_proveedor = @id_proveedor
        AND p.stock > 0
        AND p.tipo_adquisicion = 'compra_directa'
    `);

  return {
    consignacion: consignacionResult.recordset,
    compra_directa: compraResult.recordset
  };
};