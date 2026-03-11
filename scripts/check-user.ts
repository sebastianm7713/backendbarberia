import { pool } from './src/config/database';

(async () => {
  try {
    const result = await pool.request()
      .input('email', 'juanperez@barber.com')
      .query('SELECT password FROM usuarios WHERE email = @email');

    if (result.recordset.length > 0) {
      console.log('Contraseña actual:', result.recordset[0].password);
    } else {
      console.log('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();