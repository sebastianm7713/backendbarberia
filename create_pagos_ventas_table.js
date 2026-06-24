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

async function createPagosVentasTable() {
  try {
    await sql.connect(config);

    const sqlScript = fs.readFileSync('create_pagos_ventas.sql', 'utf8');

    await sql.query(sqlScript);
    console.log('Tabla Pagos_Ventas creada exitosamente');
  } catch (err) {
    console.error('Error creando tabla:', err);
  } finally {
    await sql.close();
  }
}

createPagosVentasTable();