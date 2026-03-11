import { Request, Response, NextFunction } from "express";

// espera que verifyToken ya haya colocado user con permisos en req
export const authorizePermission = (...needed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const permisos: string[] = user.permisos || [];
    for (const p of needed) {
      if (!permisos.includes(p)) {
        return res.status(403).json({ message: "No autorizado (permiso)" });
      }
    }
    next();
  };
};