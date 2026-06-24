import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error middleware captured:', err);

  const statusCode = err?.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err?.message || "Error interno del servidor",
    error: err?.details || err?.stack || null,
  });
};