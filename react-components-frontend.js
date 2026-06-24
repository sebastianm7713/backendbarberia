"use strict";
// ===== COMPONENTE PARA FRONTEND =====
// Copia esto a tu proyecto frontend: src/components/ForgotPasswordForm.tsx
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordForm = exports.ForgotPasswordForm = void 0;
const react_1 = __importStar(require("react"));
const auth_service_1 = require("../services/auth.service");
const ForgotPasswordForm = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        const result = await (0, auth_service_1.forgotPassword)({ email });
        if (result.success) {
            if (result.data.emailSent) {
                setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
            }
            else {
                // Modo desarrollo
                setMessage(`Enlace de recuperación: ${result.data.resetUrl}`);
            }
        }
        else {
            setError(result.message);
        }
        setLoading(false);
    };
    return (<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Recuperar Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Correo electrónico:
          </label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
        }} placeholder="tu@email.com"/>
        </div>

        {error && (<div style={{
                color: 'red',
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid red',
                borderRadius: '4px',
                backgroundColor: '#ffe6e6'
            }}>
            {error}
          </div>)}

        {message && (<div style={{
                color: 'green',
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid green',
                borderRadius: '4px',
                backgroundColor: '#e6ffe6'
            }}>
            {message}
          </div>)}

        <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
    </div>);
};
exports.ForgotPasswordForm = ForgotPasswordForm;
const auth_service_2 = require("../services/auth.service");
const ResetPasswordForm = ({ token }) => {
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [success, setSuccess] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setLoading(true);
        setError('');
        const result = await (0, auth_service_2.resetPassword)({ token, password });
        if (result.success) {
            setSuccess(true);
            // Aquí puedes redirigir al login
            setTimeout(() => {
                window.location.href = '/login?message=password-changed';
            }, 2000);
        }
        else {
            setError(result.message);
        }
        setLoading(false);
    };
    if (success) {
        return (<div style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{ color: 'green' }}>¡Contraseña cambiada exitosamente!</h2>
        <p>Serás redirigido al login en unos segundos...</p>
      </div>);
    }
    return (<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Restablecer Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Nueva contraseña:
          </label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
        }}/>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
            Confirmar contraseña:
          </label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
        }}/>
        </div>

        {error && (<div style={{
                color: 'red',
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid red',
                borderRadius: '4px',
                backgroundColor: '#ffe6e6'
            }}>
            {error}
          </div>)}

        <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>);
};
exports.ResetPasswordForm = ResetPasswordForm;
