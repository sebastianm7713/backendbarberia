# Guía de Prueba de API - BarbersiteApp

## 🚀 Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

---

## 🔐 Autenticación

Todos los endpoints (excepto login y registro) requieren un token JWT en el header:

```
Authorization: Bearer <tu_token>
```

### 1. Obtener Token de Acceso

**Endpoint:**
```
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "juanperez@barber.com",
  "password": "admin123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": 1,
    "nombre": "Juan Perez",
    "email": "juanperez@barber.com",
    "id_rol": 1
  }
}
```

**Copiar el token** y usarlo en todos los siguientes requests.

### 2. Registro de usuario

**Endpoint:**
```
POST /api/auth/register
Content-Type: application/json
```

**Body (requerido):**
```json
{
  "nombre": "Administrador Test",
  "email": "admin@test.com",
  "password": "AdminTest123!",
  "id_rol": 1,
  "id_tipo_documento": 1,
  "numero_documento": "1234567890"
}
```

> Nota: id_tipo_documento y numero_documento son obligatorios según el esquema de la base de datos.

---

## 📋 Endpoints por Módulo

### 🎭 Roles (Admin Only)

**GET** `/api/roles` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/roles
```

**GET** `/api/roles/:id` - Obtener por ID
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/roles/1
```

**POST** `/api/roles` - Crear
```bash
curl -X POST http://localhost:4000/api/roles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Supervisor",
    "descripcion": "Rol de supervisión"
  }'
```

**PUT** `/api/roles/:id` - Actualizar
```bash
curl -X PUT http://localhost:4000/api/roles/4 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Supervisor Actualizado"
  }'
```

**DELETE** `/api/roles/:id` - Eliminar
```bash
curl -X DELETE http://localhost:4000/api/roles/4 \
  -H "Authorization: Bearer TOKEN"
```

---

### 👥 Usuarios

**GET** `/api/usuarios` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/usuarios
```

**GET** `/api/usuarios/:id` - Obtener por ID
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/usuarios/1
```

**POST** `/api/usuarios` - Crear
```bash
curl -X POST http://localhost:4000/api/usuarios \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Mendez",
    "email": "carlos@barber.com",
    "telefono": "3105551234",
    "password": "Carlos123!",
    "id_rol": 2
  }'
```

**PUT** `/api/usuarios/:id` - Actualizar
```bash
curl -X PUT http://localhost:4000/api/usuarios/5 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Actualizado",
    "telefono": "3105559999"
  }'
```

**DELETE** `/api/usuarios/:id` - Eliminar
```bash
curl -X DELETE http://localhost:4000/api/usuarios/5 \
  -H "Authorization: Bearer TOKEN"
```

---

### 👔 Clientes

**GET** `/api/clientes` - Obtener todos (Admin/Barbero)
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/clientes
```

**GET** `/api/clientes/:id` - Obtener por ID
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/clientes/3
```

---

### ✂️ Barberos

**GET** `/api/barberos` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/barberos
```

**POST** `/api/barberos` - Crear barbero
```bash
curl -X POST http://localhost:4000/api/barberos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 2,
    "tipo_contrato": "porcentaje",
    "porcentaje_ganancia": 50,
    "hora_inicio": "08:00",
    "hora_fin": "18:00"
  }'
```

---

### 🏷️ Marcas

**GET** `/api/marcas` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/marcas
```

**POST** `/api/marcas` - Crear marca
```bash
curl -X POST http://localhost:4000/api/marcas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Brut"
  }'
```

**PUT** `/api/marcas/:id` - Actualizar
```bash
curl -X PUT http://localhost:4000/api/marcas/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "American Crew Premium"
  }'
```

**DELETE** `/api/marcas/:id` - Eliminar
```bash
curl -X DELETE http://localhost:4000/api/marcas/1 \
  -H "Authorization: Bearer TOKEN"
```

---

### 📦 Categorías de Productos

**GET** `/api/categorias-productos` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/categorias-productos
```

**POST** `/api/categorias-productos` - Crear
```bash
curl -X POST http://localhost:4000/api/categorias-productos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Accesorios",
    "descripcion": "Accesorios para barberia"
  }'
```

---

### 🛍️ Productos

**GET** `/api/productos` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/productos
```

**POST** `/api/productos` - Crear
```bash
curl -X POST http://localhost:4000/api/productos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pomada Fuerte",
    "descripcion": "Pomada con fijación fuerte",
    "id_categoria": 1,
    "id_marca": 1,
    "precio": 45000,
    "stock": 50
  }'
```

---

### ✂️ Servicios

**GET** `/api/servicios` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/servicios
```

**POST** `/api/servicios` - Crear
```bash
curl -X POST http://localhost:4000/api/servicios \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Corte Premium",
    "descripcion": "Corte con técnica premium",
    "duracion": 45,
    "precio": 50000,
    "porcentaje_barbero": 30,
    "img": "https://example.com/image.jpg"
  }'
```

---

### 🛒 Compras

**GET** `/api/compras` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/compras
```

**POST** `/api/compras` - Crear compra con detalles
```bash
curl -X POST http://localhost:4000/api/compras \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_proveedor": 1,
    "detalles": [
      {
        "id_producto": 1,
        "cantidad": 10,
        "costo_unitario": 35000
      },
      {
        "id_producto": 2,
        "cantidad": 5,
        "costo_unitario": 40000
      }
    ]
  }'
```

---

### 💰 Ventas

**GET** `/api/ventas` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/ventas
```

**POST** `/api/ventas` - Crear venta
```bash
curl -X POST http://localhost:4000/api/ventas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 3,
    "id_barbero": 2,
    "tipo": "mixta",
    "total": 95000
  }'
```

---

### 📅 Citas

**GET** `/api/citas` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/citas
```

**POST** `/api/citas` - Crear cita
```bash
curl -X POST http://localhost:4000/api/citas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 3,
    "id_barbero": 2,
    "id_servicio": 1,
    "fecha_cita": "2024-12-20",
    "hora_cita": "14:00",
    "estado": "confirmada"
  }'
```

---

### 🎫 Permisos

**GET** `/api/permisos` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/permisos
```

**POST** `/api/permisos` - Crear permiso
```bash
curl -X POST http://localhost:4000/api/permisos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "EXPORTAR_REPORTES",
    "descripcion": "Permiso para exportar reportes"
  }'
```

---

### 📊 Tipos de Documento

**GET** `/api/tipos-documento` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/tipos-documento
```

**POST** `/api/tipos-documento` - Crear
```bash
curl -X POST http://localhost:4000/api/tipos-documento \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pasaporte",
    "codigo": "PP"
  }'
```

---

### 🪑 Alquiler Silla

**GET** `/api/alquiler-silla` - Obtener todos
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/alquiler-silla
```

**POST** `/api/alquiler-silla` - Crear
```bash
curl -X POST http://localhost:4000/api/alquiler-silla \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_barbero": 2,
    "tipo_periodo": "mensual",
    "valor": 500000,
    "fecha_inicio": "2024-12-01",
    "fecha_fin": "2024-12-31"
  }'
```

---

### 📋 Disponibilidad Excepción

**GET** `/api/disponibilidad-excepcion` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/disponibilidad-excepcion
```

**POST** `/api/disponibilidad-excepcion` - Crear
```bash
curl -X POST http://localhost:4000/api/disponibilidad-excepcion \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_barbero": 2,
    "fecha_excepcion": "2024-12-25",
    "tipo_excepcion": "festivo",
    "descripcion": "Día navidad"
  }'
```

---

### 🔄 Devoluciones Proveedor

**GET** `/api/devoluciones-proveedor` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/devoluciones-proveedor
```

**POST** `/api/devoluciones-proveedor` - Crear
```bash
curl -X POST http://localhost:4000/api/devoluciones-proveedor \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_compra": 1,
    "id_producto": 1,
    "cantidad": 2,
    "razón": "Producto dañado",
    "estado": "pendiente"
  }'
```

---

### 📮 Consignaciones Proveedor

**GET** `/api/consignaciones-proveedor` - Obtener todas
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/consignaciones-proveedor
```

**POST** `/api/consignaciones-proveedor` - Crear
```bash
curl -X POST http://localhost:4000/api/consignaciones-proveedor \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_proveedor": 1,
    "id_producto": 1,
    "cantidad": 20,
    "precio_unitario": 25000,
    "estado": "activa"
  }'
```

---

## 🧪 Flujo de Prueba Recomendado

1. **Autenticarse** - POST `/api/auth/login`
2. **Consultar Roles** - GET `/api/roles`
3. **Crear usuario barbero** - POST `/api/usuarios`
4. **Crear barbero** - POST `/api/barberos`
5. **Crear categoría** - POST `/api/categorias-productos`
6. **Crear marca** - POST `/api/marcas`
7. **Crear producto** - POST `/api/productos`
8. **Crear servicio** - POST `/api/servicios`
9. **Crear compra** - POST `/api/compras`
10. **Crear venta** - POST `/api/ventas`
11. **Crear cita** - POST `/api/citas`

---

## 📥 Importar en Postman

1. Abre Postman
2. Click en **Import** → **Paste Raw Text**
3. Copia el contenido de `POSTMAN_COLLECTION.json`
4. Click en **Import**
5. Reemplaza `TOKEN_AQUI` con tu token de autenticación

---

## ⚠️ Códigos de Error

| Código | Significado |
|--------|--------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error en validación |
| 401 | Unauthorized - Token faltante o inválido |
| 403 | Forbidden - No tienes permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error interno del servidor |

---

## 💡 Tips

- Todos los IDs se generan automáticamente
- Las contraseñas deben tener al menos 8 caracteres
- El email debe ser único
- Los tokens expiran en 24 horas
- Las fechas deben estar en formato `YYYY-MM-DD`
- Las horas deben estar en formato `HH:MM` (24 horas)

---

**¡A probar la API! 🎉**
