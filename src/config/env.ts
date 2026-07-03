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

  DB_ENCRYPT: process.env.DB_ENCRYPT === "true",
  DB_TRUST_SERVER_CERTIFICATE:
    process.env.DB_TRUST_SERVER_CERTIFICATE === "true",

  JWT_SECRET: getEnvVariable("JWT_SECRET"),

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@yourdomain.com",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};