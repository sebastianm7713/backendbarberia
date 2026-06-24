-- Script para agregar columna cantidad a tabla Devoluciones
-- Ejecutar en SQL Server Management Studio

ALTER TABLE Devoluciones
ADD cantidad INT NULL;

-- Opcional: Establecer un valor por defecto para registros existentes
UPDATE Devoluciones
SET cantidad = 1
WHERE cantidad IS NULL;

-- Hacer la columna NOT NULL si es requerida
-- ALTER TABLE Devoluciones
-- ALTER COLUMN cantidad INT NOT NULL;

PRINT 'Columna cantidad agregada exitosamente a tabla Devoluciones';