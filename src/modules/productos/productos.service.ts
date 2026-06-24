import { pool } from "../../config/database";
import * as consignacionRepository from "../consignaciones_proveedor/consignaciones_proveedor.repository";

export const getProductos = async () => {
  const result = await pool.request().query("SELECT * FROM productos");
  return result.recordset;
};

export const getProductoById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM productos WHERE id_producto = @id");
  return result.recordset[0];
};

export const createProducto = async (data: any) => {
  const {
    id_categoria,
    id_marca,
    nombre,
    precio,
    descripcion,
    stock,
    fecha_vencimiento,
    img,
    estado,
    tipo_adquisicion,
    id_proveedor,
    consignacion_data,
  } = data;

  // Generar el siguiente ID disponible
  const idResult = await pool
    .request()
    .query("SELECT ISNULL(MAX(id_producto), 0) + 1 AS nextId FROM productos");
  const id_producto = idResult.recordset[0].nextId;

  const result = await pool
    .request()
    .input("id_producto", id_producto)
    .input("id_categoria", id_categoria || null)
    .input("id_marca", id_marca || null)
    .input("nombre", nombre)
    .input("precio", precio)
    .input("descripcion", descripcion || null)
    .input("stock", stock || 0)
    .input("fecha_vencimiento", fecha_vencimiento || null)
    .input("img", img || null)
    .input("estado", estado || 'activo')
    .input("tipo_adquisicion", tipo_adquisicion || 'compra_directa')
    .input("id_proveedor", id_proveedor || null)
    .query(`
      INSERT INTO productos
      (id_producto, id_categoria, id_marca, nombre, precio, descripcion, stock, fecha_vencimiento, img, estado, tipo_adquisicion, id_proveedor)
      VALUES
      (@id_producto, @id_categoria, @id_marca, @nombre, @precio, @descripcion, @stock, @fecha_vencimiento, @img, @estado, @tipo_adquisicion, @id_proveedor)
    `);

  // Si es consignación, crear registro en Consignaciones_Proveedor
  if (tipo_adquisicion === 'consignacion' && consignacion_data) {
    await consignacionRepository.createConsignacion({
      id_proveedor,
      id_producto,
      cantidad_recibida: consignacion_data.cantidad_recibida,
      precio_proveedor: consignacion_data.precio_proveedor,
      precio_venta: consignacion_data.precio_venta,
      fecha_entrega: consignacion_data.fecha_entrega,
      observaciones: consignacion_data.observaciones,
    });
  }

  // Retornar el producto completo creado
  return await getProductoById(id_producto);
};

export const updateProducto = async (id: number, data: any) => {
  const {
    id_categoria,
    id_marca,
    nombre,
    precio,
    descripcion,
    stock,
    fecha_vencimiento,
    img,
    estado,
    tipo_adquisicion,
    id_proveedor,
  } = data;

  let query = "UPDATE productos SET ";
  const request = pool.request().input("id", id);
  const updates: string[] = [];

  if (id_categoria !== undefined) {
    updates.push("id_categoria = @id_categoria");
    request.input("id_categoria", id_categoria);
  }
  if (id_marca !== undefined) {
    updates.push("id_marca = @id_marca");
    request.input("id_marca", id_marca);
  }
  if (nombre !== undefined) {
    updates.push("nombre = @nombre");
    request.input("nombre", nombre);
  }
  if (precio !== undefined) {
    updates.push("precio = @precio");
    request.input("precio", precio);
  }
  if (descripcion !== undefined) {
    updates.push("descripcion = @descripcion");
    request.input("descripcion", descripcion);
  }
  if (stock !== undefined) {
    updates.push("stock = @stock");
    request.input("stock", stock);
  }
  if (fecha_vencimiento !== undefined) {
    updates.push("fecha_vencimiento = @fecha_vencimiento");
    request.input("fecha_vencimiento", fecha_vencimiento);
  }
  if (img !== undefined) {
    updates.push("img = @img");
    request.input("img", img);
  }
  if (estado !== undefined) {
    updates.push("estado = @estado");
    request.input("estado", estado);
  }
  if (tipo_adquisicion !== undefined) {
    updates.push("tipo_adquisicion = @tipo_adquisicion");
    request.input("tipo_adquisicion", tipo_adquisicion);
  }
  if (id_proveedor !== undefined) {
    updates.push("id_proveedor = @id_proveedor");
    request.input("id_proveedor", id_proveedor);
  }

  if (updates.length === 0) return await getProductoById(id);
  
  query += updates.join(", ") + " WHERE id_producto = @id";
  await request.query(query);
  
  // Retornar el producto completo actualizado
  return await getProductoById(id);
};

export const deleteProducto = async (id: number) => {
  await pool
    .request()
    .input("id", id)
    .query("DELETE FROM productos WHERE id_producto = @id");
};