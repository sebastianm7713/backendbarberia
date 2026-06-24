import sql from "mssql";
import { pool } from "../../config/database";
import * as repository from "./detalle_compra.repository";

export const crearDetalleCompra = async (data: any) => {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Obtener nuevo id_detalle_compra
    const idDetalleResult = await request.query(`
      SELECT ISNULL(MAX(id_detalle_compra), 0) + 1 AS nextId 
      FROM Detalle_Compra
    `);

    const id_detalle_compra = idDetalleResult.recordset[0].nextId;
    const subtotal = data.cantidad * data.costo_unitario;

    // Insertar detalle
    await request
      .input("id_detalle_compra", id_detalle_compra)
      .input("id_compra", data.id_compra)
      .input("id_producto", data.id_producto)
      .input("cantidad", data.cantidad)
      .input("costo_unitario", data.costo_unitario)
      .input("subtotal", subtotal)
      .query(`
        INSERT INTO Detalle_Compra
        (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal)
        VALUES
        (@id_detalle_compra, @id_compra, @id_producto, @cantidad, @costo_unitario, @subtotal)
      `);

    // Actualizar stock del producto
    await request
      .input("id_producto", data.id_producto)
      .input("cantidad", data.cantidad)
      .query(`
        UPDATE Productos
        SET stock = stock + @cantidad
        WHERE id_producto = @id_producto
      `);

    // Actualizar total de la compra
    const totalResult = await request
      .input("id_compra", data.id_compra)
      .query(`
        SELECT SUM(subtotal) AS nuevo_total
        FROM Detalle_Compra
        WHERE id_compra = @id_compra
      `);

    const nuevoTotal = totalResult.recordset[0].nuevo_total || 0;

    await request
      .input("id_compra", data.id_compra)
      .input("total", nuevoTotal)
      .query(`
        UPDATE Compras
        SET total = @total
        WHERE id_compra = @id_compra
      `);

    await transaction.commit();

    return { message: "Detalle de compra creado correctamente", id_detalle_compra };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getAllDetalleCompras = async () => {
  return await repository.getAllDetalleCompras();
};

export const getDetalleCompraById = async (id_detalle_compra: number) => {
  return await repository.getDetalleCompraById(id_detalle_compra);
};

export const getDetallesPorCompra = async (id_compra: number) => {
  return await repository.getDetallesPorCompra(id_compra);
};

export const updateDetalleCompra = async (id_detalle_compra: number, data: any) => {
  await repository.updateDetalleCompra(id_detalle_compra, data);
  return { message: "Detalle de compra actualizado correctamente" };
};

export const deleteDetalleCompra = async (id_detalle_compra: number) => {
  await repository.deleteDetalleCompra(id_detalle_compra);
  return { message: "Detalle de compra eliminado correctamente" };
};