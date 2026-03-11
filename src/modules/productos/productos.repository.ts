import { pool } from "../../config/database";

export const getAllProductos = async () => {
  const result = await pool.request().query(
    "SELECT * FROM Productos ORDER BY id_producto"
  );
  return result.recordset;
};

export const getProductoById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Productos WHERE id_producto = @id");
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
  } = data;

  const idResult = await pool
    .request()
    .query("SELECT ISNULL(MAX(id_producto), 0) + 1 AS nextId FROM Productos");
  const id_producto = idResult.recordset[0].nextId;

  await pool
    .request()
    .input("id_producto", id_producto)
    .input("id_categoria", id_categoria || null)
    .input("id_marca", id_marca || null)
    .input("nombre", nombre)
    .input("precio", precio)
    .input("descripcion", descripcion || null)
    .input("stock", stock ?? 0)
    .input("fecha_vencimiento", fecha_vencimiento || null)
    .input("img", img || null)
    .query(`
      INSERT INTO Productos 
        (id_producto, id_categoria, id_marca, nombre, precio, descripcion, stock, fecha_vencimiento, img)
      VALUES 
        (@id_producto, @id_categoria, @id_marca, @nombre, @precio, @descripcion, @stock, @fecha_vencimiento, @img)
    `);

  return { id_producto, mensaje: "Producto creado" };
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
  } = data;

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

  if (updates.length === 0) return;

  const query = `UPDATE Productos SET ${updates.join(", ")} WHERE id_producto = @id`;
  await request.query(query);
};

export const deleteProducto = async (id: number) => {
  await pool
    .request()
    .input("id", id)
    .query("DELETE FROM Productos WHERE id_producto = @id");
};