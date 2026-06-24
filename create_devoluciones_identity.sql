CREATE TABLE dbo.Devoluciones (
  id_devolucion INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  id_detalle_producto INT NOT NULL,
  motivo VARCHAR(255) NULL,
  fecha DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  remitido VARCHAR(20) NOT NULL
      CHECK (remitido IN ('stock','proveedor')),

  CONSTRAINT FK_Devoluciones_DetalleProducto
      FOREIGN KEY (id_detalle_producto)
      REFERENCES Detalle_Venta_Producto(id_detalle_producto)
);