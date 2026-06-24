import sql from "mssql";
import { pool } from "../../config/database";


export const getVentas = async () => {
  const result = await pool.request().query(`
    SELECT 
      v.id_ventas,
      v.id_cliente,
      v.id_barbero,
      v.id_estado,
      v.fecha,
      v.total,
      u_cliente.nombre AS cliente,
      u_cliente.id_usuario AS id_usuario_cliente,
      u_barbero.nombre AS vendedor,
      u_barbero.id_usuario AS id_usuario_barbero,
      ev.nombre_estado AS estado_nombre
    FROM Ventas v
    INNER JOIN Clientes c ON v.id_cliente = c.id_cliente
    INNER JOIN Usuarios u_cliente ON c.id_usuario = u_cliente.id_usuario
    INNER JOIN Barberos b ON v.id_barbero = b.id_barbero
    INNER JOIN Usuarios u_barbero ON b.id_usuario = u_barbero.id_usuario
    LEFT JOIN Estado_Venta ev ON v.id_estado = ev.id_estado
    ORDER BY v.fecha DESC
  `);

  const ventas = result.recordset;

  for (const venta of ventas) {
    const productosResult = await pool.request()
      .input("id_ventas", venta.id_ventas)
      .query(`
        SELECT
               d.id_producto,
               p.nombre AS nombre_producto,
               d.cantidad,
               d.precio_unitario,
               d.subtotal
        FROM Detalle_Venta_Producto d
        JOIN Productos p ON d.id_producto = p.id_producto
        WHERE d.id_ventas = @id_ventas
      `);

    const serviciosResult = await pool.request()
      .input("id_ventas", venta.id_ventas)
      .query(`
        SELECT d.id_detalle_servicio,
               d.id_servicio,
               s.nombre AS nombre_servicio,
               d.id_barbero,
               d.cantidad,
               d.precio_unitario,
               d.subtotal,
               d.porcentaje_barbero,
               d.ganancia_barbero
        FROM Detalle_Venta_Servicio d
        JOIN Servicios s ON d.id_servicio = s.id_servicio
        WHERE d.id_ventas = @id_ventas
      `);

    venta.productos = productosResult.recordset;
    venta.servicios = serviciosResult.recordset;
  }

  return ventas;
};

export const crearVenta = async (data: any) => {
  console.log('crearVenta called with data:', data);
  const transaction = new sql.Transaction(pool);

  try {
    console.log('Beginning transaction');
    await transaction.begin();
    const request = new sql.Request(transaction);

    // 1️⃣ Generar nuevo id_ventas
    console.log('Generating id_ventas');
    const idFacturaResult = await request.query(`
      SELECT ISNULL(MAX(id_ventas), 0) + 1 AS nextId FROM Ventas
    `);

    const id_ventas = idFacturaResult.recordset[0].nextId;
    console.log('id_ventas:', id_ventas);

    let totalVenta = 0;

    // Calcular total primero (sin inserts aún)
    if (data.productos) {
      for (const item of data.productos) {
        totalVenta += item.cantidad * item.precio_unitario;
      }
    }
    if (data.servicios) {
      for (const item of data.servicios) {
        totalVenta += item.cantidad * item.precio_unitario;
      }
    }

    // 2️⃣ INSERTAR EN VENTAS PRIMERO (antes de detalles)
    console.log('Inserting into Ventas, totalVenta:', totalVenta);
    await request
      .input("id_ventas", id_ventas)
      .input("id_cliente", data.id_cliente)
      .input("id_barbero", data.id_barbero)
      .input("id_estado", data.id_estado)
      .input("fecha", data.fecha)
      .input("total", totalVenta)
      .query(`
        INSERT INTO Ventas (id_ventas, id_cliente, id_barbero, id_estado, fecha, total)
        VALUES (@id_ventas, @id_cliente, @id_barbero, @id_estado, @fecha, @total)
      `);
    console.log('Inserted into Ventas');

    // 3️⃣ Ahora procesar productos (después de Ventas)
    if (data.productos) {
      console.log('Processing productos:', data.productos);
      for (const item of data.productos) {
        console.log('Processing product:', item);
        const subtotal = item.cantidad * item.precio_unitario;

        // Validar stock
        const stockRequest = new sql.Request(transaction);
        const stockResult = await stockRequest
          .input("id_producto", item.id_producto)
          .query(`
            SELECT stock FROM Productos WHERE id_producto = @id_producto
          `);

        const stockActual = stockResult.recordset[0]?.stock;

        if (stockActual === undefined) {
          throw new Error(`Producto ${item.id_producto} no encontrado`);
        }

        if (stockActual < item.cantidad) {
          throw new Error(`Stock insuficiente para producto ${item.id_producto}`);
        }

        const idDetalleProdRequest = new sql.Request(transaction);
        const idDetalleProdResult = await idDetalleProdRequest.query(`
          SELECT ISNULL(MAX(id_detalle_producto), 0) + 1 AS nextId 
          FROM Detalle_Venta_Producto
        `);

        const id_detalle_producto = idDetalleProdResult.recordset[0].nextId;
        console.log('id_detalle_producto:', id_detalle_producto);

        // Insertar detalle producto
        const insertRequest = new sql.Request(transaction);
        await insertRequest
          .input("id_detalle_producto", id_detalle_producto)
          .input("id_ventas", id_ventas)
          .input("id_producto", item.id_producto)
          .input("cantidad", item.cantidad)
          .input("precio_unitario", item.precio_unitario)
          .input("subtotal", subtotal)
          .query(`
            INSERT INTO Detalle_Venta_Producto
            (id_detalle_producto, id_ventas, id_producto, cantidad, precio_unitario, subtotal)
            VALUES
            (@id_detalle_producto, @id_ventas, @id_producto, @cantidad, @precio_unitario, @subtotal)
          `);
        console.log('Inserted detalle producto');

        // Descontar stock
        const updateRequest = new sql.Request(transaction);
        await updateRequest
          .input("id_producto", item.id_producto)
          .input("cantidad", item.cantidad)
          .query(`
            UPDATE Productos
            SET stock = stock - @cantidad
            WHERE id_producto = @id_producto
          `);
        console.log('Updated stock');
      }
    }

    // 4️⃣ Procesar servicios (después de Ventas)
    if (data.servicios) {
      for (const item of data.servicios) {
        const subtotal = item.cantidad * item.precio_unitario;

        const ganancia_barbero =
          (subtotal * item.porcentaje_barbero) / 100;

        const serviceRequest = new sql.Request(transaction);
        const idDetalleServResult = await serviceRequest.query(`
          SELECT ISNULL(MAX(id_detalle_servicio), 0) + 1 AS nextId 
          FROM Detalle_Venta_Servicio
        `);

        const id_detalle_servicio =
          idDetalleServResult.recordset[0].nextId;

        await serviceRequest
          .input("id_detalle_servicio", id_detalle_servicio)
          .input("id_ventas", id_ventas)
          .input("id_servicio", item.id_servicio)
          .input("id_barbero", item.id_barbero)
          .input("cantidad", item.cantidad)
          .input("precio_unitario", item.precio_unitario)
          .input("subtotal", subtotal)
          .input("porcentaje_barbero", item.porcentaje_barbero)
          .input("ganancia_barbero", ganancia_barbero)
          .query(`
            INSERT INTO Detalle_Venta_Servicio
            (id_detalle_servicio, id_ventas, id_servicio, id_barbero,
             cantidad, precio_unitario, subtotal,
             porcentaje_barbero, ganancia_barbero)
            VALUES
            (@id_detalle_servicio, @id_ventas, @id_servicio, @id_barbero,
             @cantidad, @precio_unitario, @subtotal,
             @porcentaje_barbero, @ganancia_barbero)
          `);
      }
    }

    await transaction.commit();
    console.log('Transaction committed');

    return { message: "Venta registrada correctamente", id_ventas };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getVentaById = async (id: number) => {
  const request = pool.request();
  request.input("id_ventas", id);

  const venta = await request.query(`
    SELECT * FROM Ventas WHERE id_ventas = @id_ventas
  `);

  const productos = await request.query(`
    SELECT d.*, p.nombre
    FROM Detalle_Venta_Producto d
    JOIN Productos p ON d.id_producto = p.id_producto
    WHERE id_ventas = @id_ventas
  `);

  const servicios = await request.query(`
    SELECT d.*, s.nombre
    FROM Detalle_Venta_Servicio d
    JOIN Servicios s ON d.id_servicio = s.id_servicio
    WHERE id_ventas = @id_ventas
  `);

  return {
    venta: venta.recordset[0],
    productos: productos.recordset,
    servicios: servicios.recordset,
  };
};

export const reportePorFecha = async (desde: string, hasta: string) => {
  const result = await pool
    .request()
    .input("desde", desde)
    .input("hasta", hasta)
    .query(`
      SELECT *
      FROM Ventas
      WHERE fecha BETWEEN @desde AND @hasta
      ORDER BY fecha
    `);

  return result.recordset;
};

export const reporteGananciaBarbero = async () => {
  const result = await pool.request().query(`
    SELECT 
      b.nombre,
      SUM(d.ganancia_barbero) AS total_ganado
    FROM Detalle_Venta_Servicio d
    JOIN Barberos b ON d.id_barbero = b.id_barbero
    GROUP BY b.nombre
  `);

  return result.recordset;
};

export const updateVenta = async (id: number, data: any) => {
  // Campos permitidos para actualizar
  const allowedFields = ['id_cliente', 'total', 'id_estado', 'id_barbero'];
  
  // Construir dinámicamente los campos a actualizar
  const updateFields: string[] = [];
  const request = pool.request().input('id', id);
  
  for (const field of allowedFields) {
    if (data[field] !== undefined && data[field] !== null) {
      updateFields.push(`${field} = @${field}`);
      request.input(field, data[field]);
    }
  }
  
  // Si no hay campos para actualizar, lanzar error
  if (updateFields.length === 0) {
    throw new Error('No hay campos válidos para actualizar. Campos permitidos: ' + allowedFields.join(', '));
  }
  
  // Validar que la venta existe
  const ventaExists = await pool.request()
    .input('id_ventas', id)
    .query('SELECT id_ventas FROM Ventas WHERE id_ventas = @id_ventas');
  
  if (ventaExists.recordset.length === 0) {
    throw new Error('Venta no encontrada');
  }
  
  // Validar id_estado si se está actualizando
  if (data.id_estado !== undefined && data.id_estado !== null) {
    const estadoExists = await pool.request()
      .input('id_estado', data.id_estado)
      .query('SELECT id_estado FROM Estado_Venta WHERE id_estado = @id_estado');
    
    if (estadoExists.recordset.length === 0) {
      throw new Error(`Estado de venta con id ${data.id_estado} no existe`);
    }
    
    // Si se está cambiando a estado cancelado (id_estado = 3 es cancelado), restaurar stock
    if (data.id_estado === 3) {
      // Obtener los productos de la venta
      const productosVenta = await pool.request()
        .input('id_ventas', id)
        .query(`
          SELECT id_producto, cantidad
          FROM Detalle_Venta_Producto
          WHERE id_ventas = @id_ventas
        `);
      
      // Restaurar stock para cada producto
      for (const producto of productosVenta.recordset) {
        await pool.request()
          .input('id_producto', producto.id_producto)
          .input('cantidad', producto.cantidad)
          .query(`
            UPDATE Productos
            SET stock = stock + @cantidad
            WHERE id_producto = @id_producto
          `);
      }
    }
  }
  
  // Validar id_cliente si se está actualizando
  if (data.id_cliente !== undefined && data.id_cliente !== null) {
    const clienteExists = await pool.request()
      .input('id_cliente', data.id_cliente)
      .query('SELECT id_cliente FROM Clientes WHERE id_cliente = @id_cliente');
    
    if (clienteExists.recordset.length === 0) {
      throw new Error(`Cliente con id ${data.id_cliente} no existe`);
    }
  }
  
  // Validar id_barbero si se está actualizando
  if (data.id_barbero !== undefined && data.id_barbero !== null) {
    const barberoExists = await pool.request()
      .input('id_barbero', data.id_barbero)
      .query('SELECT id_barbero FROM Barberos WHERE id_barbero = @id_barbero');
    
    if (barberoExists.recordset.length === 0) {
      throw new Error(`Barbero con id ${data.id_barbero} no existe`);
    }
  }
  
  const query = `UPDATE Ventas SET ${updateFields.join(', ')} WHERE id_ventas = @id`;
  
  console.log('updateVenta - ejecutando UPDATE', {
    id_ventas: id,
    updateFields,
    query
  });
  
  try {
    const result = await request.query(query);
    console.log('updateVenta - UPDATE completado', {
      id_ventas: id,
      rowsAffected: result.rowsAffected?.[0] || 0
    });
    return result;
  } catch (error) {
    console.error('updateVenta - ERROR en UPDATE', {
      id_ventas: id,
      error: (error as Error).message
    });
    throw error;
  }
};

export const deleteVenta = async (id: number) => {
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    await request.input("id", id).query("DELETE FROM Detalle_Venta_Producto WHERE id_ventas = @id");
    await request.input("id", id).query("DELETE FROM Detalle_Venta_Servicio WHERE id_ventas = @id");
    await request.input("id", id).query("DELETE FROM Ventas WHERE id_ventas = @id");
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};