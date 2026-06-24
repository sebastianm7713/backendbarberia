"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermiso = exports.updatePermiso = exports.seedDefaultPermisos = exports.getPermisosTree = exports.createPermiso = exports.getPermisoById = exports.getAllPermisos = void 0;
const repository = __importStar(require("./permisos.repository"));
const permisos_constants_1 = require("./permisos.constants");
const getAllPermisos = async () => await repository.getAllPermisos();
exports.getAllPermisos = getAllPermisos;
const getPermisoById = async (id) => await repository.getPermisoById(id);
exports.getPermisoById = getPermisoById;
const createPermiso = async (data) => {
    await repository.createPermiso(data);
    return { message: "Permiso creado correctamente" };
};
exports.createPermiso = createPermiso;
const getPermisosTree = async () => {
    const permisos = await repository.getAllPermisos();
    const tree = {};
    // Aceptar tanto 'Gestión' como 'Gestion' (con/sin acento) y 'Dashboard'
    const regex = /^(Gesti[oó]n de [^-]+|Dashboard) - (Ver|Crear|Editar|Eliminar|Cambiar Estado)$/i;
    permisos.forEach((permiso) => {
        const match = permiso.nombre.match(regex);
        if (!match) {
            const moduleKey = "Otros";
            if (!tree[moduleKey]) {
                tree[moduleKey] = { module: moduleKey, permisos: [] };
            }
            tree[moduleKey].permisos.push({
                id_permiso: permiso.id_permiso,
                nombre: permiso.nombre,
                descripcion: permiso.descripcion
            });
            return;
        }
        const moduleLabel = match[1];
        const action = match[2];
        if (!tree[moduleLabel]) {
            tree[moduleLabel] = { module: moduleLabel, permisos: [] };
        }
        tree[moduleLabel].permisos.push({
            id_permiso: permiso.id_permiso,
            action,
            nombre: permiso.nombre,
            descripcion: permiso.descripcion
        });
    });
    return Object.values(tree);
};
exports.getPermisosTree = getPermisosTree;
const seedDefaultPermisos = async () => {
    const inserted = [];
    for (const permiso of permisos_constants_1.defaultPermissionDefinitions) {
        const row = await repository.createPermisoIfNotExists(permiso);
        inserted.push(row);
    }
    return inserted;
};
exports.seedDefaultPermisos = seedDefaultPermisos;
const updatePermiso = async (id, data) => {
    await repository.updatePermiso(id, data);
    return { message: "Permiso actualizado correctamente" };
};
exports.updatePermiso = updatePermiso;
const deletePermiso = async (id) => {
    await repository.deletePermiso(id);
    return { message: "Permiso eliminado correctamente" };
};
exports.deletePermiso = deletePermiso;
