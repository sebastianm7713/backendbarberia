# Prueba de Conversión Cita → Venta

Este script permite probar la conversión de una cita a venta cuando se marca como completada, verificando que los productos se transfieran correctamente a `Detalle_Venta_Producto`.

## Requisitos

- Servidor backend corriendo en `http://localhost:4000`
- Base de datos con una cita que tenga productos en `Cita_Productos`
- Credenciales de administrador válidas

## Uso

```bash
node test-cita-completado.js <id_cita>
```

### Ejemplo

```bash
node test-cita-completado.js 10
```

## Qué hace el script

1. **Login**: Inicia sesión con credenciales de administrador
2. **Completar cita**: Envía PUT a `/api/citas/{id}` con `estado: "completado"`
3. **Verificar conversión**: Consulta la cita y la venta resultante para confirmar que:
   - La cita tiene `id_ventas` asignado
   - La venta existe en `/api/ventas`
   - Los productos aparecen en `venta.productos`
   - Los servicios aparecen en `venta.servicios`

## Logs esperados en el backend

Al ejecutar, deberías ver logs detallados en la consola del backend como:

```
cambiarEstado COMPLETADO - INICIANDO conversión de cita a venta { id_cita: 10, estado: 'completado' }
cambiarEstado COMPLETADO - LEYENDO productos de cita { id_cita: 10 }
cambiarEstado COMPLETADO - productosCita { id_cita: 10, productosCita: [...], recordsetLength: 1 }
cambiarEstado COMPLETADO - INICIANDO inserción de productos { id_cita: 10, productosCitaCount: 1, productosCita: [...] }
cambiarEstado COMPLETADO - procesando producto { id_cita: 10, producto: { id: 1, cant: 2, precio: 25000 } }
cambiarEstado COMPLETADO - insertando Detalle_Venta_Producto { id_ventas: 24, id_detalle_producto: 15, ... }
cambiarEstado COMPLETADO - INSERT ejecutado { id_cita: 10, id_ventas: 24, id_detalle_producto: 15, rowsAffected: 1 }
cambiarEstado COMPLETADO - verificación post-insert { id_cita: 10, id_detalle_producto: 15, insertCount: 1 }
cambiarEstado COMPLETADO - producto insertado exitosamente { id_cita: 10, productosInsertados: 1 }
cambiarEstado COMPLETADO - FINALIZANDO inserción de productos { id_cita: 10, productosCitaCount: 1, productosInsertados: 1 }
cambiarEstado COMPLETADO - CONTEO FINAL de productos en DB { id_cita: 10, id_ventas: 24, productosCitaCount: 1, productosInsertados: 1, totalProductosInsertados: 1, countQueryResult: [ { total: 1 } ] }
cambiarEstado COMPLETADO - INSERCIÓN DE PRODUCTOS COMPLETADA { id_cita: 10, id_ventas: 24, productosInsertados: 1, totalProductosInsertados: 1 }
cambiarEstado - COMMIT de transacción { id_cita: 10, estado: 'completado' }
cambiarEstado - TRANSACCIÓN COMMITED exitosamente { id_cita: 10, estado: 'completado' }
```

## Posibles problemas

- **No hay productos en la cita**: Verifica que `Cita_Productos` tenga registros para esa cita
- **Error de inserción**: Revisa logs de "ERROR" o "producto no se insertó"
- **Transacción falla**: Busca logs de rollback o errores de commit
- **Venta no aparece**: Verifica que `cambiarEstado` se ejecute completamente

## Archivos modificados

- `src/modules/citas/citas.service.ts`: Agregados logs detallados en `cambiarEstado()` para `estado === "completado"`