import sql from "mssql";
import { pool } from "../../config/database";



// Crear cita
export const crearCita = async (data: any) => {
  const request = pool.request();

  // Generar ID manual
  const idResult = await request.query(`
    SELECT ISNULL(MAX(id_cita),0) + 1 AS nextId FROM Citas
  `);

  const id_cita = idResult.recordset[0].nextId;

  // Validar horario duplicado (no importa servicio)
  const existe = await request
    .input("fecha", data.fecha)
    .input("hora", data.hora)
    .input("id_barbero", data.id_barbero)
    .query(`
      SELECT * FROM Citas
      WHERE fecha = @fecha
      AND hora = @hora
      AND id_barbero = @id_barbero
      AND estado IN ('pendiente','confirmada')
    `);

  if (existe.recordset.length > 0) {
    throw new Error("El barbero ya tiene una cita en ese horario");
  }

  await request
    .input("id_cita", id_cita)
    .input("id_cliente", data.id_cliente)
    .input("id_barbero", data.id_barbero)
    .input("id_servicio", data.id_servicio || null)
    .input("fecha", data.fecha)
    .input("hora", data.hora)
    .query(`
      INSERT INTO Citas 
      (id_cita, id_cliente, id_barbero, id_servicio, fecha, hora)
      VALUES 
      (@id_cita, @id_cliente, @id_barbero, @id_servicio, @fecha, @hora)
    `);

  return { message: "Cita creada correctamente", id_cita };
};

export const listarCitas = async () => {
  const result = await pool.request().query(`
    SELECT 
      c.id_cita,
      c.fecha,
      c.hora,
      c.estado,
      c.notificado,
      cl.nombre AS cliente,
      b.nombre AS barbero,
      s.nombre AS servicio
    FROM Citas c
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    JOIN Barberos b ON c.id_barbero = b.id_barbero
    LEFT JOIN Servicios s ON c.id_servicio = s.id_servicio
    ORDER BY c.fecha, c.hora
  `);

  return result.recordset;
};

export const cambiarEstado = async (id: number, estado: string) => {
  const estadosValidos = ['pendiente','confirmada','completado','cancelado'];

  if (!estadosValidos.includes(estado)) {
    throw new Error("Estado no válido");
  }

  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 🔎 Obtener cita actual
    const citaResult = await request
      .input("id_cita", id)
      .query(`SELECT * FROM Citas WHERE id_cita = @id_cita`);

    const cita = citaResult.recordset[0];

    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    // 🚫 BLOQUEO 1: Ya completada
    if (cita.estado === "completado") {
      throw new Error("La cita ya está completada");
    }

    // 🚫 BLOQUEO 2: Ya tiene venta
    if (cita.id_factura) {
      throw new Error("La cita ya tiene una venta asociada");
    }

    // Actualizar estado
    await request
      .input("estado", estado)
      .query(`
        UPDATE Citas
        SET estado = @estado
        WHERE id_cita = @id_cita
      `);

    // 🔥 SI SE COMPLETA → CREAR VENTA
    if (estado === "completado") {

      if (!cita.id_servicio) {
        throw new Error("La cita no tiene servicio asignado");
      }

      const servicioResult = await request
        .input("id_servicio", cita.id_servicio)
        .query(`
          SELECT precio, porcentaje_barbero
          FROM Servicios
          WHERE id_servicio = @id_servicio
        `);

      const servicio = servicioResult.recordset[0];

      const subtotal = servicio.precio;
      const ganancia_barbero =
        (subtotal * servicio.porcentaje_barbero) / 100;

      // Generar factura
      const idFacturaResult = await request.query(`
        SELECT ISNULL(MAX(id_factura),0) + 1 AS nextId FROM Ventas
      `);

      const id_factura = idFacturaResult.recordset[0].nextId;

      // Insertar venta
      await request
        .input("id_factura", id_factura)
        .input("id_cliente", cita.id_cliente)
        .input("total", subtotal)
        .query(`
          INSERT INTO Ventas (id_factura, id_cliente, total)
          VALUES (@id_factura, @id_cliente, @total)
        `);

      // Asociar venta a cita
      await request
        .input("id_factura", id_factura)
        .query(`
          UPDATE Citas
          SET id_factura = @id_factura
          WHERE id_cita = @id_cita
        `);

      // Insertar detalle servicio (igual que antes)
      const idDetalleResult = await request.query(`
        SELECT ISNULL(MAX(id_detalle_servicio),0) + 1 AS nextId 
        FROM Detalle_Venta_Servicio
      `);

      const id_detalle_servicio =
        idDetalleResult.recordset[0].nextId;

      await request
        .input("id_detalle_servicio", id_detalle_servicio)
        .input("id_factura", id_factura)
        .input("id_servicio", cita.id_servicio)
        .input("id_barbero", cita.id_barbero)
        .input("cantidad", 1)
        .input("precio_unitario", subtotal)
        .input("subtotal", subtotal)
        .input("porcentaje_barbero", servicio.porcentaje_barbero)
        .input("ganancia_barbero", ganancia_barbero)
        .query(`
          INSERT INTO Detalle_Venta_Servicio
          (id_detalle_servicio, id_factura, id_servicio, id_barbero,
           cantidad, precio_unitario, subtotal,
           porcentaje_barbero, ganancia_barbero)
          VALUES
          (@id_detalle_servicio, @id_factura, @id_servicio, @id_barbero,
           @cantidad, @precio_unitario, @subtotal,
           @porcentaje_barbero, @ganancia_barbero)
        `);
    }

    await transaction.commit();
    return { message: "Estado actualizado correctamente" };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const marcarNotificado = async (id: number) => {
  await pool
    .request()
    .input("id_cita", id)
    .query(`
      UPDATE Citas
      SET notificado = 1
      WHERE id_cita = @id_cita
    `);

  return { message: "Cita marcada como notificada" };
};

export const obtenerCitaConVenta = async (id: number) => {
  const request = pool.request();

  // Obtener cita
  const citaResult = await request
    .input("id_cita", id)
    .query(`
      SELECT c.*, 
             cl.nombre AS cliente,
             b.nombre AS barbero,
             s.nombre AS servicio
      FROM Citas c
      JOIN Clientes cl ON c.id_cliente = cl.id_cliente
      JOIN Barberos b ON c.id_barbero = b.id_barbero
      LEFT JOIN Servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = @id_cita
    `);

  const cita = citaResult.recordset[0];

  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  let venta = null;
  let detalle = null;

  if (cita.id_factura) {

    // Obtener venta
    const ventaResult = await request
      .input("id_factura", cita.id_factura)
      .query(`
        SELECT * FROM Ventas
        WHERE id_factura = @id_factura
      `);

    venta = ventaResult.recordset[0];

    // Obtener detalle servicio
    const detalleResult = await request
      .input("id_factura", cita.id_factura)
      .query(`
        SELECT d.*, s.nombre AS servicio
        FROM Detalle_Venta_Servicio d
        JOIN Servicios s ON d.id_servicio = s.id_servicio
        WHERE d.id_factura = @id_factura
      `);

    detalle = detalleResult.recordset;
  }

  return {
    cita,
    venta,
    detalle_servicio: detalle
  };
};