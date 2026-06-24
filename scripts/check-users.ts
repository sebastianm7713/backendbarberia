import { pool } from '../src/config/database';
import sql from 'mssql';

(async () => {
  try {
    // Asegurarse de que la conexión esté abierta
    if (pool.connected === false) {
      await pool.connect();
    }

    const result = await pool.request().query('SELECT id_usuario, nombre, email, contrasena, id_rol FROM usuarios');
    console.log('Usuarios en BD:');
    result.recordset.forEach((user: any) => {
      console.log(`ID: ${user.id_usuario}, Email: ${user.email}, Password length: ${user.contrasena?.length || 0}, Rol: ${user.id_rol}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();