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

async function insertEstado() {
  try {
    await sql.connect(config);
    await sql.query(`
      INSERT INTO Estado_Venta (id_estado, nombre_estado)
      VALUES (3, 'cancelada');
    `);
    console.log('Estado "cancelada" insertado correctamente');
  } catch (err) {
    console.error('Error insertando estado:', err);
  } finally {
    await sql.close();
  }
}

insertEstado();