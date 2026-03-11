import sql from "mssql";
import { env } from "./env";

const config: sql.config = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  server: env.DB_SERVER,
  database: env.DB_DATABASE,

  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const connectWithRetry = async (maxRetries = 3, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Intento ${i + 1}/${maxRetries} conectando a BD...`);
      await pool.connect();
      console.log("SQL Server conectado exitosamente");
      return true;
    } catch (error: any) {
      console.error(
        `Intento ${i + 1} fallido. Error: ${error.message}`
      );
      if (i < maxRetries - 1) {
        console.log(`Reintentando en ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(
    `No se pudo conectar a la BD despues de ${maxRetries} intentos`
  );
};

export const pool = new sql.ConnectionPool(config);

export const connectDB = async () => {
  try {
    await connectWithRetry(3, 2000);
  } catch (error: any) {
    console.error(
      "Error critico:",
      error.message,
      "\nAsegurate de que:",
      "\n  1. SQL Server esta en ejecucion",
      "\n  2. El servidor es:",
      env.DB_SERVER,
      "\n  3. Las credenciales son correctas:",
      `Usuario: ${env.DB_USER}`,
      "\n  4. La base de datos existe:",
      env.DB_DATABASE
    );
    process.exit(1);
  }
};