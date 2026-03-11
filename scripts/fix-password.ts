import bcrypt from 'bcrypt';
import { pool } from './src/config/database';

(async () => {
  try {
    // Hashear la contraseña "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Nueva contraseña hasheada:', hashedPassword);

    // Actualizar la contraseña del usuario juanperez@barber.com
    await pool.request()
      .input('password', hashedPassword)
      .input('email', 'juanperez@barber.com')
      .query('UPDATE usuarios SET password = @password WHERE email = @email');

    console.log('Contraseña actualizada exitosamente');

    // Verificar
    const result = await pool.request()
      .input('email', 'juanperez@barber.com')
      .query('SELECT id_usuario, nombre, email, password FROM usuarios WHERE email = @email');

    console.log('Usuario actualizado:', result.recordset[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();