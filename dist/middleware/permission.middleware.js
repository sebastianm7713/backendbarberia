"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermission = void 0;
// espera que verifyToken ya haya colocado user con permisos en req
const authorizePermission = (...needed) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "No autenticado" });
        }
        const permisos = user.permisos || [];
        for (const p of needed) {
            if (!permisos.includes(p)) {
                return res.status(403).json({ message: "No autorizado (permiso)" });
            }
        }
        next();
    };
};
exports.authorizePermission = authorizePermission;
