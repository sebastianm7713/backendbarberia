"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVariable(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ La variable de entorno ${key} no está definida`);
    }
    return value;
}
exports.env = {
    PORT: process.env.PORT || "4000",
    DB_USER: getEnvVariable("DB_USER"),
    DB_PASSWORD: getEnvVariable("DB_PASSWORD"),
    DB_SERVER: getEnvVariable("DB_SERVER"),
    DB_DATABASE: getEnvVariable("DB_DATABASE"),
    JWT_SECRET: getEnvVariable("JWT_SECRET"),
};
