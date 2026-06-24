ALTER TABLE Citas
  ALTER COLUMN id_cliente INT NULL;

ALTER TABLE Citas
  ADD guest_nombre VARCHAR(200) NULL,
      guest_email VARCHAR(150) NULL,
      guest_telefono VARCHAR(50) NULL;
