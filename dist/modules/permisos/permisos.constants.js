"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPermissionDefinitions = exports.permissionActions = exports.permissionModules = void 0;
exports.permissionModules = [
    "Alquiler Silla",
    "Barberos",
    "Categorías de Productos",
    "Citas",
    "Clientes",
    "Compras",
    "Configuración",
    "Consignaciones",
    "Dashboard",
    "Detalle Compra",
    "Devoluciones",
    "Devoluciones Proveedor",
    "Disponibilidad Excepcion",
    "Estado Venta",
    "Facturas",
    "Marcas",
    "Pagos",
    "Permisos",
    "Productos",
    "Proveedores",
    "Rol Permiso",
    "Roles",
    "Servicios",
    "Tipo Documento",
    "Usuarios",
    "Ventas"
];
exports.permissionActions = [
    "Ver",
    "Crear",
    "Editar",
    "Eliminar",
    "Cambiar Estado"
];
exports.defaultPermissionDefinitions = exports.permissionModules.flatMap((module) => {
    if (module === "Dashboard") {
        return [
            {
                nombre: `Gestión de ${module} - Ver`,
                descripcion: `Permiso para ver el ${module}`
            }
        ];
    }
    return exports.permissionActions.map((action) => ({
        nombre: `Gestión de ${module} - ${action}`,
        descripcion: `Permiso para ${action.toLowerCase()} en Gestión de ${module}`
    }));
});
