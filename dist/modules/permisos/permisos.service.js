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
exports.deletePermiso = exports.updatePermiso = exports.seedDefaultPermisos = exports.getPermisosTree = exports.cleanupDuplicatePermisos = exports.createPermiso = exports.getPermisoById = exports.getAllPermisos = void 0;
const database_1 = require("../../config/database");
const repository = __importStar(require("./permisos.repository"));
const permisos_constants_1 = require("./permisos.constants");
const normalizeText = (value) => value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const findProcessBySubmodule = (submoduleLabel) => {
    const normalized = normalizeText(submoduleLabel);
    return permisos_constants_1.DEFAULT_PERMISSION_STRUCTURE.find((process) => process.submodules.some((submodule) => normalizeText(submodule.label) === normalized));
};
const getAllPermisos = async () => await repository.getAllPermisos();
exports.getAllPermisos = getAllPermisos;
const getPermisoById = async (id) => await repository.getPermisoById(id);
exports.getPermisoById = getPermisoById;
const createPermiso = async (data) => {
    await repository.createPermiso(data);
    return { message: "Permiso creado correctamente" };
};
exports.createPermiso = createPermiso;
const cleanupDuplicatePermisos = async () => {
    const permisos = await repository.getAllPermisos();
    const grouped = permisos.reduce((acc, permiso) => {
        const key = normalizeText(permiso.nombre ?? '');
        if (!acc[key])
            acc[key] = [];
        acc[key].push(permiso);
        return acc;
    }, {});
    const duplicateGroups = Object.values(grouped).filter((group) => group.length > 1);
    if (duplicateGroups.length === 0) {
        return { cleaned: 0, duplicateGroups: 0 };
    }
    const transaction = database_1.pool.transaction();
    await transaction.begin();
    try {
        let cleaned = 0;
        for (const group of duplicateGroups) {
            const [canonical, ...duplicates] = group.sort((a, b) => a.id_permiso - b.id_permiso);
            for (const duplicate of duplicates) {
                await transaction.request()
                    .input('canonicalId', canonical.id_permiso)
                    .input('duplicateId', duplicate.id_permiso)
                    .query(`
            UPDATE rp
            SET id_permiso = @canonicalId
            FROM Rol_Permiso rp
            LEFT JOIN Rol_Permiso target
              ON target.id_rol = rp.id_rol
              AND target.id_permiso = @canonicalId
            WHERE rp.id_permiso = @duplicateId
              AND target.id_rol IS NULL;

            DELETE FROM Rol_Permiso WHERE id_permiso = @duplicateId;
          `);
                await transaction.request()
                    .input('duplicateId', duplicate.id_permiso)
                    .query(`DELETE FROM Permisos WHERE id_permiso = @duplicateId`);
                cleaned += 1;
            }
        }
        await transaction.commit();
        return { cleaned, duplicateGroups: duplicateGroups.length };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.cleanupDuplicatePermisos = cleanupDuplicatePermisos;
const getPermisosTree = async () => {
    const permisos = await repository.getAllPermisos();
    const tree = {};
    const regex = /^(?:Gesti[oó]n de\s+)?([^-]+?)\s*-\s*(Ver|Crear|Editar|Eliminar|Cambiar Estado|Anular|Detalle)$/i;
    permisos.forEach((permiso) => {
        const match = permiso.nombre.match(regex);
        if (!match) {
            const moduleKey = 'Otros';
            if (!tree[moduleKey])
                tree[moduleKey] = { processLabel: moduleKey, submodules: [{ label: moduleKey, acciones: [] }] };
            tree[moduleKey].submodules[0].acciones.push({
                id_permiso: permiso.id_permiso,
                action: 'Ver',
                nombre: permiso.nombre,
                descripcion: permiso.descripcion,
            });
            return;
        }
        const submoduleLabel = match[1].trim();
        const action = match[2];
        const process = findProcessBySubmodule(submoduleLabel);
        const processLabel = process?.processLabel || submoduleLabel;
        const submoduleKey = submoduleLabel;
        if (!tree[processLabel]) {
            tree[processLabel] = { processLabel, submodules: [] };
        }
        let submodule = tree[processLabel].submodules.find((item) => item.label === submoduleKey);
        if (!submodule) {
            submodule = { label: submoduleKey, acciones: [] };
            tree[processLabel].submodules.push(submodule);
        }
        submodule.acciones.push({
            id_permiso: permiso.id_permiso,
            action,
            nombre: permiso.nombre,
            descripcion: permiso.descripcion,
        });
    });
    const ordered = [...permisos_constants_1.DEFAULT_PERMISSION_STRUCTURE.map((process) => process.processLabel)];
    return Object.values(tree)
        .sort((a, b) => {
        const aIndex = ordered.indexOf(a.processLabel);
        const bIndex = ordered.indexOf(b.processLabel);
        if (aIndex === -1 && bIndex === -1)
            return a.processLabel.localeCompare(b.processLabel, 'es');
        if (aIndex === -1)
            return 1;
        if (bIndex === -1)
            return -1;
        return aIndex - bIndex;
    });
};
exports.getPermisosTree = getPermisosTree;
const seedDefaultPermisos = async () => {
    await (0, exports.cleanupDuplicatePermisos)();
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
