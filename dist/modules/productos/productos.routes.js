"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = require("./productos.controller");
const router = (0, express_1.Router)();
router.get("/", productos_controller_1.listar);
exports.default = router;
