# Funcionalidad de Consignaciones de Proveedor

## Descripción
Esta funcionalidad permite gestionar productos que son recibidos en consignación de proveedores. Cuando se registra un producto con tipo de adquisición "consignacion", automáticamente se crea un registro en la tabla `Consignaciones_Proveedor` para llevar el control del inventario consignado.

## Tabla de Base de Datos
```sql
CREATE TABLE Consignaciones_Proveedor (
  id_consignacion INT PRIMARY KEY,
  id_proveedor INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad_recibida INT NOT NULL,
  precio_proveedor DECIMAL(10,2) NOT NULL,
  precio_venta DECIMAL(10,2) NOT NULL,
  fecha_entrega DATE NOT NULL,
  cantidad_vendida INT DEFAULT 0,
  fecha_pago DATE NULL,
  estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, pagado, devuelto
  observaciones TEXT,
  FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
```

## API Endpoints

### Productos
- **POST /api/productos** - Crear producto (incluye soporte para consignaciones)

### Consignaciones
- **GET /api/consignaciones-proveedor** - Listar todas las consignaciones
- **GET /api/consignaciones-proveedor/:id** - Obtener consignación por ID
- **POST /api/consignaciones-proveedor** - Crear consignación manualmente
- **PUT /api/consignaciones-proveedor/:id** - Actualizar consignación
- **DELETE /api/consignaciones-proveedor/:id** - Eliminar consignación

## Crear Producto por Consignación

Para crear un producto por consignación, enviar una petición POST a `/api/productos` con el siguiente formato:

```json
{
  "nombre": "Producto en Consignación",
  "descripcion": "Producto recibido en consignación del proveedor",
  "precio": 35000,
  "stock": 20,
  "id_categoria": 1,
  "id_marca": 1,
  "tipo_adquisicion": "consignacion",
  "id_proveedor": 1,
  "consignacion_data": {
    "cantidad_recibida": 20,
    "precio_proveedor": 28000,
    "precio_venta": 35000,
    "fecha_entrega": "2024-01-15",
    "observaciones": "Producto de alta calidad, consignación por 30 días"
  }
}
```

### Campos Requeridos para Consignación:
- `tipo_adquisicion`: Debe ser "consignacion"
- `id_proveedor`: ID del proveedor
- `consignacion_data`: Objeto con los datos específicos de la consignación
  - `cantidad_recibida`: Cantidad de productos recibidos
  - `precio_proveedor`: Precio al que el proveedor vende
  - `precio_venta`: Precio de venta al público
  - `fecha_entrega`: Fecha de entrega del producto

## Estados de Consignación
- **pendiente**: Producto recibido, esperando ventas
- **pagado**: Consignación liquidada con el proveedor
- **devuelto**: Producto devuelto al proveedor

## Validaciones
- Si `tipo_adquisicion` es "consignacion", se requieren `id_proveedor` y `consignacion_data`
- Los precios deben ser valores positivos
- Las cantidades deben ser enteros positivos
- La fecha de entrega debe ser una fecha válida

## Permisos
Todos los endpoints requieren autenticación con rol `admin_total` (ID: 1).

## Ejemplos de Uso

### 1. Crear producto por consignación
```bash
POST /api/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Champú Profesional",
  "precio": 45000,
  "stock": 15,
  "tipo_adquisicion": "consignacion",
  "id_proveedor": 2,
  "consignacion_data": {
    "cantidad_recibida": 15,
    "precio_proveedor": 35000,
    "precio_venta": 45000,
    "fecha_entrega": "2024-01-20",
    "observaciones": "Lote especial para temporada"
  }
}
```

### 2. Actualizar estado de consignación
```bash
PUT /api/consignaciones-proveedor/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad_vendida": 5,
  "estado": "pagado",
  "fecha_pago": "2024-01-25"
}
```

### 3. Listar todas las consignaciones
```bash
GET /api/consignaciones-proveedor
Authorization: Bearer {token}
```

## Notas Importantes
- Al crear un producto por consignación, se crean automáticamente dos registros: uno en `Productos` y otro en `Consignaciones_Proveedor`
- El `stock` del producto refleja la cantidad disponible para venta
- La `cantidad_recibida` en consignaciones es la cantidad total consignada inicialmente
- Se puede actualizar `cantidad_vendida` para llevar control de las ventas
- El sistema permite crear consignaciones manualmente si es necesario, pero el flujo principal es a través de la creación de productos</content>
<parameter name="filePath">c:\Users\sebas\OneDrive\Escritorio\sena\sexto_trimestre\barbersite\backend_barberia\CONSIGNACIONES_README.md