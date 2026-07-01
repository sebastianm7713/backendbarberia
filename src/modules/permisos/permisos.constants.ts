export const DEFAULT_PERMISSION_STRUCTURE = [
  {
    processLabel: 'Configuración',
    submodules: [
      { label: 'Gestión de Roles', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Cambiar Estado'] },
      { label: 'Configurar Landing Page', actions: ['Ver', 'Editar'] },
    ],
  },
  {
    processLabel: 'Usuarios',
    submodules: [
      { label: 'Gestión de Usuarios', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Cambiar Estado'] },
      { label: 'Gestión de Barberos', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Cambiar Estado'] },
    ],
  },
  {
    processLabel: 'Compras',
    submodules: [
      { label: 'Gestión de Productos', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Categorías de Productos', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Gestión de Proveedores', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Gestión de Compras', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Anular', 'Detalle'] },
      { label: 'Consignaciones a Proveedor', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Pagos de Compras', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Devoluciones a Proveedor', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Detalle'] },
    ],
  },
  {
    processLabel: 'Agendamiento',
    submodules: [
      { label: 'Gestión de Servicios', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Gestión de Citas', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Cambiar Estado', 'Detalle'] },
    ],
  },
  {
    processLabel: 'Ventas',
    submodules: [
      { label: 'Gestión de Clientes', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Pagos Ventas', actions: ['Ver', 'Crear', 'Editar', 'Eliminar'] },
      { label: 'Gestión de Ventas', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Anular', 'Detalle'] },
      { label: 'Devolución al Stock', actions: ['Ver', 'Crear', 'Editar', 'Eliminar', 'Detalle'] },
    ],
  },
  {
    processLabel: 'Medición de Desempeño',
    submodules: [
      { label: 'Dashboard General', actions: ['Ver'] },
      { label: 'Reportes de Ventas', actions: ['Ver'] },
      { label: 'Rendimiento de Empleados', actions: ['Ver'] },
    ],
  },
];

export const defaultPermissionDefinitions = DEFAULT_PERMISSION_STRUCTURE.flatMap((process) =>
  process.submodules.flatMap((submodule) =>
    submodule.actions.map((action) => ({
      nombre: `${submodule.label} - ${action}`,
      descripcion:
        action === 'Ver'
          ? `Permiso para ver ${submodule.label}`
          : `Permiso para ${action.toLowerCase()} en ${submodule.label}`,
    }))
  )
);
