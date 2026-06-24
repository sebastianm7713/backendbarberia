# Backend BarberSite

## Configuración de Correos

### Para envío de correos reales (Gmail)

1. **Crear una App Password en Gmail:**
   - Ve a https://myaccount.google.com/security
   - Activa la verificación en 2 pasos si no la tienes
   - Ve a "Contraseñas de aplicaciones"
   - Crea una nueva app password (ej: "BarberSite API")
   - Copia la contraseña generada (16 caracteres)

2. **Configurar variables de entorno:**
   Edita el archivo `.env` y completa:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASSWORD=tu_app_password_de_16_caracteres
   SMTP_SECURE=false
   EMAIL_FROM=tu-email@gmail.com
   ```

3. **Probar envío:**
   ```bash
   npm run test-email
   ```

### Para desarrollo (correos de prueba)

Si no configuras SMTP, el sistema usa Ethereal Email (modo prueba) y muestra URLs de preview en la consola.

### Endpoints de recuperación de contraseña

- `POST /api/auth/forgot-password` - Solicitar recuperación
- `GET /api/auth/reset-password/validate?token=...` - Validar token
- `POST /api/auth/reset-password` - Cambiar contraseña

### Variables de entorno requeridas

```env
# Base
PORT=4000
DB_USER=barbersiteapp1
DB_PASSWORD=Barber123!
DB_SERVER=localhost
DB_DATABASE=BARBERSITEAPP
JWT_SECRET=dev_secret_key_123456789

# Frontend
FRONTEND_URL=http://localhost:3006

# SMTP (opcional para desarrollo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu_app_password
SMTP_SECURE=false
EMAIL_FROM=tu-email@gmail.com
```