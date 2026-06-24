import bcrypt from 'bcrypt';
import { connectDB } from '../src/config/database';
import { pool } from '../src/config/database';

const users = [
  { email: 'carlos@barber.com', password: 'barbero123' },
  { email: 'david@barber.com', password: 'barbero123' },
  { email: 'andres@cliente.com', password: 'cliente123' },
  { email: 'laura@cliente.com', password: 'cliente123' },
  { email: 'sofia@cliente.com', password: 'cliente123' },
  { email: 'felipe@cliente.com', password: 'cliente123' },
  { email: 'pedro@cliente.com', password: 'cliente123' }
];

(async () => {
  try {
    await connectDB(); // Conexión a la base de datos
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await pool.request()
        .input('contrasena', hashed)
        .input('email', user.email)
        .query('UPDATE usuarios SET contrasena = @contrasena WHERE email = @email');
      console.log(`Contraseña actualizada para ${user.email}`);
    }
    console.log('Todas las contraseñas actualizadas correctamente');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();
