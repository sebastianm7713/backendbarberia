import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(user.rol)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};