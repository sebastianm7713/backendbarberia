const sql = require('mssql');
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

async function createTable() {
  try {
    await sql.connect(config);
    await sql.query(`
      CREATE TABLE dbo.Cita_Productos (
        id_cita INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(18,2) NOT NULL,
        PRIMARY KEY (id_cita, id_producto),
        FOREIGN KEY (id_cita) REFERENCES Citas(id_cita),
        FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
      );
    `);
    console.log('Tabla Cita_Productos creada exitosamente');
  } catch (err) {
    console.error('Error creando tabla:', err);
  } finally {
    await sql.close();
  }
}

createTable();