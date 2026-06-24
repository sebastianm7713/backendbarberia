const sql = require('mssql');
const config = require('./src/config/database');
(async () => {
  try {
    await sql.connect(config);
    const r = await sql.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Detalle_Venta_Producto'");
    console.log(r.recordset.map(x => x.COLUMN_NAME));
    await sql.close();
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  }
})();
