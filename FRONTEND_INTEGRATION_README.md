# 🔐 Password Recovery - Frontend Integration

## 📋 Resumen
Tu backend ya está configurado para enviar emails reales con Gmail SMTP. Ahora necesitas integrar estos componentes en tu frontend React.

## 📁 Archivos a Copiar

### 1. Servicio de Autenticación
Copia `auth-service-frontend.ts` a tu proyecto frontend:
```
tu-frontend/
  src/
    services/
      auth.service.ts  ← Copia aquí el contenido de auth-service-frontend.ts
```

### 2. Componentes React
Copia los componentes de `react-components-frontend.tsx` a:
```
tu-frontend/
  src/
    components/
      ForgotPasswordForm.tsx
      ResetPasswordForm.tsx
```

## 🚀 Cómo Usar

### En tu página de "Olvidé mi contraseña":
```tsx
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
```

### En tu página de reset password (cuando el usuario hace clic en el enlace del email):
```tsx
import { ResetPasswordForm } from './components/ResetPasswordForm';

function ResetPasswordPage() {
  // Obtener el token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    return <div>Token inválido</div>;
  }

  return <ResetPasswordForm token={token} />;
}
```

## 🔗 Endpoints del Backend

Asegúrate de que tu frontend apunte a la URL correcta del backend:

```typescript
// En auth.service.ts
const API_BASE_URL = 'http://localhost:3000/api'; // Cambia esto según tu configuración
```

## 📧 Flujo Completo

1. **Usuario solicita recuperación**: Llena el formulario de email
2. **Backend envía email**: Gmail envía el email con el enlace de reset
3. **Usuario recibe email**: Hace clic en el enlace (contiene token)
4. **Usuario cambia contraseña**: Llena el formulario de nueva contraseña
5. **Backend valida y actualiza**: Verifica token y cambia la contraseña

## ⚙️ Configuración del Backend

Tu backend ya está configurado con:
- ✅ Gmail SMTP funcionando
- ✅ Endpoints de recuperación de contraseña
- ✅ Validación de tokens
- ✅ Hashing de contraseñas

## 🧪 Pruebas

1. **Prueba el envío de email**:
   - Ve a `http://localhost:3000/api/auth/forgot-password`
   - Envía un POST con `{"email": "tu-email@gmail.com"}`

2. **Prueba el reset de contraseña**:
   - Usa el token del email para probar el endpoint de reset

## 🔧 Solución de Problemas

### Emails no llegan:
- Verifica que las credenciales de Gmail estén correctas en `.env`
- Asegúrate de que la App Password de Gmail sea correcta
- Revisa los logs del backend para errores de envío

### Token inválido:
- Los tokens expiran en 1 hora (configurable en el código)
- Asegúrate de que el token se pase correctamente desde la URL

### CORS errors:
- Asegúrate de que tu backend permita requests desde tu frontend
- Configura CORS en `app.ts` si es necesario

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del backend
2. Verifica que el frontend esté apuntando a la URL correcta
3. Asegúrate de que todos los archivos se copiaron correctamente

¡Tu sistema de recuperación de contraseña está listo! 🎉