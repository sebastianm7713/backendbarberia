"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updateUsuario = exports.crearUsuario = exports.getUsuarioByEmail = exports.getUsuarioById = exports.getUsuarios = void 0;
const database_1 = require("../../config/database");
function convertEstadoToBit(estado) {
    if (estado === 'activo' || estado === 1 || estado === true || estado === '1' || estado === 'true')
        return 1;
    if (estado === 'inactivo' || estado === 0 || estado === false || estado === '0' || estado === 'false')
        return 0;
    return null;
}
const convertBitToEstado = (bit) => {
    return bit ? 'activo' : 'inactivo';
};
const getUsuarios = async () => {
    const result = await database_1.pool.request().query(`
    SELECT
      id_usuario,
      id_rol,
      id_tipo_documento,
      numero_documento,
      nombre,
      email,
      telefono,
      direccion,
      img,
      estado
    FROM Usuarios
    ORDER BY id_usuario
  `);
    return result.recordset.map((user) => ({
        ...user,
        estado: convertBitToEstado(user.estado)
    }));
};
exports.getUsuarios = getUsuarios;
const getUsuarioById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`
      SELECT
        id_usuario,
        id_rol,
        id_tipo_documento,
        numero_documento,
        nombre,
        email,
        telefono,
        direccion,
        img,
        estado
      FROM Usuarios
      WHERE id_usuario = @id
    `);
    const user = result.recordset[0];
    if (user) {
        user.estado = convertBitToEstado(user.estado);
    }
    return user;
};
exports.getUsuarioById = getUsuarioById;
const getUsuarioByEmail = async (email) => {
    const result = await database_1.pool.request()
        .input("email", email)
        .query(`
      SELECT
        id_usuario,
        id_rol,
        id_tipo_documento,
        numero_documento,
        nombre,
        email,
        telefono,
        direccion,
        img,
        estado
      FROM Usuarios
      WHERE email = @email
    `);
    const user = result.recordset[0];
    if (user) {
        user.estado = convertBitToEstado(user.estado);
    }
    return user;
};
exports.getUsuarioByEmail = getUsuarioByEmail;
const crearUsuario = async (data) => {
    const { id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img, estado } = data;
    try {
        // Validar que el id_rol existe
        const rolExists = await database_1.pool
            .request()
            .input("id_rol", id_rol)
            .query("SELECT 1 FROM Roles WHERE id_rol = @id_rol");
        if (rolExists.recordset.length === 0) {
            throw new Error(`El rol con id ${id_rol} no existe`);
        }
        // Validar que el email no sea duplicado si se proporciona
        if (email) {
            const emailExists = await database_1.pool
                .request()
                .input("email", email)
                .query("SELECT 1 FROM Usuarios WHERE email = @email");
            if (emailExists.recordset.length > 0) {
                throw new Error(`Ya existe un usuario con el email: ${email}`);
            }
        }
        // Crear el usuario
        const result = await database_1.pool
            .request()
            .input("id_rol", id_rol)
            .input("id_tipo_documento", id_tipo_documento)
            .input("numero_documento", numero_documento)
            .input("nombre", nombre)
            .input("email", email || null)
            .input("telefono", telefono || null)
            .input("direccion", direccion || null)
            .input("contrasena", contrasena)
            .input("img", img || null)
            .input("estado", convertEstadoToBit(estado))
            .query(`
        INSERT INTO Usuarios
        (id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img, estado)
        VALUES (@id_rol, @id_tipo_documento, @numero_documento, @nombre, @email, @telefono, @direccion, @contrasena, @img, @estado);
        SELECT SCOPE_IDENTITY() AS id_usuario;
      `);
        if (!result.recordset || result.recordset.length === 0 || !result.recordset[0].id_usuario) {
            throw new Error('No se pudo obtener el ID del usuario creado');
        }
        const id_usuario = result.recordset[0].id_usuario;
        // If creating a client user (role 3), create cliente record
        if (id_rol === 3) {
            try {
                await database_1.pool.request()
                    .input("id_usuario", id_usuario)
                    .query(`
            INSERT INTO Clientes (id_usuario)
            VALUES (@id_usuario)
          `);
            }
            catch (clientError) {
                // Si falla la creación del cliente, eliminar el usuario creado
                await database_1.pool.request()
                    .input("id", id_usuario)
                    .query("DELETE FROM Usuarios WHERE id_usuario = @id");
                throw new Error(`Error al crear registro de cliente: ${clientError.message}`);
            }
        }
        return { id_usuario, mensaje: "Usuario creado exitosamente" };
    }
    catch (error) {
        console.error('Error in crearUsuario:', error.message || error);
        throw error;
    }
};
exports.crearUsuario = crearUsuario;
const updateUsuario = async (id, data) => {
    const { id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img, estado } = data;
    let query = "UPDATE Usuarios SET ";
    const request = database_1.pool.request().input("id", id);
    const updates = [];
    if (id_rol !== undefined) {
        updates.push("id_rol = @id_rol");
        request.input("id_rol", id_rol);
    }
    if (id_tipo_documento !== undefined) {
        updates.push("id_tipo_documento = @id_tipo_documento");
        request.input("id_tipo_documento", id_tipo_documento);
    }
    if (numero_documento !== undefined) {
        updates.push("numero_documento = @numero_documento");
        request.input("numero_documento", numero_documento);
    }
    if (nombre !== undefined) {
        updates.push("nombre = @nombre");
        request.input("nombre", nombre);
    }
    if (email !== undefined) {
        updates.push("email = @email");
        request.input("email", email);
    }
    if (telefono !== undefined) {
        updates.push("telefono = @telefono");
        request.input("telefono", telefono);
    }
    if (direccion !== undefined) {
        updates.push("direccion = @direccion");
        request.input("direccion", direccion);
    }
    if (contrasena !== undefined) {
        updates.push("contrasena = @contrasena");
        request.input("contrasena", contrasena);
    }
    if (img !== undefined) {
        updates.push("img = @img");
        request.input("img", img);
    }
    if (estado !== undefined) {
        updates.push("estado = @estado");
        request.input("estado", convertEstadoToBit(estado));
    }
    if (updates.length === 0)
        return await (0, exports.getUsuarioById)(id);
    query += updates.join(", ") + " WHERE id_usuario = @id";
    await request.query(query);
    return await (0, exports.getUsuarioById)(id);
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Usuarios WHERE id_usuario = @id");
};
exports.deleteUsuario = deleteUsuario;
