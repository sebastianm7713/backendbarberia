-- Actualizar contraseña del usuario admin
UPDATE usuarios
SET password = 'admin123'
WHERE email = 'juanperez@barber.com';

-- Verificar que se actualizó
SELECT id_usuario, nombre, email, password, rol_id
FROM usuarios
WHERE email = 'juanperez@barber.com';