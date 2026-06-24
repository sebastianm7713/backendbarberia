import * as repository from "./devoluciones.repository";
import { pool } from "../../config/database";

export const getAllDevoluciones = async () => await repository.getAllDevoluciones();
export const getDevolucionById = async (id: number) => await repository.getDevolucionById(id);
export const createDevolucion = async (data: any) => {
  const result = await repository.createDevolucion(data);

  // Si la devolución va a stock, DISMINUIR el inventario del producto
  if (data.remitido === 'stock') {
    await ajustarStockProducto(data.id_detalle_producto || data.id_producto, data.cantidad, 'disminuir');
  }

  return {
    message: "Devolucion creada correctamente",
    id_devolucion: result.id_devolucion
  };
};
export const updateDevolucion = async (id: number, data: any) => {
  await repository.updateDevolucion(id, data);
  return { message: "Devolucion actualizada correctamente" };
};
export const deleteDevolucion = async (id: number) => {
  // Obtener la devolución antes de eliminarla para saber si hay que ajustar stock
  const devolucion = await repository.getDevolucionById(id);
  if (!devolucion) {
    throw new Error("Devolución no encontrada");
  }

  await repository.deleteDevolucion(id);

  // Si la devolución iba a stock, AUMENTAR el inventario del producto (volverlo al stock)
  if (devolucion.remitido === 'stock') {
    await ajustarStockProducto(devolucion.id_detalle_producto || devolucion.id_producto, devolucion.cantidad, 'aumentar');
  }

  return { message: "Devolucion eliminada correctamente" };
};

// Nueva función para obtener productos por proveedor
export const getProductosPorProveedor = async (id_proveedor: number) => {
  return await repository.getProductosPorProveedor(id_proveedor);
};

// Función auxiliar para ajustar el stock de productos
const ajustarStockProducto = async (id_detalle_o_producto: number, cantidad: number, operacion: 'aumentar' | 'disminuir') => {
  try {
    let id_producto: number;

    // Si es un id_detalle_producto, obtener el id_producto
    if (id_detalle_o_producto && typeof id_detalle_o_producto === 'number') {
      // Verificar si es un id_detalle_producto
      const detalleResult = await pool.request()
        .input("id_detalle_o_producto", id_detalle_o_producto)
        .query("SELECT id_producto FROM Detalle_Venta_Producto WHERE id_detalle_producto = @id_detalle_o_producto");

      if (detalleResult.recordset.length > 0) {
        id_producto = detalleResult.recordset[0].id_producto;
      } else {
        // Asumir que es directamente un id_producto
        id_producto = id_detalle_o_producto;
      }
    } else {
      throw new Error("ID de producto o detalle no válido");
    }

    const operador = operacion === 'aumentar' ? '+' : '-';

    // Actualizar el stock del producto
    await pool.request()
      .input("id_producto", id_producto)
      .input("cantidad", cantidad)
      .query(`UPDATE Productos SET stock = stock ${operador} @cantidad WHERE id_producto = @id_producto`);

  } catch (error) {
    throw new Error(`Error al ajustar stock del producto: ${error}`);
  }
};