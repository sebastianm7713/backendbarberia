import { pool } from "../../config/database";

export const getAllRoles = async () => {
  const result = await pool.request().query(`
    SELECT * FROM Roles ORDER BY id_rol
  `);
  return result.recordset;
};

export const getRolById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT * FROM Roles WHERE id_rol = @id
    `);
  return result.recordset[0];
};

export const createRol = async (data: any) => {
  const { nombre, descripcion, estado = 'activo', permisos } = data;

  try {
    // Como id_rol NO es auto-increment, obtener el próximo ID
    const maxIdResult = await pool.request().query(`
      SELECT ISNULL(MAX(id_rol), 0) + 1 AS next_id FROM Roles
    `);

    const nextId = maxIdResult.recordset[0]?.next_id || 1;

    console.log('Creating rol with id:', nextId, 'nombre:', nombre, 'estado:', estado);

    // Insertar con id_rol asignado manualmente
    await pool
      .request()
      .input('id_rol', nextId)
      .input('nombre', nombre)
      .input('descripcion', descripcion || null)
      .input('estado', estado)
      .query(`
        INSERT INTO Roles (id_rol, nombre, descripcion, estado)
        VALUES (@id_rol, @nombre, @descripcion, @estado)
      `);

    console.log('Rol created successfully:', nextId);

    // Si vienen permisos, insertarlos en Rol_Permiso
    if (Array.isArray(permisos) && permisos.length > 0) {
      for (const id_permiso of permisos) {
        // Verificar existencia del permiso
        const permisoExists = await pool
          .request()
          .input('id_permiso', id_permiso)
          .query('SELECT 1 FROM Permisos WHERE id_permiso = @id_permiso');

        if (permisoExists.recordset.length === 0) {
          // Si falta un permiso, eliminar el rol creado para mantener consistencia
          await pool.request().input('id', nextId).query('DELETE FROM Roles WHERE id_rol = @id');
          throw new Error(`El permiso con id ${id_permiso} no existe`);
        }

        // Insertar la asignación si no existe
        const exists = await pool
          .request()
          .input('id_rol', nextId)
          .input('id_permiso', id_permiso)
          .query(`
            SELECT 1 FROM Rol_Permiso WHERE id_rol = @id_rol AND id_permiso = @id_permiso
          `);

        if (exists.recordset.length === 0) {
          await pool
            .request()
            .input('id_rol', nextId)
            .input('id_permiso', id_permiso)
            .query(`INSERT INTO Rol_Permiso (id_rol, id_permiso) VALUES (@id_rol, @id_permiso)`);
        }
      }
    }

    // Recuperar permisos asignados para devolverlos en la respuesta
    const permisosAssigned = await pool
      .request()
      .input('id_rol', nextId)
      .query(`
        SELECT rp.id_permiso, p.nombre, p.descripcion
        FROM Rol_Permiso rp
        INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
        WHERE rp.id_rol = @id_rol
      `);

    return {
      id_rol: nextId,
      nombre,
      descripcion: descripcion || null,
      estado,
      permisos: permisosAssigned.recordset
    };
  } catch (error: any) {
    console.error('Error in createRol:', error.message);
    if (error.originalError?.number === 2627 || (error.message && error.message.includes('Ya existe'))) {
      throw new Error(`Ya existe un rol con el nombre "${nombre}"`);
    }
    throw error;
  }
};

export const updateRol = async (id: number, data: any) => {
  const { nombre, descripcion, estado, permisos } = data;
  
  try {
    // Validar que el rol existe
    const existingRol = await getRolById(id);
    if (!existingRol) {
      throw new Error(`El rol con id ${id} no existe`);
    }
    
    const updates: string[] = [];
    const request = pool.request().input("id", id);
    
    if (nombre !== undefined) {
      updates.push("nombre = @nombre");
      request.input("nombre", nombre);
    }
    if (descripcion !== undefined) {
      updates.push("descripcion = @descripcion");
      request.input("descripcion", descripcion || null);
    }
    if (estado !== undefined) {
      updates.push("estado = @estado");
      request.input("estado", estado);
    }
    
    if (updates.length > 0) {
      const query = `UPDATE Roles SET ${updates.join(', ')} WHERE id_rol = @id`;
      await request.query(query);
    }

    if (permisos !== undefined) {
      await pool.request()
        .input('id_rol', id)
        .query('DELETE FROM Rol_Permiso WHERE id_rol = @id_rol');

      if (Array.isArray(permisos) && permisos.length > 0) {
        for (const id_permiso of permisos) {
          const permisoExists = await pool
            .request()
            .input('id_permiso', id_permiso)
            .query('SELECT 1 FROM Permisos WHERE id_permiso = @id_permiso');

          if (permisoExists.recordset.length === 0) {
            throw new Error(`El permiso con id ${id_permiso} no existe`);
          }

          await pool
            .request()
            .input('id_rol', id)
            .input('id_permiso', id_permiso)
            .query('INSERT INTO Rol_Permiso (id_rol, id_permiso) VALUES (@id_rol, @id_permiso)');
        }
      }
    }

    const permisosAssigned = await pool
      .request()
      .input('id_rol', id)
      .query(`
        SELECT rp.id_permiso, p.nombre, p.descripcion
        FROM Rol_Permiso rp
        INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
        WHERE rp.id_rol = @id_rol
      `);

    return {
      ...existingRol,
      nombre: nombre ?? existingRol.nombre,
      descripcion: descripcion ?? existingRol.descripcion,
      estado: estado ?? existingRol.estado,
      permisos: permisosAssigned.recordset,
    };
  } catch (error: any) {
    console.error('Error in updateRol:', error.message);
    if (error.originalError?.number === 2627) {
      throw new Error(`Ya existe un rol con el nombre "${nombre}"`);
    }
    throw error;
  }
};

export const deleteRol = async (id: number) => {
  try {
    // Validación: No permitir eliminar Admin (id_rol = 1)
    if (id === 1) {
      throw new Error('No se puede eliminar el rol Administrador. Este rol es esencial para el sistema.');
    }

    // Validar que el rol existe antes de eliminarlo
    const rol = await getRolById(id);
    if (!rol) {
      throw new Error(`El rol con id ${id} no existe`);
    }

    // Validar que no existan usuarios asignados al rol
    const usuariosAsignados = await pool
      .request()
      .input('id_rol', id)
      .query(`SELECT COUNT(1) AS total FROM Usuarios WHERE id_rol = @id_rol`);

    const assignedCount = usuariosAsignados.recordset?.[0]?.total ?? 0;
    if (assignedCount > 0) {
      throw new Error(`No se puede eliminar el rol porque tiene ${assignedCount} usuario${assignedCount === 1 ? '' : 's'} asignado${assignedCount === 1 ? '' : 's'}.`);
    }

    // Usar transacción para eliminar referencias y luego el rol
    const transaction = pool.transaction();
    await transaction.begin();
    try {
      const tr = transaction.request();
      await tr.input('id_rol', id).query('DELETE FROM Rol_Permiso WHERE id_rol = @id_rol');
      await tr.input('id', id).query('DELETE FROM Roles WHERE id_rol = @id');
      await transaction.commit();
    } catch (txErr) {
      await transaction.rollback();
      throw txErr;
    }

    return {
      success: true,
      message: "Rol eliminado correctamente"
    };
  } catch (error: any) {
    console.error('Error in deleteRol:', error?.message || error);
    if (error.originalError?.number === 547) {
      throw new Error('No se puede eliminar el rol porque está siendo utilizado por otra entidad en la base de datos.');
    }
    throw error;
  }
};
