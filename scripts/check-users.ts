import { pool } from './src/config/database';

(async () => {
  try {
    const result = await pool.request().query('SELECT id_usuario, nombre, email, password, rol_id FROM usuarios');
    console.log('Usuarios en BD:');
    result.recordset.forEach(user => {
      console.log(`ID: ${user.id_usuario}, Email: ${user.email}, Password length: ${user.password.length}, Rol: ${user.rol_id}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();