"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "No autenticado" });
        }
        if (!allowedRoles.includes(user.rol)) {
            return res.status(403).json({ message: "No autorizado" });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
