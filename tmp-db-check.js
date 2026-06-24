const sql = require('mssql');
require('dotenv').config();
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: false, trustServerCertificate: true },
};
(async () => {
  try {
    const pool = await sql.connect(config);
    const res = await pool.request().query('SELECT TOP 5 * FROM ConfiguracionLanding');
    console.log('rows', res.recordset.length);
    console.log(JSON.stringify(res.recordset, null, 2));
    await pool.close();
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
