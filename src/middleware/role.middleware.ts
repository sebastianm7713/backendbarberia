import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    console.log('authorizeRoles - header.Authorization present:', !!req.headers.authorization);
    console.log('authorizeRoles - user on req:', user);
    console.log('authorizeRoles - allowedRoles:', allowedRoles);

    if (!user) {
      console.warn('authorizeRoles - No user on request');
      return res.status(401).json({ success: false, message: "No autenticado" });
    }

    const userRole = user.rol ?? user.role ?? user.id_rol ?? null;
    if (!allowedRoles.includes(userRole)) {
      console.warn('authorizeRoles - user role not allowed:', userRole);
      return res.status(403).json({ success: false, message: "No autorizado" });
    }

    console.log('authorizeRoles - role check passed');
    next();
  };
};