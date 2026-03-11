import sql from "mssql";
import { pool } from "../../config/database";

export const crearFactura = async (data: any) => {
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    const facturaResult = await request
      .input("cliente_id", data.cliente_id)
      .query(`
        INSERT INTO facturas (cliente_id, fecha)
        OUTPUT INSERTED.id
        VALUES (@cliente_id, GETDATE())
      `);

    const facturaId = facturaResult.recordset[0].id;

    for (const item of data.detalles) {
      await request
        .input("factura_id", facturaId)
        .input("producto_id", item.producto_id)
        .input("cantidad", item.cantidad)
        .query(`
          INSERT INTO factura_detalle (factura_id, producto_id, cantidad)
          VALUES (@factura_id, @producto_id, @cantidad)
        `);
    }

    await transaction.commit();
    return { message: "Factura creada" };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};