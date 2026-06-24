"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
function getEnvVariable(key) {
    var value = process.env[key];
    if (!value) {
        throw new Error("\u274C La variable de entorno ".concat(key, " no est\u00E1 definida"));
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
