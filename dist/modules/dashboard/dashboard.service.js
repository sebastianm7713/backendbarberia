"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardHoy = void 0;
const database_1 = require("../../config/database");
const dashboardHoy = async () => {
    const request = database_1.pool.request();
    const result = await request.query(`
    DECLARE @hoy DATE = CAST(GETDATE() AS DATE);

    -- Ventas hoy
    SELECT 
      COUNT(*) AS cantidad_ventas,
      ISNULL(SUM(total),0) AS total_vendido
    INTO #ventas
    FROM Ventas
    WHERE CAST(fecha AS DATE) = @hoy;

    -- Citas hoy
    SELECT
      COUNT(*) AS total_citas,
      SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) AS completadas,
      SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendientes
    INTO #citas
    FROM Citas
    WHERE fecha = @hoy;

    -- Ganancia barberos hoy
    SELECT 
      ISNULL(SUM(d.ganancia_barbero),0) AS ganancia_barberos
    INTO #ganancia
    FROM Detalle_Venta_Servicio d
    JOIN Ventas v ON d.id_ventas = v.id_ventas
    WHERE CAST(v.fecha AS DATE) = @hoy;

    SELECT 
      v.cantidad_ventas,
      v.total_vendido,
      c.total_citas,
      c.completadas,
      c.pendientes,
      g.ganancia_barberos
    FROM #ventas v, #citas c, #ganancia g;

    DROP TABLE #ventas;
    DROP TABLE #citas;
    DROP TABLE #ganancia;
  `);
    return result.recordset[0];
};
exports.dashboardHoy = dashboardHoy;
