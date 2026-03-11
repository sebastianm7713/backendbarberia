-- Actualizar contraseña del usuario admin
UPDATE usuarios
SET password = '$2b$10$WhJ0z5.JThymtbIE0VX8IeAnv354XYeFUewESzqC/RyWEl0BVAnp2'
WHERE email = 'juanperez@barber.com';

-- Verificar que se actualizó
SELECT id_usuario, nombre, email, password, rol_id
FROM usuarios
WHERE email = 'juanperez@barber.com';