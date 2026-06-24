CREATE TABLE dbo.Pagos_Ventas (
  id_pago INT IDENTITY(1,1) PRIMARY KEY,
  id_venta INT NOT NULL,
  monto_pagado DECIMAL(12,2) NOT NULL,
  fecha_pago DATETIME2 NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  referencia VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES Ventas(id_ventas)
);
