import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`❌ La variable de entorno ${key} no está definida`);
  }

  return value;
}

export const env = {
  PORT: process.env.PORT || "4000",

  DB_USER: getEnvVariable("DB_USER"),
  DB_PASSWORD: getEnvVariable("DB_PASSWORD"),
  DB_SERVER: getEnvVariable("DB_SERVER"),
  DB_DATABASE: getEnvVariable("DB_DATABASE"),

  JWT_SECRET: getEnvVariable("JWT_SECRET"),
};