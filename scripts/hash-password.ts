import bcrypt from 'bcrypt';

(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  console.log('Contraseña hasheada:', hashed);
})();