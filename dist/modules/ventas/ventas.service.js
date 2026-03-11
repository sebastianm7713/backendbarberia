"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteGananciaBarbero = exports.reportePorFecha = exports.getVentaById = exports.crearVenta = exports.getVentas = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
const getVentas = async () => {
    const result = await database_1.pool.request().query(`
    SELECT v.id_factura, v.fecha, v.total, c.nombre AS cliente
    FROM Ventas v
    LEFT JOIN Clientes c ON v.id_cliente = c.id_cliente
    ORDER BY v.fecha DESC
  `);
    return result.recordset;
};
exports.getVentas = getVentas;
const crearVenta = async (data) => {
    const transaction = new mssql_1.default.Transaction(database_1.pool);
    try {
        await transaction.begin();
        const request = new mssql_1.default.Request(transaction);
        // 1️⃣ Generar nuevo id_factura
        const idFacturaResult = await request.query(`
      SELECT ISNULL(MAX(id_factura), 0) + 1 AS nextId FROM Ventas
    `);
        const id_factura = idFacturaResult.recordset[0].nextId;
        let totalVenta = 0;
        // ========================
        // PRODUCTOS
        // ========================
        if (data.productos) {
            for (const item of data.productos) {
                const subtotal = item.cantidad * item.precio_unitario;
                totalVenta += subtotal;
                // Validar stock
                const stockResult = await request
                    .input("id_producto", item.id_producto)
                    .query(`
            SELECT stock FROM Productos WHERE id_producto = @id_producto
          `);
                const stockActual = stockResult.recordset[0].stock;
                if (stockActual < item.cantidad) {
                    throw new Error(`Stock insuficiente para producto ${item.id_producto}`);
                }
                // Generar id detalle producto
                const idDetalleProdResult = await request.query(`
          SELECT ISNULL(MAX(id_detalle_producto), 0) + 1 AS nextId 
          FROM Detalle_Venta_Producto
        `);
                const id_detalle_producto = idDetalleProdResult.recordset[0].nextId;
                // Insertar detalle producto
                await request
                    .input("id_detalle_producto", id_detalle_producto)
                    .input("id_factura", id_factura)
                    .input("id_producto", item.id_producto)
                    .input("cantidad", item.cantidad)
                    .input("precio_unitario", item.precio_unitario)
                    .input("subtotal", subtotal)
                    .query(`
            INSERT INTO Detalle_Venta_Producto
            (id_detalle_producto, id_factura, id_producto, cantidad, precio_unitario, subtotal)
            VALUES
            (@id_detalle_producto, @id_factura, @id_producto, @cantidad, @precio_unitario, @subtotal)
          `);
                // Descontar stock
                await request
                    .input("id_producto", item.id_producto)
                    .input("cantidad", item.cantidad)
                    .query(`
            UPDATE Productos
            SET stock = stock - @cantidad
            WHERE id_producto = @id_producto
          `);
            }
        }
        // ========================
        // SERVICIOS
        // ========================
        if (data.servicios) {
            for (const item of data.servicios) {
                const subtotal = item.cantidad * item.precio_unitario;
                totalVenta += subtotal;
                const ganancia_barbero = (subtotal * item.porcentaje_barbero) / 100;
                const idDetalleServResult = await request.query(`
          SELECT ISNULL(MAX(id_detalle_servicio), 0) + 1 AS nextId 
          FROM Detalle_Venta_Servicio
        `);
                const id_detalle_servicio = idDetalleServResult.recordset[0].nextId;
                await request
                    .input("id_detalle_servicio", id_detalle_servicio)
                    .input("id_factura", id_factura)
                    .input("id_servicio", item.id_servicio)
                    .input("id_barbero", item.id_barbero)
                    .input("cantidad", item.cantidad)
                    .input("precio_unitario", item.precio_unitario)
                    .input("subtotal", subtotal)
                    .input("porcentaje_barbero", item.porcentaje_barbero)
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
        }
        // ========================
        // INSERTAR FACTURA
        // ========================
        await request
            .input("id_factura", id_factura)
            .input("id_cliente", data.id_cliente)
            .input("total", totalVenta)
            .query(`
        INSERT INTO Ventas (id_factura, id_cliente, total)
        VALUES (@id_factura, @id_cliente, @total)
      `);
        await transaction.commit();
        return { message: "Venta registrada correctamente", id_factura };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.crearVenta = crearVenta;
const getVentaById = async (id) => {
    const request = database_1.pool.request();
    request.input("id_factura", id);
    const venta = await request.query(`
    SELECT * FROM Ventas WHERE id_factura = @id_factura
  `);
    const productos = await request.query(`
    SELECT d.*, p.nombre
    FROM Detalle_Venta_Producto d
    JOIN Productos p ON d.id_producto = p.id_producto
    WHERE id_factura = @id_factura
  `);
    const servicios = await request.query(`
    SELECT d.*, s.nombre
    FROM Detalle_Venta_Servicio d
    JOIN Servicios s ON d.id_servicio = s.id_servicio
    WHERE id_factura = @id_factura
  `);
    return {
        venta: venta.recordset[0],
        productos: productos.recordset,
        servicios: servicios.recordset,
    };
};
exports.getVentaById = getVentaById;
const reportePorFecha = async (desde, hasta) => {
    const result = await database_1.pool
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
exports.reportePorFecha = reportePorFecha;
const reporteGananciaBarbero = async () => {
    const result = await database_1.pool.request().query(`
    SELECT 
      b.nombre,
      SUM(d.ganancia_barbero) AS total_ganado
    FROM Detalle_Venta_Servicio d
    JOIN Barberos b ON d.id_barbero = b.id_barbero
    GROUP BY b.nombre
  `);
    return result.recordset;
};
exports.reporteGananciaBarbero = reporteGananciaBarbero;
