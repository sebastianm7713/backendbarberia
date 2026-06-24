# 🔐 Recuperación de Contraseña - Frontend Integration

## ✅ Backend Configurado

El backend ya está completamente configurado para envío de correos reales con Gmail SMTP. Los endpoints funcionan correctamente:

- ✅ `POST /api/auth/forgot-password` - Solicitar recuperación
- ✅ `GET /api/auth/reset-password/validate` - Validar token
- ✅ `POST /api/auth/reset-password` - Cambiar contraseña

## 📁 Archivos que necesitas copiar al frontend

### 1. Servicio de Auth
Copia el contenido de `frontend-auth-service.ts` a tu archivo de servicios de autenticación.

### 2. Componentes de React
Copia los componentes de `frontend-components.tsx` a tus archivos de componentes.

### 3. Configuración de Rutas
Usa las rutas de `frontend-routes.ts` como referencia para configurar React Router.

## 🚀 Implementación Paso a Paso

### Paso 1: Configurar Servicios
```typescript
// En tu archivo de servicios (ej: services/auth.ts)
import { forgotPassword, validateResetToken, resetPassword } from './auth-service';
```

### Paso 2: Crear Componentes

#### RecoverPasswordForm
```typescript
// Componente para solicitar recuperación
const RecoverPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword({ email });

    if (result.success) {
      if (result.data.emailSent) {
        alert('Revisa tu correo electrónico');
      } else {
        // Desarrollo: mostrar URL
        alert(`URL de desarrollo: ${result.data.resetUrl}`);
      }
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Recuperar contraseña'}
      </button>
    </form>
  );
};
```

#### ResetPasswordForm
```typescript
// Componente para cambiar contraseña
const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener token de la URL
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    // Validar token al cargar
    if (token) {
      validateResetToken(token).then(result => {
        if (!result.success || !result.data.valid) {
          alert('Token inválido o expirado');
          // Redirigir a forgot-password
        }
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const result = await resetPassword({ token, password });

    if (result.success) {
      alert('Contraseña cambiada exitosamente');
      // Redirigir a login
      window.location.href = '/login';
    } else {
      alert(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar contraseña"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Cambiando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
};
```

### Paso 3: Configurar Rutas
```typescript
// En tu router (ej: App.tsx)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/forgot-password" element={<RecoverPasswordForm />} />
  <Route path="/reset-password" element={<ResetPasswordForm />} />
  {/* Otras rutas */}
</Routes>
```

## 🔗 Flujo Completo

1. **Usuario olvida contraseña** → Clic en "Olvidé mi contraseña"
2. **Va a `/forgot-password`** → Llena email y envía
3. **Backend envía email** → Con link `http://localhost:3006/reset-password?token=abc123`
4. **Usuario recibe email** → Hace clic en el link
5. **Va a `/reset-password`** → Con token en URL
6. **Valida token automáticamente** → Si válido, muestra formulario
7. **Usuario cambia contraseña** → Envía nueva contraseña
8. **Backend actualiza** → Redirige a login con mensaje de éxito

## 🧪 Probar Funcionamiento

1. Ve a `http://localhost:3006/forgot-password`
2. Ingresa `sebastianm7713@gmail.com`
3. Envía el formulario
4. Revisa tu correo Gmail
5. Haz clic en el link recibido
6. Cambia la contraseña
7. Verifica que puedas hacer login con la nueva contraseña

## 📧 Configuración de Email

Ya está configurado en el backend:
- ✅ Gmail SMTP configurado
- ✅ App Password configurada
- ✅ Envío de correos funcionando
- ✅ URLs de reset correctas

¡El sistema está listo para usar! 🎉