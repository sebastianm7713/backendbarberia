import bcrypt from 'bcrypt';
import { connectDB, pool } from '../src/config/database';

// Mapear rol -> contraseña deseada
const passwordsByRole: Record<number, string> = {
  1: 'admin123',
  2: 'barbero123',
  3: 'cliente123',
};

(async () => {
  try {
    await connectDB();

    const result = await pool.request().query(`
      SELECT id_usuario, email, id_rol
      FROM Usuarios
      WHERE id_rol IN (1,2,3)
    `);

    const users = result.recordset;

    for (const user of users) {
      const targetPassword = passwordsByRole[user.id_rol];
      if (!targetPassword) continue;

      const hashed = await bcrypt.hash(targetPassword, 10);

      await pool.request()
        .input('contrasena', hashed)
        .input('id_usuario', user.id_usuario)
        .query(
          `UPDATE Usuarios SET contrasena = @contrasena WHERE id_usuario = @id_usuario`
        );

      console.log(`Contraseña reseteada para ${user.email} (rol ${user.id_rol})`);
    }

    console.log('Reseteo de contraseñas completado.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();
