"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerHorasDisponibles = exports.eliminarCita = exports.obtenerCitaConVenta = exports.marcarNotificado = exports.actualizarCita = exports.cambiarEstado = exports.listarCitas = exports.crearCita = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
// Crear cita
const crearCita = async (data) => {
    if (!data.id_cliente && !data.guest_nombre) {
        throw new Error("Se requiere un cliente registrado o los datos del cliente invitado");
    }
    if (!data.id_cliente) {
        if (!data.guest_nombre || !data.guest_email || !data.guest_telefono) {
            throw new Error("Para reservas desde landing se requieren guest_nombre, guest_email y guest_telefono");
        }
    }
    else {
        const clienteResult = await database_1.pool.request()
            .input("id_cliente", data.id_cliente)
            .query(`SELECT id_cliente FROM Clientes WHERE id_cliente = @id_cliente`);
        if (clienteResult.recordset.length === 0) {
            throw new Error("Cliente registrado no encontrado");
        }
    }
    // Generar ID manual
    const idResult = await database_1.pool.request().query(`
    SELECT ISNULL(MAX(id_cita),0) + 1 AS nextId FROM Citas
  `);
    const id_cita = idResult.recordset[0].nextId;
    // Validar que el barbero existe y obtener su horario laboral
    const barberoResult = await database_1.pool.request()
        .input("id_barbero", data.id_barbero)
        .query(`
      SELECT hora_inicio, hora_fin FROM Barberos
      WHERE id_barbero = @id_barbero
    `);
    if (barberoResult.recordset.length === 0) {
        throw new Error("Barbero no encontrado");
    }
    const barbero = barberoResult.recordset[0];
    const horaInicio = barbero.hora_inicio;
    const horaFin = barbero.hora_fin;
    // Validar que la hora está dentro del horario laboral
    if (data.hora < horaInicio || data.hora >= horaFin) {
        throw new Error(`El barbero solo trabaja entre ${horaInicio} y ${horaFin}`);
    }
    // Validar horario duplicado (no importa servicio)
    const existe = await database_1.pool.request()
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
    await database_1.pool.request()
        .input("id_cita", id_cita)
        .input("id_cliente", data.id_cliente || null)
        .input("id_barbero", data.id_barbero)
        .input("id_servicio", data.id_servicio || null)
        .input("fecha", data.fecha)
        .input("hora", data.hora)
        .input("guest_nombre", data.guest_nombre || null)
        .input("guest_email", data.guest_email || null)
        .input("guest_telefono", data.guest_telefono || null)
        .query(`
      INSERT INTO Citas 
      (id_cita, id_cliente, id_barbero, id_servicio, fecha, hora, guest_nombre, guest_email, guest_telefono)
      VALUES 
      (@id_cita, @id_cliente, @id_barbero, @id_servicio, @fecha, @hora, @guest_nombre, @guest_email, @guest_telefono)
    `);
    // Insertar productos si se enviaron
    if (Array.isArray(data.productos) && data.productos.length > 0) {
        for (const producto of data.productos) {
            await database_1.pool.request()
                .input("id_cita", id_cita)
                .input("id_producto", producto.id_producto)
                .input("cantidad", producto.cantidad)
                .input("precio_unitario", producto.precio_unitario)
                .query(`
          INSERT INTO Cita_Productos (id_cita, id_producto, cantidad, precio_unitario)
          VALUES (@id_cita, @id_producto, @cantidad, @precio_unitario)
        `);
        }
    }
    return { message: "Cita creada correctamente", id_cita };
};
exports.crearCita = crearCita;
const listarCitas = async () => {
    const result = await database_1.pool.request().query(`
    SELECT 
      c.id_cita,
      c.id_cliente,
      c.id_barbero,
      c.id_servicio,
      c.fecha,
      c.hora,
      c.estado,
      c.notificado,
      COALESCE(u_cliente.nombre, c.guest_nombre) AS cliente_nombre,
      COALESCE(u_cliente.email, c.guest_email) AS cliente_email,
      c.guest_telefono,
      u_barbero.nombre AS barbero_nombre,
      s.nombre AS servicio_nombre
    FROM Citas c
    LEFT JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN Usuarios u_cliente ON cl.id_usuario = u_cliente.id_usuario
    JOIN Barberos b ON c.id_barbero = b.id_barbero
    JOIN Usuarios u_barbero ON b.id_usuario = u_barbero.id_usuario
    LEFT JOIN Servicios s ON c.id_servicio = s.id_servicio
    ORDER BY c.fecha, c.hora
  `);
    // Convertir horas de formato ISO a HH:MM
    const citas = result.recordset.map((cita) => {
        if (cita.hora && typeof cita.hora === 'string' && cita.hora.includes('T')) {
            const timeMatch = cita.hora.match(/T(\d{2}):(\d{2}):/);
            if (timeMatch) {
                cita.hora = `${timeMatch[1]}:${timeMatch[2]}`;
            }
        }
        return cita;
    });
    // Obtener productos para cada cita
    for (const cita of citas) {
        const productosResult = await database_1.pool.request()
            .input("id_cita", cita.id_cita)
            .query(`
        SELECT cp.id_producto, cp.cantidad, cp.precio_unitario, p.nombre AS producto_nombre
        FROM Cita_Productos cp
        JOIN Productos p ON cp.id_producto = p.id_producto
        WHERE cp.id_cita = @id_cita
      `);
        cita.productos = productosResult.recordset;
    }
    return citas;
};
exports.listarCitas = listarCitas;
const cambiarEstado = async (id, estado) => {
    const estadosValidos = ['pendiente', 'confirmada', 'completado', 'cancelado', 'en_ejecucion'];
    if (!estadosValidos.includes(estado)) {
        throw new Error("Estado no válido");
    }
    const transaction = new mssql_1.default.Transaction(database_1.pool);
    try {
        await transaction.begin();
        const request = new mssql_1.default.Request(transaction);
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
        if (cita.id_ventas) {
            throw new Error("La cita ya tiene una venta asociada");
        }
        // Si cambia a "confirmada", calcular hora_fin_real
        if (estado === "confirmada") {
            if (!cita.id_servicio) {
                throw new Error("La cita debe tener un servicio para confirmarla");
            }
            // Obtener duración del servicio
            let reqServicio = new mssql_1.default.Request(transaction);
            const servicioResult = await reqServicio
                .input("id_servicio", cita.id_servicio)
                .query(`SELECT duracion FROM Servicios WHERE id_servicio = @id_servicio`);
            if (servicioResult.recordset.length === 0) {
                throw new Error("Servicio no encontrado");
            }
            const duracion = servicioResult.recordset[0].duracion; // en minutos
            // Convertir hora a string si es objeto Time de SQL
            let horaStr = cita.hora;
            if (typeof cita.hora !== 'string') {
                // Si es un objeto Date o Time de SQL, convertir a string HH:mm
                horaStr = `${String(cita.hora.getHours ? cita.hora.getHours() : 0).padStart(2, '0')}:${String(cita.hora.getMinutes ? cita.hora.getMinutes() : 0).padStart(2, '0')}`;
            }
            else if (horaStr.includes('T')) {
                // Si viene en formato ISO, extraer solo la hora
                const timeMatch = horaStr.match(/T(\d{2}):(\d{2}):/);
                if (timeMatch) {
                    horaStr = `${timeMatch[1]}:${timeMatch[2]}`;
                }
            }
            // Calcular hora_fin_real sumando la duración a la hora de la cita
            const [horas, minutos] = horaStr.split(':').map(Number);
            const horaInicio = new Date();
            horaInicio.setHours(horas, minutos, 0, 0);
            const horaFin = new Date(horaInicio.getTime() + duracion * 60000);
            const horaFinFormato = `${String(horaFin.getHours()).padStart(2, '0')}:${String(horaFin.getMinutes()).padStart(2, '0')}:00`;
            // Actualizar ambos: estado y hora_fin_real
            let reqUpdate = new mssql_1.default.Request(transaction);
            await reqUpdate
                .input("id_cita", id)
                .input("estado", estado)
                .input("hora_fin_real", horaFinFormato)
                .input("estado_tiempo", "pendiente")
                .query(`
          UPDATE Citas
          SET estado = @estado, hora_fin_real = @hora_fin_real, estado_tiempo = @estado_tiempo
          WHERE id_cita = @id_cita
        `);
        }
        else if (estado === "en_ejecucion") {
            if (cita.estado !== "confirmada") {
                throw new Error("Solo se puede marcar en ejecución cuando la cita está confirmada");
            }
            const normalizeTime = (timeValue) => {
                if (!timeValue)
                    return null;
                if (typeof timeValue === 'string') {
                    const match = timeValue.match(/(\d{2}):(\d{2})/);
                    if (match) {
                        return `${match[1]}:${match[2]}`;
                    }
                }
                if (timeValue instanceof Date) {
                    return `${String(timeValue.getHours()).padStart(2, '0')}:${String(timeValue.getMinutes()).padStart(2, '0')}`;
                }
                return null;
            };
            const horaInicioStr = normalizeTime(cita.hora);
            let horaFinStr = normalizeTime(cita.hora_fin_real);
            if (!horaInicioStr) {
                throw new Error("Hora de la cita inválida");
            }
            if (!horaFinStr) {
                if (!cita.id_servicio) {
                    throw new Error("No se puede calcular la hora de fin sin servicio asignado");
                }
                let reqServicio = new mssql_1.default.Request(transaction);
                const servicioResult = await reqServicio
                    .input("id_servicio", cita.id_servicio)
                    .query(`SELECT duracion FROM Servicios WHERE id_servicio = @id_servicio`);
                if (servicioResult.recordset.length === 0) {
                    throw new Error("Servicio no encontrado");
                }
                const duracion = servicioResult.recordset[0].duracion;
                const [horas, minutos] = horaInicioStr.split(':').map(Number);
                const inicioDate = new Date();
                inicioDate.setHours(horas, minutos, 0, 0);
                const finDate = new Date(inicioDate.getTime() + duracion * 60000);
                horaFinStr = `${String(finDate.getHours()).padStart(2, '0')}:${String(finDate.getMinutes()).padStart(2, '0')}`;
            }
            const fechaParts = String(cita.fecha).split('-').map(Number);
            if (fechaParts.length !== 3 || fechaParts.some(isNaN)) {
                throw new Error("Fecha de la cita inválida");
            }
            const [anio, mes, dia] = fechaParts;
            const [horaInicio, minutoInicio] = horaInicioStr.split(':').map(Number);
            const [horaFin, minutoFin] = horaFinStr.split(':').map(Number);
            const inicioCita = new Date(anio, mes - 1, dia, horaInicio, minutoInicio, 0, 0);
            const finCita = new Date(anio, mes - 1, dia, horaFin, minutoFin, 0, 0);
            const ahora = new Date();
            if (ahora < inicioCita || ahora > finCita) {
                throw new Error("Solo se puede marcar en ejecución durante el horario de la cita");
            }
            let reqUpdateExecution = new mssql_1.default.Request(transaction);
            await reqUpdateExecution
                .input("id_cita", id)
                .input("estado", estado)
                .query(`
          UPDATE Citas
          SET estado = @estado
          WHERE id_cita = @id_cita
        `);
        }
        else if (estado === "completado") {
            // Calcular minutos de retraso y estado_tiempo
            const horaFinTeorica = cita.hora_fin_real; // Hora en la que debería terminar
            const horaFinReal = new Date(); // Hora actual (ahora que se marca como completado)
            // Convertir hora_fin_real a string si es objeto Time de SQL
            let horaFinTeorStr = horaFinTeorica;
            if (typeof horaFinTeorica !== 'string') {
                horaFinTeorStr = `${String(horaFinTeorica.getHours ? horaFinTeorica.getHours() : 0).padStart(2, '0')}:${String(horaFinTeorica.getMinutes ? horaFinTeorica.getMinutes() : 0).padStart(2, '0')}`;
            }
            else if (horaFinTeorStr.includes('T')) {
                const timeMatch = horaFinTeorStr.match(/T(\d{2}):(\d{2}):/);
                if (timeMatch) {
                    horaFinTeorStr = `${timeMatch[1]}:${timeMatch[2]}`;
                }
            }
            const [horasTeor, minutosTeor] = horaFinTeorStr.split(':').map(Number);
            const horaTeorDate = new Date();
            horaTeorDate.setHours(horasTeor, minutosTeor, 0, 0);
            const minutosRetraso = Math.floor((horaFinReal.getTime() - horaTeorDate.getTime()) / (60 * 1000));
            let estadoTiempo = 'a_tiempo';
            if (minutosRetraso > 30) {
                estadoTiempo = 'muy_retrasado';
            }
            else if (minutosRetraso > 0) {
                estadoTiempo = 'retrasado';
            }
            // Actualizar estado con los nuevos campos
            let reqUpdateComplete = new mssql_1.default.Request(transaction);
            await reqUpdateComplete
                .input("id_cita", id)
                .input("estado", estado)
                .input("minutos_retraso", Math.max(0, minutosRetraso))
                .input("estado_tiempo", estadoTiempo)
                .query(`
          UPDATE Citas
          SET estado = @estado, minutos_retraso = @minutos_retraso, estado_tiempo = @estado_tiempo
          WHERE id_cita = @id_cita
        `);
        }
        else {
            // Para otros estados (pendiente, cancelado), actualizar solo el estado
            let reqUpdateOther = new mssql_1.default.Request(transaction);
            await reqUpdateOther
                .input("id_cita", id)
                .input("estado", estado)
                .query(`
          UPDATE Citas
          SET estado = @estado
          WHERE id_cita = @id_cita
        `);
        }
        // 🔥 SI SE COMPLETA → CREAR VENTA
        if (estado === "completado") {
            console.log('cambiarEstado COMPLETADO - INICIANDO conversión de cita a venta', { id_cita: id, estado });
            let id_ventas;
            if (!cita.id_servicio) {
                throw new Error("La cita no tiene servicio asignado");
            }
            // Crear nuevo request para evitar conflicto de parámetros
            let req1 = new mssql_1.default.Request(transaction);
            const servicioResult = await req1
                .input("id_servicio", cita.id_servicio)
                .query(`
          SELECT precio, porcentaje_barbero
          FROM Servicios
          WHERE id_servicio = @id_servicio
        `);
            const servicio = servicioResult.recordset[0];
            let totalVenta = servicio.precio;
            const ganancia_barbero = (servicio.precio * servicio.porcentaje_barbero) / 100;
            // 🔍 Leer productos de la cita
            console.log('cambiarEstado COMPLETADO - LEYENDO productos de cita', { id_cita: id });
            let reqProductosCita = new mssql_1.default.Request(transaction);
            const productosCitaResult = await reqProductosCita
                .input("id_cita", id)
                .query(`
          SELECT cp.id_producto, cp.cantidad, cp.precio_unitario
          FROM Cita_Productos cp
          WHERE cp.id_cita = @id_cita
        `);
            const productosCita = productosCitaResult.recordset || [];
            console.log('cambiarEstado COMPLETADO - productosCita', { id_cita: id, productosCita, recordsetLength: productosCitaResult.recordset?.length });
            for (const prod of productosCita) {
                if (!prod || prod.id_producto == null) {
                    console.warn('cambiarEstado COMPLETADO - producto inválido en cita', { id_cita: id, prod });
                    continue;
                }
                totalVenta += Number(prod.cantidad || 0) * Number(prod.precio_unitario || 0);
            }
            // Generar factura - nuevo request
            let req2 = new mssql_1.default.Request(transaction);
            const idVentasResult = await req2.query(`
        SELECT ISNULL(MAX(id_ventas),0) + 1 AS nextId FROM Ventas
      `);
            id_ventas = idVentasResult.recordset[0].nextId;
            // Insertar venta - nuevo request
            let req3 = new mssql_1.default.Request(transaction);
            await req3
                .input("id_ventas", id_ventas)
                .input("id_cliente", cita.id_cliente)
                .input("id_barbero", cita.id_barbero)
                .input("id_estado", 1)
                .input("total", totalVenta)
                .query(`
          INSERT INTO Ventas (id_ventas, id_cliente, id_barbero, id_estado, fecha, total)
          VALUES (@id_ventas, @id_cliente, @id_barbero, @id_estado, GETDATE(), @total)
        `);
            // Asociar venta a cita - nuevo request
            let req4 = new mssql_1.default.Request(transaction);
            await req4
                .input("id_ventas", id_ventas)
                .input("id_cita", id)
                .query(`
          UPDATE Citas
          SET id_ventas = @id_ventas
          WHERE id_cita = @id_cita
        `);
            // Insertar detalle servicio - nuevo request
            let req5 = new mssql_1.default.Request(transaction);
            const idDetalleResult = await req5.query(`
        SELECT ISNULL(MAX(id_detalle_servicio),0) + 1 AS nextId 
        FROM Detalle_Venta_Servicio
      `);
            const id_detalle_servicio = idDetalleResult.recordset[0].nextId;
            // Insertar detalle - nuevo request
            let req6 = new mssql_1.default.Request(transaction);
            await req6
                .input("id_detalle_servicio", id_detalle_servicio)
                .input("id_ventas", id_ventas)
                .input("id_servicio", cita.id_servicio)
                .input("id_barbero", cita.id_barbero)
                .input("cantidad", 1)
                .input("precio_unitario", servicio.precio)
                .input("subtotal", servicio.precio)
                .input("porcentaje_barbero", servicio.porcentaje_barbero)
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
            // 📦 Insertar productos de la cita en la venta
            console.log('cambiarEstado COMPLETADO - INICIANDO inserción de productos', {
                id_cita: id,
                productosCitaCount: productosCita.length,
                productosCita: productosCita.map(p => ({ id: p.id_producto, cant: p.cantidad, precio: p.precio_unitario }))
            });
            let productosInsertados = 0;
            for (const producto of productosCita) {
                if (!producto || producto.id_producto == null) {
                    console.warn('cambiarEstado COMPLETADO - producto inválido en cita antes de insertar', { id_cita: id, producto });
                    continue;
                }
                console.log('cambiarEstado COMPLETADO - procesando producto', {
                    id_cita: id,
                    producto: { id: producto.id_producto, cant: producto.cantidad, precio: producto.precio_unitario }
                });
                let reqProducto = new mssql_1.default.Request(transaction);
                const idDetalleProductoResult = await reqProducto.query(`
          SELECT ISNULL(MAX(id_detalle_producto), 0) + 1 AS nextId
          FROM Detalle_Venta_Producto
        `);
                const id_detalle_producto = idDetalleProductoResult.recordset[0].nextId;
                const subtotalProducto = Number(producto.cantidad || 0) * Number(producto.precio_unitario || 0);
                console.log('cambiarEstado COMPLETADO - insertando Detalle_Venta_Producto', {
                    id_ventas,
                    id_detalle_producto,
                    id_producto: producto.id_producto,
                    cantidad: producto.cantidad,
                    precio_unitario: producto.precio_unitario,
                    subtotal: subtotalProducto,
                });
                const insertResult = await reqProducto
                    .input("id_detalle_producto", id_detalle_producto)
                    .input("id_ventas", id_ventas)
                    .input("id_producto", producto.id_producto)
                    .input("cantidad", producto.cantidad)
                    .input("precio_unitario", producto.precio_unitario)
                    .input("subtotal", subtotalProducto)
                    .query(`
            INSERT INTO Detalle_Venta_Producto
            (id_detalle_producto, id_ventas, id_producto, cantidad, precio_unitario, subtotal)
            VALUES
            (@id_detalle_producto, @id_ventas, @id_producto, @cantidad, @precio_unitario, @subtotal)
          `);
                console.log('cambiarEstado COMPLETADO - INSERT ejecutado', {
                    id_cita: id,
                    id_ventas,
                    id_detalle_producto,
                    rowsAffected: insertResult.rowsAffected?.[0] || 'unknown'
                });
                // Verificar que se insertó correctamente
                const verifyInsert = await new mssql_1.default.Request(transaction)
                    .input("id_detalle_producto", id_detalle_producto)
                    .query(`
            SELECT COUNT(*) as count FROM Detalle_Venta_Producto
            WHERE id_detalle_producto = @id_detalle_producto
          `);
                const insertCount = verifyInsert.recordset[0]?.count || 0;
                console.log('cambiarEstado COMPLETADO - verificación post-insert', {
                    id_cita: id,
                    id_detalle_producto,
                    insertCount
                });
                if (insertCount === 1) {
                    productosInsertados += 1;
                    console.log('cambiarEstado COMPLETADO - producto insertado exitosamente', {
                        id_cita: id,
                        productosInsertados
                    });
                }
                else {
                    console.error('cambiarEstado COMPLETADO - ERROR: producto no se insertó', {
                        id_cita: id,
                        id_detalle_producto,
                        insertCount
                    });
                }
            }
            console.log('cambiarEstado COMPLETADO - FINALIZANDO inserción de productos', {
                id_cita: id,
                productosCitaCount: productosCita.length,
                productosInsertados
            });
            const reqCountProductos = new mssql_1.default.Request(transaction);
            const countProductosResult = await reqCountProductos
                .input("id_ventas", id_ventas)
                .query(`
          SELECT COUNT(*) AS total FROM Detalle_Venta_Producto
          WHERE id_ventas = @id_ventas
        `);
            const totalProductosInsertados = countProductosResult.recordset[0]?.total || 0;
            console.log('cambiarEstado COMPLETADO - CONTEO FINAL de productos en DB', {
                id_cita: id,
                id_ventas,
                productosCitaCount: productosCita.length,
                productosInsertados,
                totalProductosInsertados,
                countQueryResult: countProductosResult.recordset
            });
            if (productosInsertados > 0 && totalProductosInsertados !== productosInsertados) {
                console.error('cambiarEstado COMPLETADO - ERROR DE CONTEO', {
                    id_cita: id,
                    id_ventas,
                    productosInsertados,
                    totalProductosInsertados
                });
                throw new Error(`Error al insertar productos de cita en Detalle_Venta_Producto: esperados ${productosInsertados}, insertados ${totalProductosInsertados}`);
            }
            console.log('cambiarEstado COMPLETADO - INSERCIÓN DE PRODUCTOS COMPLETADA', {
                id_cita: id,
                id_ventas,
                productosInsertados,
                totalProductosInsertados
            });
        }
        console.log('cambiarEstado - COMMIT de transacción', { id_cita: id, estado });
        await transaction.commit();
        console.log('cambiarEstado - TRANSACCIÓN COMMITED exitosamente', { id_cita: id, estado });
        return { message: "Estado actualizado correctamente" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.cambiarEstado = cambiarEstado;
const actualizarCita = async (id, data) => {
    const request = database_1.pool.request();
    const citaResult = await request
        .input("id_cita", id)
        .query(`SELECT * FROM Citas WHERE id_cita = @id_cita`);
    const cita = citaResult.recordset[0];
    if (!cita) {
        throw new Error("Cita no encontrada");
    }
    // ✅ SOLO validar conflictos si se cambian fecha/hora/barbero
    const isChangingSchedule = data.id_barbero !== undefined || data.hora !== undefined || data.fecha !== undefined;
    if (isChangingSchedule) {
        const targetBarberoId = data.id_barbero ?? cita.id_barbero;
        const targetHora = data.hora ?? cita.hora;
        const targetFecha = data.fecha ?? cita.fecha;
        // Validar horario laboral del barbero
        const barberoResult = await database_1.pool.request()
            .input("id_barbero", targetBarberoId)
            .query(`
        SELECT hora_inicio, hora_fin FROM Barberos
        WHERE id_barbero = @id_barbero
      `);
        if (barberoResult.recordset.length === 0) {
            throw new Error("Barbero no encontrado");
        }
        const barbero = barberoResult.recordset[0];
        const horaInicio = barbero.hora_inicio;
        const horaFin = barbero.hora_fin;
        if (targetHora < horaInicio || targetHora >= horaFin) {
            throw new Error(`El barbero solo trabaja entre ${horaInicio} y ${horaFin}`);
        }
        // Validar conflictos con otras citas
        const conflictResult = await database_1.pool.request()
            .input("fecha", targetFecha)
            .input("hora", targetHora)
            .input("id_barbero", targetBarberoId)
            .input("id_cita", id)
            .query(`
        SELECT * FROM Citas
        WHERE fecha = @fecha
        AND hora = @hora
        AND id_barbero = @id_barbero
        AND id_cita <> @id_cita
        AND estado IN ('pendiente','confirmada')
      `);
        if (conflictResult.recordset.length > 0) {
            throw new Error("El barbero ya tiene una cita en ese horario");
        }
    }
    const updateData = {};
    if (data.id_cliente !== undefined)
        updateData.id_cliente = data.id_cliente;
    if (data.id_barbero !== undefined)
        updateData.id_barbero = data.id_barbero;
    if (data.id_servicio !== undefined)
        updateData.id_servicio = data.id_servicio;
    if (data.fecha !== undefined)
        updateData.fecha = data.fecha;
    if (data.hora !== undefined)
        updateData.hora = data.hora;
    const hasEstadoChange = data.estado !== undefined && data.estado !== cita.estado;
    const stateLogicRequired = hasEstadoChange && ["confirmada", "completado", "en_ejecucion"].includes(data.estado);
    if (stateLogicRequired) {
        if (Object.keys(updateData).length > 0) {
            const setClauses = Object.keys(updateData).map((key) => `${key} = @${key}`);
            const updateRequest = database_1.pool.request().input("id_cita", id);
            Object.entries(updateData).forEach(([key, value]) => {
                updateRequest.input(key, value);
            });
            await updateRequest.query(`
        UPDATE Citas
        SET ${setClauses.join(", ")}
        WHERE id_cita = @id_cita
      `);
        }
        return await (0, exports.cambiarEstado)(id, data.estado);
    }
    const setClauses = Object.keys(updateData).map((key) => `${key} = @${key}`);
    if (hasEstadoChange) {
        setClauses.push("estado = @estado");
    }
    if (setClauses.length === 0) {
        throw new Error("No hay campos para actualizar");
    }
    const updateRequest = database_1.pool.request().input("id_cita", id);
    Object.entries(updateData).forEach(([key, value]) => {
        updateRequest.input(key, value);
    });
    if (hasEstadoChange) {
        updateRequest.input("estado", data.estado);
    }
    await updateRequest.query(`
    UPDATE Citas
    SET ${setClauses.join(", ")}
    WHERE id_cita = @id_cita
  `);
    // Manejar productos si se enviaron
    if (data.productos !== undefined) {
        // Eliminar productos existentes
        await database_1.pool.request()
            .input("id_cita", id)
            .query(`DELETE FROM Cita_Productos WHERE id_cita = @id_cita`);
        // Insertar nuevos productos
        if (Array.isArray(data.productos) && data.productos.length > 0) {
            for (const producto of data.productos) {
                await database_1.pool.request()
                    .input("id_cita", id)
                    .input("id_producto", producto.id_producto)
                    .input("cantidad", producto.cantidad)
                    .input("precio_unitario", producto.precio_unitario)
                    .query(`
            INSERT INTO Cita_Productos (id_cita, id_producto, cantidad, precio_unitario)
            VALUES (@id_cita, @id_producto, @cantidad, @precio_unitario)
          `);
            }
        }
    }
    return { message: "Cita actualizada correctamente" };
};
exports.actualizarCita = actualizarCita;
const marcarNotificado = async (id) => {
    await database_1.pool
        .request()
        .input("id_cita", id)
        .query(`
      UPDATE Citas
      SET notificado = 1
      WHERE id_cita = @id_cita
    `);
    return { message: "Cita marcada como notificada" };
};
exports.marcarNotificado = marcarNotificado;
const obtenerCitaConVenta = async (id) => {
    const request = database_1.pool.request();
    // Obtener cita
    const citaResult = await request
        .input("id_cita", id)
        .query(`
      SELECT c.*,
             COALESCE(u_cliente.nombre, c.guest_nombre) AS cliente,
             COALESCE(u_cliente.email, c.guest_email) AS cliente_email,
             c.guest_telefono,
             b.nombre AS barbero,
             s.nombre AS servicio
      FROM Citas c
      LEFT JOIN Clientes cl ON c.id_cliente = cl.id_cliente
      LEFT JOIN Usuarios u_cliente ON cl.id_usuario = u_cliente.id_usuario
      JOIN Barberos b ON c.id_barbero = b.id_barbero
      LEFT JOIN Servicios s ON c.id_servicio = s.id_servicio
      WHERE c.id_cita = @id_cita
    `);
    const cita = citaResult.recordset[0];
    if (!cita) {
        throw new Error("Cita no encontrada");
    }
    // Convertir hora de formato ISO a HH:MM
    if (cita.hora && typeof cita.hora === 'string' && cita.hora.includes('T')) {
        const timeMatch = cita.hora.match(/T(\d{2}):(\d{2}):/);
        if (timeMatch) {
            cita.hora = `${timeMatch[1]}:${timeMatch[2]}`;
        }
    }
    let venta = null;
    let detalle = null;
    if (cita.id_ventas) {
        // Obtener venta
        const ventaResult = await request
            .input("id_ventas", cita.id_ventas)
            .query(`
        SELECT * FROM Ventas
        WHERE id_ventas = @id_ventas
      `);
        venta = ventaResult.recordset[0];
        // Obtener detalle servicio
        const detalleResult = await request
            .input("id_ventas", cita.id_ventas)
            .query(`
        SELECT d.*, s.nombre AS servicio
        FROM Detalle_Venta_Servicio d
        JOIN Servicios s ON d.id_servicio = s.id_servicio
        WHERE d.id_ventas = @id_ventas
      `);
        detalle = detalleResult.recordset;
    }
    return {
        cita,
        venta,
        detalle_servicio: detalle
    };
};
exports.obtenerCitaConVenta = obtenerCitaConVenta;
const eliminarCita = async (id) => {
    const request = database_1.pool.request();
    // Verificar que la cita existe
    const citaResult = await request
        .input("id_cita", id)
        .query(`SELECT * FROM Citas WHERE id_cita = @id_cita`);
    const cita = citaResult.recordset[0];
    if (!cita) {
        throw new Error("Cita no encontrada");
    }
    // No permitir eliminar si tiene venta asociada
    if (cita.id_ventas) {
        throw new Error("No se puede eliminar una cita con venta asociada");
    }
    // Eliminar productos asociados primero
    await database_1.pool.request()
        .input("id_cita", id)
        .query(`DELETE FROM Cita_Productos WHERE id_cita = @id_cita`);
    // Eliminar la cita
    const req2 = database_1.pool.request();
    await req2
        .input("id_cita", id)
        .query(`DELETE FROM Citas WHERE id_cita = @id_cita`);
    return { message: "Cita eliminada correctamente" };
};
exports.eliminarCita = eliminarCita;
const obtenerHorasDisponibles = async (id_barbero, fecha) => {
    // Obtener horario laboral del barbero
    const barberoResult = await database_1.pool.request()
        .input("id_barbero", id_barbero)
        .query(`
      SELECT hora_inicio, hora_fin FROM Barberos
      WHERE id_barbero = @id_barbero
    `);
    if (barberoResult.recordset.length === 0) {
        throw new Error("Barbero no encontrado");
    }
    const { hora_inicio, hora_fin } = barberoResult.recordset[0];
    // Obtener citas existentes del barbero en esa fecha
    const citasResult = await database_1.pool.request()
        .input("id_barbero", id_barbero)
        .input("fecha", fecha)
        .query(`
      SELECT hora FROM Citas
      WHERE id_barbero = @id_barbero
      AND fecha = @fecha
      AND estado IN ('pendiente','confirmada')
      ORDER BY hora
    `);
    const horasOcupadas = citasResult.recordset.map((cita) => cita.hora);
    // Generar todas las horas disponibles (intervalos de 1 hora)
    const horasDisponibles = [];
    const inicio = parseInt(hora_inicio.split(":")[0]);
    const fin = parseInt(hora_fin.split(":")[0]);
    for (let hora = inicio; hora < fin; hora++) {
        const horaFormato = `${String(hora).padStart(2, "0")}:00`;
        if (!horasOcupadas.includes(horaFormato)) {
            horasDisponibles.push(horaFormato);
        }
    }
    return horasDisponibles;
};
exports.obtenerHorasDisponibles = obtenerHorasDisponibles;
