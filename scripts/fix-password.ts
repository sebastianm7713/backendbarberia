import bcrypt from 'bcrypt';
import { pool } from '../src/config/database';
import sql from 'mssql';

(async () => {
  try {
    // Asegurarse de que la conexión esté abierta
    if (pool.connected === false) {
      await pool.connect();
    }

    // Hashear la contraseña "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Nueva contraseña hasheada:', hashedPassword);

    // Actualizar la contraseña del usuario juanperez@barber.com
    await pool.request()
      .input('contrasena', hashedPassword)
      .input('email', 'juanperez@barber.com')
      .query('UPDATE usuarios SET contrasena = @contrasena WHERE email = @email');

    // También actualizar brucewayne@barber.com con cliente123
    const hashedPassword2 = await bcrypt.hash('cliente123', 10);
    await pool.request()
      .input('contrasena', hashedPassword2)
      .input('email', 'brucewayne@barber.com')
      .query('UPDATE usuarios SET contrasena = @contrasena WHERE email = @email');

    console.log('Contraseña de brucewayne actualizada también');

    // Verificar
    const result = await pool.request()
      .input('email', 'juanperez@barber.com')
      .query('SELECT id_usuario, nombre, email, contrasena FROM usuarios WHERE email = @email');

    console.log('Usuario actualizado:', result.recordset[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();