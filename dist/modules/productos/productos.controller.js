"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listar = void 0;
const productos_service_1 = require("./productos.service");
const listar = async (_, res) => {
    res.json(await (0, productos_service_1.getProductos)());
};
exports.listar = listar;
