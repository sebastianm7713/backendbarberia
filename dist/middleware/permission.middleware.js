"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeByModule = exports.authorizeAnyPermission = exports.authorizePermission = void 0;
const normalizeText = (value) => {
    if (value == null)
        return '';
    return String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};
const getUserRole = (value) => {
    if (value == null)
        return null;
    const normalized = String(value).trim().toLowerCase();
    if (!Number.isNaN(Number(normalized)))
        return Number(normalized);
    if (['admin', 'administrador', 'administrator', 'adm'].includes(normalized))
        return 1;
    if (['barbero', 'barber'].includes(normalized))
        return 2;
    if (['cliente', 'client'].includes(normalized))
        return 3;
    if (['empleado', 'employee'].includes(normalized))
        return 4;
    if (['gerente', 'manager'].includes(normalized))
        return 5;
    return null;
};
const permissionMatchesKeyword = (permiso, keyword) => {
    const normalizedPermiso = normalizeText(permiso);
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedPermiso || !normalizedKeyword)
        return false;
    const permisoTokens = normalizedPermiso.split(' ').filter(Boolean);
    const keywordTokens = normalizedKeyword
        .split(' ')
        .filter(Boolean)
        .filter((token) => !['gestion', 'gestión', 'de', 'del', 'la', 'las', 'el', 'los', 'y', 'para', 'por', 'en', 'con', 'a', 'al'].includes(token));
    return keywordTokens.every((token) => permisoTokens.includes(token));
};
// espera que verifyToken ya haya colocado user con permisos en req
const authorizePermission = (...needed) => {
    return (req, res, next) => {
        const user = req.user;
        console.log('authorizePermission - header.Authorization present:', !!req.headers.authorization);
        console.log('authorizePermission - user on req:', user);
        console.log('authorizePermission - needed perms:', needed);
        if (!user) {
            console.warn('authorizePermission - No user on request');
            return res.status(401).json({ message: "No autenticado" });
        }
        let userRole = getUserRole(user.rol ?? user.role ?? user.id_rol ?? user.roleRaw ?? null);
        const userRoleByName = getUserRole(user.rol_nombre ?? user.nombre_rol ?? null);
        if (userRoleByName === 1)
            userRole = 1;
        if (userRole == null)
            userRole = -1;
        if (userRole === 1) {
            console.log('authorizePermission - bypassing permission check for admin role:', userRole);
            return next();
        }
        const permisos = Array.isArray(user.permisos) ? user.permisos : [];
        const hasAllNeeded = needed.every((required) => permisos.some((permiso) => permissionMatchesKeyword(permiso, required)));
        if (!hasAllNeeded) {
            console.warn('authorizePermission - Missing permiso:', needed, 'user.permisos:', permisos);
            return res.status(403).json({ message: "No autorizado (permiso)" });
        }
        console.log('authorizePermission - permission check passed');
        next();
    };
};
exports.authorizePermission = authorizePermission;
// Permite pasar una lista de palabras clave y autoriza si el usuario tiene
// al menos un permiso que contenga cualquiera de las palabras clave.
const authorizeAnyPermission = (...keywords) => {
    return (req, res, next) => {
        const user = req.user;
        console.log('authorizeAnyPermission - header.Authorization present:', !!req.headers.authorization);
        console.log('authorizeAnyPermission - user on req:', user);
        console.log('authorizeAnyPermission - keywords:', keywords);
        if (!user) {
            console.warn('authorizeAnyPermission - No user on request');
            return res.status(401).json({ message: 'No autenticado' });
        }
        let userRole = getUserRole(user.rol ?? user.role ?? user.id_rol ?? user.roleRaw ?? null);
        const userRoleByName = getUserRole(user.rol_nombre ?? user.nombre_rol ?? null);
        if (userRoleByName === 1)
            userRole = 1;
        if (userRole == null)
            userRole = -1;
        if (userRole === 1) {
            console.log('authorizeAnyPermission - bypassing permission check for admin role:', userRole);
            return next();
        }
        const permisos = Array.isArray(user.permisos) ? user.permisos : [];
        const matched = permisos.some((permiso) => keywords.some((keyword) => permissionMatchesKeyword(permiso, keyword)));
        if (!matched) {
            console.warn('authorizeAnyPermission - No matching permiso for keywords:', keywords, 'user.permisos:', permisos);
            return res.status(403).json({ message: 'No autorizado (permiso - any)' });
        }
        console.log('authorizeAnyPermission - permission check passed (any)');
        next();
    };
};
exports.authorizeAnyPermission = authorizeAnyPermission;
// Autoriza automáticamente según el módulo y el método HTTP.
// Ejemplo: authorizeByModule('Barberos') -> GET='Ver', POST='Crear', PUT/PATCH='Editar' (o 'Cambiar Estado' si la ruta contiene '/estado'), DELETE='Eliminar'
const authorizeByModule = (moduleName) => {
    return (req, res, next) => {
        const method = (req.method || 'GET').toUpperCase();
        let action = 'Ver';
        if (method === 'POST')
            action = 'Crear';
        else if (method === 'DELETE')
            action = 'Eliminar';
        else if (method === 'PUT' || method === 'PATCH') {
            const path = String(req.path || '').toLowerCase();
            if (path.includes('/estado'))
                action = 'Cambiar Estado';
            else
                action = 'Editar';
        }
        const permisoNombre = `Gestión de ${moduleName} - ${action}`;
        return (0, exports.authorizePermission)(permisoNombre)(req, res, next);
    };
};
exports.authorizeByModule = authorizeByModule;
