"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducto = exports.updateProducto = exports.createProducto = exports.getProductoById = exports.getProductos = void 0;
const database_1 = require("../../config/database");
const consignacionRepository = __importStar(require("../consignaciones_proveedor/consignaciones_proveedor.repository"));
const getProductos = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM productos");
    return result.recordset;
};
exports.getProductos = getProductos;
const getProductoById = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query("SELECT * FROM productos WHERE id_producto = @id");
    return result.recordset[0];
};
exports.getProductoById = getProductoById;
const createProducto = async (data) => {
    const { id_categoria, id_marca, nombre, precio, descripcion, stock, fecha_vencimiento, img, estado, tipo_adquisicion, id_proveedor, consignacion_data, } = data;
    // Generar el siguiente ID disponible
    const idResult = await database_1.pool
        .request()
        .query("SELECT ISNULL(MAX(id_producto), 0) + 1 AS nextId FROM productos");
    const id_producto = idResult.recordset[0].nextId;
    const result = await database_1.pool
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
    return await (0, exports.getProductoById)(id_producto);
};
exports.createProducto = createProducto;
const updateProducto = async (id, data) => {
    const { id_categoria, id_marca, nombre, precio, descripcion, stock, fecha_vencimiento, img, estado, tipo_adquisicion, id_proveedor, } = data;
    let query = "UPDATE productos SET ";
    const request = database_1.pool.request().input("id", id);
    const updates = [];
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
    if (updates.length === 0)
        return await (0, exports.getProductoById)(id);
    query += updates.join(", ") + " WHERE id_producto = @id";
    await request.query(query);
    // Retornar el producto completo actualizado
    return await (0, exports.getProductoById)(id);
};
exports.updateProducto = updateProducto;
const deleteProducto = async (id) => {
    await database_1.pool
        .request()
        .input("id", id)
        .query("DELETE FROM productos WHERE id_producto = @id");
};
exports.deleteProducto = deleteProducto;
