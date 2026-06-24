"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaProductoRepository = void 0;
const database_1 = require("../../config/database");
const utils_1 = require("../../shared/utils");
exports.detalleVentaProductoRepository = {
    async getAll() {
        try {
            const result = await database_1.pool
                .request()
                .query(`
          SELECT 
            dvp.id_detalle_producto AS id_detalle,
            dvp.id_ventas AS id_venta,
            dvp.id_producto,
            dvp.cantidad,
            dvp.precio_unitario,
            dvp.subtotal,
            p.nombre as nombre_producto,
            p.descripcion
          FROM Detalle_Venta_Producto dvp
          INNER JOIN Productos p ON dvp.id_producto = p.id_producto
          ORDER BY dvp.id_ventas DESC
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener detalles de venta: ${error}`);
        }
    },
    async getById(id_detalle) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_detalle', id_detalle)
                .query(`
          SELECT 
            dvp.id_detalle_producto AS id_detalle,
            dvp.id_ventas AS id_venta,
            dvp.id_producto,
            dvp.cantidad,
            dvp.precio_unitario,
            dvp.subtotal,
            p.nombre as nombre_producto,
            p.descripcion
          FROM Detalle_Venta_Producto dvp
          INNER JOIN Productos p ON dvp.id_producto = p.id_producto
          WHERE dvp.id_detalle_producto = @id_detalle
        `);
            return result.recordset[0] || null;
        }
        catch (error) {
            throw new Error(`Error al obtener detalle de venta: ${error}`);
        }
    },
    async getByVentaId(id_venta) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_venta', id_venta)
                .query(`
          SELECT 
            dvp.id_detalle_producto AS id_detalle,
            dvp.id_ventas AS id_venta,
            dvp.id_producto,
            dvp.cantidad,
            dvp.precio_unitario,
            dvp.subtotal,
            p.nombre as nombre_producto,
            p.descripcion
          FROM Detalle_Venta_Producto dvp
          INNER JOIN Productos p ON dvp.id_producto = p.id_producto
          WHERE dvp.id_ventas = @id_venta
          ORDER BY dvp.id_detalle_producto
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener detalles de venta: ${error}`);
        }
    },
    async create(data) {
        try {
            // Verificar que la venta exista
            const ventaCheck = await database_1.pool
                .request()
                .input('id_venta', data.id_venta)
                .query('SELECT 1 AS existsVenta FROM Ventas WHERE id_ventas = @id_venta');
            if (!ventaCheck.recordset.length) {
                const err = new Error(`Venta con id_ventas=${data.id_venta} no encontrada`);
                err.statusCode = 404;
                throw err;
            }
            const subtotal = data.cantidad * data.precio_unitario;
            const maxIdResult = await database_1.pool
                .request()
                .query('SELECT ISNULL(MAX(id_detalle_producto), 0) + 1 as newId FROM Detalle_Venta_Producto');
            const newId = maxIdResult.recordset[0].newId;
            await database_1.pool
                .request()
                .input('id_detalle_producto', newId)
                .input('id_ventas', data.id_venta)
                .input('id_producto', data.id_producto)
                .input('cantidad', data.cantidad)
                .input('precio_unitario', data.precio_unitario)
                .input('subtotal', subtotal)
                .query(`
          INSERT INTO Detalle_Venta_Producto 
          (id_detalle_producto, id_ventas, id_producto, cantidad, precio_unitario, subtotal)
          VALUES (@id_detalle_producto, @id_ventas, @id_producto, @cantidad, @precio_unitario, @subtotal)
        `);
            return { id_detalle: newId, ...data, subtotal };
        }
        catch (error) {
            console.error('Repository create error:', error);
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError(`Error al crear detalle de venta: ${error?.message || error}`, 500);
        }
    },
    async update(id_detalle, data) {
        try {
            const updates = [];
            const request = database_1.pool.request().input('id_detalle', id_detalle);
            if (data.cantidad !== undefined || data.precio_unitario !== undefined) {
                const existing = await this.getById(id_detalle);
                const cantidad = data.cantidad || existing.cantidad;
                const precio = data.precio_unitario || existing.precio_unitario;
                const subtotal = cantidad * precio;
                request.input('subtotal', subtotal);
                updates.push('subtotal = @subtotal');
            }
            if (data.cantidad !== undefined) {
                request.input('cantidad', data.cantidad);
                updates.push('cantidad = @cantidad');
            }
            if (data.precio_unitario !== undefined) {
                request.input('precio_unitario', data.precio_unitario);
                updates.push('precio_unitario = @precio_unitario');
            }
            if (updates.length === 0)
                return { id_detalle, ...data };
            await request.query(`
        UPDATE Detalle_Venta_Producto 
        SET ${updates.join(', ')}
        WHERE id_detalle_producto = @id_detalle
      `);
            return this.getById(id_detalle);
        }
        catch (error) {
            throw new Error(`Error al actualizar detalle de venta: ${error}`);
        }
    },
    async delete(id_detalle) {
        try {
            await database_1.pool
                .request()
                .input('id_detalle', id_detalle)
                .query('DELETE FROM Detalle_Venta_Producto WHERE id_detalle_producto = @id_detalle');
            return true;
        }
        catch (error) {
            throw new Error(`Error al eliminar detalle de venta: ${error}`);
        }
    },
};
