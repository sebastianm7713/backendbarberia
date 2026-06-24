"use strict";
// ===== RUTAS PARA EL FRONTEND =====
// Archivo: routes/password-recovery.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ENDPOINTS = void 0;
// Endpoints del backend que debe consumir el frontend:
exports.AUTH_ENDPOINTS = {
    // Solicitar recuperación de contraseña
    FORGOT_PASSWORD: 'POST /api/auth/forgot-password',
    // Validar token de recuperación (opcional, para mejor UX)
    VALIDATE_TOKEN: 'GET /api/auth/reset-password/validate',
    // Restablecer contraseña
    RESET_PASSWORD: 'POST /api/auth/reset-password',
};
path;
"/forgot-password";
element = {} < RecoverPasswordForm /  > ;
/>
    < Route;
path = "/reset-password";
element = {}
    < ResetPasswordForm;
token = { new: URLSearchParams(window.location.search).get('token') || '' };
onSuccess = {}();
{
    // Redirigir a login o mostrar mensaje de éxito
    window.location.href = '/login?message=password-reset-success';
}
onError = {}(message);
{
    // Mostrar error y redirigir
    alert(message);
    window.location.href = '/forgot-password';
}
/>;
/>
    < /Routes>
    < /BrowserRouter>;
;
    * /;
// ===== EJEMPLO DE FLUJO COMPLETO =====
/*
1. Usuario hace clic en "Olvidé mi contraseña" -> va a /forgot-password
2. Llena email y envía -> llama forgotPassword(email)
3. Si éxito:
   - Si emailSent=true: mostrar "Revisa tu correo"
   - Si emailSent=false: mostrar resetUrl (desarrollo)
4. Usuario recibe email con link: http://localhost:3006/reset-password?token=abc123
5. Al hacer clic, va a /reset-password con token en query params
6. Componente valida token automáticamente
7. Si válido, muestra formulario de nueva contraseña
8. Usuario llena nueva contraseña -> llama resetPassword(token, password)
9. Si éxito, redirige a login con mensaje de éxito
*/ 
