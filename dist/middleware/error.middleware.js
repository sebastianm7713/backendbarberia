"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(400).json({
        message: err.message || "Error interno del servidor",
    });
};
exports.errorHandler = errorHandler;
