-- Script para actualizar tabla Devoluciones a IDENTITY
-- Ejecutar en SQL Server Management Studio

-- 1. Crear tabla temporal con IDENTITY
CREATE TABLE dbo.Devoluciones_Temp (
  id_devolucion INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  id_detalle_producto INT NOT NULL,
  motivo VARCHAR(255) NULL,
  fecha DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  remitido VARCHAR(20) NOT NULL
      CHECK (remitido IN ('stock','proveedor')),

  CONSTRAINT FK_Devoluciones_Temp_DetalleProducto
      FOREIGN KEY (id_detalle_producto)
      REFERENCES Detalle_Venta_Producto(id_detalle_producto)
);

-- 2. Copiar datos existentes
SET IDENTITY_INSERT dbo.Devoluciones_Temp ON;

INSERT INTO dbo.Devoluciones_Temp (id_devolucion, id_detalle_producto, motivo, fecha, remitido)
SELECT id_devolucion, id_detalle_producto, motivo, fecha, remitido
FROM dbo.Devoluciones;

SET IDENTITY_INSERT dbo.Devoluciones_Temp OFF;

-- 3. Obtener el último ID usado y reiniciar IDENTITY
DECLARE @maxId INT;
SELECT @maxId = ISNULL(MAX(id_devolucion), 0) FROM dbo.Devoluciones_Temp;
DBCC CHECKIDENT ('dbo.Devoluciones_Temp', RESEED, @maxId);

-- 4. Eliminar tabla original y renombrar temporal
DROP TABLE dbo.Devoluciones;
EXEC sp_rename 'dbo.Devoluciones_Temp', 'Devoluciones';

PRINT 'Tabla Devoluciones actualizada exitosamente con IDENTITY';