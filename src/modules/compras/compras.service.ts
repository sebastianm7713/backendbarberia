import sql from "mssql";
import { pool } from "../../config/database";
import * as repository from "./compras.repository";

export const crearCompra = async (data: any) => {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    // 1️⃣ Obtener nuevo id_compra manual
    const idCompraResult = await request.query(`
      SELECT ISNULL(MAX(id_compra), 0) + 1 AS nextId FROM Compras
    `);

    const id_compra = idCompraResult.recordset[0].nextId;

    let totalCompra = 0;

    // 2️⃣ Calcular total desde detalles
    for (const item of data.detalles) {
      totalCompra += item.cantidad * item.costo_unitario;
    }

    // 3️⃣ Insertar compra
    await request
      .input("id_compra", id_compra)
      .input("id_proveedor", data.id_proveedor)
      .input("total", totalCompra)
      .query(`
        INSERT INTO Compras (id_compra, id_proveedor, total)
        VALUES (@id_compra, @id_proveedor, @total)
      `);

    // 4️⃣ Insertar detalles y actualizar stock
    for (const item of data.detalles) {

      // Obtener nuevo id_detalle_compra
      const idDetalleResult = await request.query(`
        SELECT ISNULL(MAX(id_detalle_compra), 0) + 1 AS nextId 
        FROM Detalle_Compra
      `);

      const id_detalle_compra = idDetalleResult.recordset[0].nextId;
      const subtotal = item.cantidad * item.costo_unitario;

      // Insertar detalle
      await request
        .input("id_detalle_compra", id_detalle_compra)
        .input("id_compra", id_compra)
        .input("id_producto", item.id_producto)
        .input("cantidad", item.cantidad)
        .input("costo_unitario", item.costo_unitario)
        .input("subtotal", subtotal)
        .query(`
          INSERT INTO Detalle_Compra
          (id_detalle_compra, id_compra, id_producto, cantidad, costo_unitario, subtotal)
          VALUES
          (@id_detalle_compra, @id_compra, @id_producto, @cantidad, @costo_unitario, @subtotal)
        `);

      // Actualizar stock
      await request
        .input("id_producto", item.id_producto)
        .input("cantidad", item.cantidad)
        .query(`
          UPDATE Productos
          SET stock = stock + @cantidad
          WHERE id_producto = @id_producto
        `);
    }

    await transaction.commit();

    return { message: "Compra registrada correctamente", id_compra };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getAllCompras = async () => {
  return await repository.getAllCompras();
};

export const getCompraById = async (id_compra: number) => {
  return await repository.getCompraById(id_compra);
};

export const updateCompra = async (id_compra: number, data: any) => {
  // Note: Updating purchases might not be common, but for completeness
  await repository.updateCompra(id_compra, data);
  return { message: "Compra actualizada correctamente" };
};

export const deleteCompra = async (id_compra: number) => {
  // Note: Deleting purchases might affect stock, but for simplicity
  await repository.deleteCompra(id_compra);
  return { message: "Compra eliminada correctamente" };
};