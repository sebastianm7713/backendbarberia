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

async function addCantidadColumn() {
  try {
    await sql.connect(config);

    console.log('Agregando columna cantidad a tabla Devoluciones...');

    // Verificar si la columna ya existe
    const checkColumn = await sql.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Devoluciones' AND COLUMN_NAME = 'cantidad'
    `);

    if (checkColumn.recordset.length > 0) {
      console.log('La columna cantidad ya existe en la tabla Devoluciones');
      return;
    }

    // Agregar la columna cantidad
    await sql.query(`
      ALTER TABLE Devoluciones
      ADD cantidad INT NULL
    `);

    // Establecer valor por defecto para registros existentes
    await sql.query(`
      UPDATE Devoluciones
      SET cantidad = 1
      WHERE cantidad IS NULL
    `);

    console.log('Columna cantidad agregada exitosamente a tabla Devoluciones');
  } catch (err) {
    console.error('Error agregando columna:', err);
  } finally {
    await sql.close();
  }
}

addCantidadColumn();