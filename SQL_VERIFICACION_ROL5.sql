-- 🔍 SCRIPT DE VERIFICACIÓN - Ejecuta en SQL Server

-- 1. Verificar que el rol 5 existe y tiene nombre
SELECT 'PASO 1: Verificar Roles' AS Paso;
SELECT id_rol, nombre, descripcion, estado
FROM Roles
WHERE id_rol IN (1, 2, 3, 4, 5)
ORDER BY id_rol;

-- 2. Verificar que el usuario existe
SELECT 'PASO 2: Verificar Usuario' AS Paso;
SELECT id_usuario, nombre, email, id_rol
FROM usuarios
WHERE email = 'ejemplo@gmail.com';

-- 3. Verificar que el rol tiene permisos
SELECT 'PASO 3: Verificar Permisos del Rol 5' AS Paso;
SELECT rp.id_rol, p.id_permiso, p.nombre AS nombre_permiso
FROM Rol_Permiso rp
JOIN Permisos p ON rp.id_permiso = p.id_permiso
WHERE rp.id_rol = 5
ORDER BY p.nombre;

-- 4. Verificar todos los permisos disponibles
SELECT 'PASO 4: Todos los Permisos Disponibles' AS Paso;
SELECT id_permiso, nombre, descripcion
FROM Permisos
ORDER BY nombre;

-- 5. CORRECCIÓN SI FALTA: Asegurar que el rol 5 está bien configurado
-- DESCOMENTA Y EJECUTA SOLO SI EL PASO 1 MUESTRA QUE FALTA EL ROL 5:
/*
INSERT INTO Roles (nombre, descripcion, estado)
VALUES ('Gerente', 'Rol para gerentes con acceso a reportes y control', 1);
*/

-- 6. CORRECCIÓN SI FALTAN PERMISOS: Asignar permisos básicos al rol 5
-- DESCOMENTA Y EJECUTA SOLO SI EL PASO 3 NO MUESTRA PERMISOS:
/*
DELETE FROM Rol_Permiso WHERE id_rol = 5;

INSERT INTO Rol_Permiso (id_rol, id_permiso)
SELECT 5, id_permiso FROM Permisos 
WHERE nombre IN (
    'VER_CITAS_PROPIAS',
    'RESERVAR_CITA', 
    'VER_SERVICIOS',
    'VER_CITAS',
    'VER_DASHBOARD',
    'VER_CLIENTES'
);
*/

-- 7. Verificar después de las correcciones (ejecuta esto último)
SELECT 'PASO 5: Verificación Final' AS Paso;
SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    r.id_rol,
    r.nombre AS nombre_rol,
    COUNT(p.id_permiso) AS cantidad_permisos,
    STRING_AGG(p.nombre, ', ') AS permisos
FROM usuarios u
LEFT JOIN Roles r ON u.id_rol = r.id_rol
LEFT JOIN Rol_Permiso rp ON r.id_rol = rp.id_rol
LEFT JOIN Permisos p ON rp.id_permiso = p.id_permiso
WHERE u.id_rol = 5
GROUP BY u.id_usuario, u.nombre, u.email, r.id_rol, r.nombre;
