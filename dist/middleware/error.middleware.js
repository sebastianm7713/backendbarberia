"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error middleware captured:', err);
    const statusCode = err?.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err?.message || "Error interno del servidor",
        error: err?.details || err?.stack || null,
    });
};
exports.errorHandler = errorHandler;
