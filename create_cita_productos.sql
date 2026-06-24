CREATE TABLE dbo.Cita_Productos (
  id_cita INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(18,2) NOT NULL,
  PRIMARY KEY (id_cita, id_producto),
  FOREIGN KEY (id_cita) REFERENCES Citas(id_cita),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);