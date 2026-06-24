const sql = require('mssql');
const fs = require('fs');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function updateDevolucionesTable() {
  try {
    await sql.connect(config);

    console.log('Actualizando tabla Devoluciones para usar IDENTITY...');

    // Primero, crear tabla temporal con IDENTITY
    await sql.query(`
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
    `);

    // Copiar datos existentes
    await sql.query(`
      SET IDENTITY_INSERT dbo.Devoluciones_Temp ON;

      INSERT INTO dbo.Devoluciones_Temp (id_devolucion, id_detalle_producto, motivo, fecha, remitido)
      SELECT id_devolucion, id_detalle_producto, motivo, fecha, remitido
      FROM dbo.Devoluciones;

      SET IDENTITY_INSERT dbo.Devoluciones_Temp OFF;
    `);

    // Obtener el último ID usado
    const maxIdResult = await sql.query('SELECT ISNULL(MAX(id_devolucion), 0) AS maxId FROM dbo.Devoluciones_Temp');
    const maxId = maxIdResult.recordset[0].maxId;

    // Reiniciar IDENTITY al siguiente valor
    await sql.query(`DBCC CHECKIDENT ('dbo.Devoluciones_Temp', RESEED, ${maxId})`);

    // Eliminar tabla original y renombrar temporal
    await sql.query(`
      DROP TABLE dbo.Devoluciones;
      EXEC sp_rename 'dbo.Devoluciones_Temp', 'Devoluciones';
    `);

    console.log('Tabla Devoluciones actualizada exitosamente con IDENTITY');
  } catch (err) {
    console.error('Error actualizando tabla:', err);
  } finally {
    await sql.close();
  }
}

updateDevolucionesTable();