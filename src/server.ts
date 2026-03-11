import app from "./app";
import { connectDB } from "./config/database";
import { env } from "./config/env";

import authRoutes from "./modules/auth/auth.routes";
import usuariosRoutes from "./modules/usuarios/usuarios.routes";
import serviciosRoutes from "./modules/servicios/servicios.routes";
import ventasRoutes from "./modules/ventas/ventas.routes";
import comprasRoutes from "./modules/compras/compras.routes";
import citasRoutes from "./modules/citas/citas.routes";
import proveedoresRoutes from "./modules/proveedores/proveedores.routes";
import rolesRoutes from "./modules/roles/roles.routes";
import clientesRoutes from "./modules/clientes/clientes.routes";
import barberosRoutes from "./modules/barberos/barberos.routes";
import tipoDocumentoRoutes from "./modules/tipo_documento/tipo_documento.routes";
import marcasRoutes from "./modules/marcas/marcas.routes";
import categoriasProductosRoutes from "./modules/categorias_productos/categorias_productos.routes";
import alquilerSillaRoutes from "./modules/alquiler_silla/alquiler_silla.routes";
import disponibilidadExcepcionRoutes from "./modules/disponibilidad_excepcion/disponibilidad_excepcion.routes";
import permisosRoutes from "./modules/permisos/permisos.routes";
import devolucionesProveedorRoutes from "./modules/devoluciones_proveedor/devoluciones_proveedor.routes";
import consignacionesProveedorRoutes from "./modules/consignaciones_proveedor/consignaciones_proveedor.routes";
import detalleVentaProductoRoutes from "./modules/detalle_venta_producto/detalle_venta_producto.routes";
import detalleVentaServicioRoutes from "./modules/detalle_venta_servicio/detalle_venta_servicio.routes";
import rolPermisoRoutes from "./modules/rol_permiso/rol_permiso.routes";
import devolucionesRoutes from "./modules/devoluciones/devoluciones.routes";

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/barberos", barberosRoutes);
app.use("/api/tipos-documento", tipoDocumentoRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/categorias-productos", categoriasProductosRoutes);
app.use("/api/alquiler-silla", alquilerSillaRoutes);
app.use("/api/disponibilidad-excepcion", disponibilidadExcepcionRoutes);
app.use("/api/permisos", permisosRoutes);
app.use("/api/devoluciones-proveedor", devolucionesProveedorRoutes);
app.use("/api/consignaciones-proveedor", consignacionesProveedorRoutes);
app.use("/api/detalle-venta-producto", detalleVentaProductoRoutes);
app.use("/api/detalle-venta-servicio", detalleVentaServicioRoutes);
app.use("/api/rol-permiso", rolPermisoRoutes);
app.use("/api/devoluciones", devolucionesRoutes);

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor en puerto ${env.PORT}`);
  });
};

start();