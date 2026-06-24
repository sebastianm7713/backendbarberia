import sql from "mssql";
import { pool } from "../../config/database";
import * as repository from "./compras.repository";
import * as consignacionesService from "../consignaciones_proveedor/consignaciones_proveedor.service";
import { PagosRealizadosService } from "../pagos_realizados/pagos_realizados.service";
import * as productosService from "../productos/productos.service";
import * as detalleCompraService from "../detalle_compra/detalle_compra.service";

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
      // Crear un nuevo request para cada detalle para evitar conflictos de parámetros
      const detalleRequest = new sql.Request(transaction);

      // Obtener nuevo id_detalle_compra
      const idDetalleResult = await detalleRequest.query(`
        SELECT ISNULL(MAX(id_detalle_compra), 0) + 1 AS nextId 
        FROM Detalle_Compra
      `);

      const id_detalle_compra = idDetalleResult.recordset[0].nextId;
      const subtotal = item.cantidad * item.costo_unitario;

      // Insertar detalle (con nuevo request)
      const insertDetalleRequest = new sql.Request(transaction);
      await insertDetalleRequest
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

      // Actualizar stock (con nuevo request)
      const updateStockRequest = new sql.Request(transaction);
      await updateStockRequest
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

export const getComprasByEstado = async (estado_pago: string) => {
  return await repository.getComprasByEstado(estado_pago);
};

export const updateCompra = async (id_compra: number, data: any) => {
  // Obtener el estado anterior
  const compraAnterior = await repository.getCompraById(id_compra);
  const estadoAnterior = compraAnterior.estado_pago;

  // Actualizar la compra
  await repository.updateCompra(id_compra, data);

  // Si el estado cambió a 'consignacion', crear consignaciones
  if (data.estado_pago === 'consignacion' && estadoAnterior !== 'consignacion') {
    const detalles = await detalleCompraService.getDetallesPorCompra(id_compra);
    for (const detalle of detalles) {
      const producto = await productosService.getProductoById(detalle.id_producto);
      await consignacionesService.createConsignacion({
        id_proveedor: data.id_proveedor || compraAnterior.id_proveedor,
        id_producto: detalle.id_producto,
        cantidad_recibida: detalle.cantidad,
        precio_proveedor: detalle.costo_unitario,
        precio_venta: producto.precio_venta || detalle.costo_unitario * 1.2, // asumir markup si no hay precio_venta
        fecha_entrega: data.fecha_compra || compraAnterior.fecha_compra,
        observaciones: `Consignación generada desde compra ${id_compra}`
      });
    }
  }

  // Si el estado cambió a 'pagado', crear pago
  if (data.estado_pago === 'pagado' && estadoAnterior !== 'pagado') {
    const compraActualizada = await repository.getCompraById(id_compra);
    const pagosService = new PagosRealizadosService();
    await pagosService.createPago({
      id_compra: id_compra,
      monto_pagado: compraActualizada.total,
      fecha_pago: new Date().toISOString(),
      metodo_pago: 'efectivo', // o configurable
      referencia: `Pago completo de compra ${id_compra}`
    });
  }

  return { message: "Compra actualizada correctamente" };
};

export const deleteCompra = async (id_compra: number) => {
  // Note: Deleting purchases might affect stock, but for simplicity
  await repository.deleteCompra(id_compra);
  return { message: "Compra eliminada correctamente" };
};