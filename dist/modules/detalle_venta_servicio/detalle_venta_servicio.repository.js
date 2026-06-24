"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaServicioRepository = void 0;
const database_1 = require("../../config/database");
exports.detalleVentaServicioRepository = {
    async getAll() {
        try {
            const result = await database_1.pool
                .request()
                .query(`
          SELECT 
            dvs.id_detalle_servicio AS id_detalle,
            dvs.id_ventas AS id_venta,
            dvs.id_servicio,
            dvs.id_barbero,
            dvs.cantidad,
            dvs.precio_unitario,
            dvs.subtotal,
            s.nombre as nombre_servicio,
            s.descripcion,
            s.duracion,
            u.nombre as nombre_barbero
          FROM Detalle_Venta_Servicio dvs
          INNER JOIN Servicios s ON dvs.id_servicio = s.id_servicio
          INNER JOIN Barberos b ON dvs.id_barbero = b.id_barbero
          INNER JOIN Usuarios u ON b.id_usuario = u.id_usuario
          ORDER BY dvs.id_ventas DESC
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener detalles de servicio: ${error}`);
        }
    },
    async getById(id_detalle) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_detalle', id_detalle)
                .query(`
          SELECT 
            dvs.id_detalle_servicio AS id_detalle,
            dvs.id_ventas AS id_venta,
            dvs.id_servicio,
            dvs.id_barbero,
            dvs.cantidad,
            dvs.precio_unitario,
            dvs.subtotal,
            s.nombre as nombre_servicio,
            s.descripcion,
            s.duracion,
            u.nombre as nombre_barbero
          FROM Detalle_Venta_Servicio dvs
          INNER JOIN Servicios s ON dvs.id_servicio = s.id_servicio
          INNER JOIN Barberos b ON dvs.id_barbero = b.id_barbero
          INNER JOIN Usuarios u ON b.id_usuario = u.id_usuario
          WHERE dvs.id_detalle_servicio = @id_detalle
        `);
            return result.recordset[0] || null;
        }
        catch (error) {
            throw new Error(`Error al obtener detalle de servicio: ${error}`);
        }
    },
    async getByVentaId(id_venta) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_venta', id_venta)
                .query(`
          SELECT 
            dvs.id_detalle_servicio AS id_detalle,
            dvs.id_ventas AS id_venta,
            dvs.id_servicio,
            dvs.id_barbero,
            dvs.cantidad,
            dvs.precio_unitario,
            dvs.subtotal,
            s.nombre as nombre_servicio,
            s.descripcion,
            s.duracion,
            u.nombre as nombre_barbero
          FROM Detalle_Venta_Servicio dvs
          INNER JOIN Servicios s ON dvs.id_servicio = s.id_servicio
          INNER JOIN Barberos b ON dvs.id_barbero = b.id_barbero
          INNER JOIN Usuarios u ON b.id_usuario = u.id_usuario
          WHERE dvs.id_ventas = @id_venta
          ORDER BY dvs.id_detalle_servicio
        `);
            return result.recordset;
        }
        catch (error) {
            console.error('detalleVentaServicioRepository.getByVentaId error:', error);
            throw new Error(`Error al obtener detalles de servicio: ${error?.message || error}`);
        }
    },
    async create(data) {
        try {
            const subtotal = data.cantidad * data.precio_unitario;
            const maxIdResult = await database_1.pool
                .request()
                .query('SELECT ISNULL(MAX(id_detalle_servicio), 0) + 1 as newId FROM Detalle_Venta_Servicio');
            const newId = maxIdResult.recordset[0].newId;
            await database_1.pool
                .request()
                .input('id_detalle_servicio', newId)
                .input('id_ventas', data.id_venta)
                .input('id_servicio', data.id_servicio)
                .input('id_barbero', data.id_barbero)
                .input('cantidad', data.cantidad)
                .input('precio_unitario', data.precio_unitario)
                .input('subtotal', subtotal)
                .query(`
          INSERT INTO Detalle_Venta_Servicio 
          (id_detalle_servicio, id_ventas, id_servicio, id_barbero, cantidad, precio_unitario, subtotal)
          VALUES (@id_detalle_servicio, @id_ventas, @id_servicio, @id_barbero, @cantidad, @precio_unitario, @subtotal)
        `);
            return { id_detalle: newId, ...data, subtotal };
        }
        catch (error) {
            throw new Error(`Error al crear detalle de servicio: ${error}`);
        }
    },
    async update(id_detalle, data) {
        try {
            const updates = [];
            const request = database_1.pool.request().input('id_detalle', id_detalle);
            if (data.cantidad !== undefined || data.precio_unitario !== undefined) {
                const existing = await this.getById(id_detalle);
                const cantidad = data.cantidad ?? existing.cantidad;
                const precio = data.precio_unitario ?? existing.precio_unitario;
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
            if (data.id_barbero !== undefined) {
                request.input('id_barbero', data.id_barbero);
                updates.push('id_barbero = @id_barbero');
            }
            if (updates.length === 0)
                return { id_detalle, ...data };
            await request.query(`
        UPDATE Detalle_Venta_Servicio 
        SET ${updates.join(', ')}
        WHERE id_detalle_servicio = @id_detalle
      `);
            return this.getById(id_detalle);
        }
        catch (error) {
            throw new Error(`Error al actualizar detalle de servicio: ${error}`);
        }
    },
    async delete(id_detalle) {
        try {
            await database_1.pool
                .request()
                .input('id_detalle', id_detalle)
                .query('DELETE FROM Detalle_Venta_Servicio WHERE id_detalle_servicio = @id_detalle');
            return true;
        }
        catch (error) {
            throw new Error(`Error al eliminar detalle de servicio: ${error}`);
        }
    },
};
