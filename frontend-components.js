"use strict";
// ===== EJEMPLO DE COMPONENTE REACT =====
// Archivo: components/RecoverPasswordForm.tsx
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
exports.ResetPasswordForm = exports.RecoverPasswordForm = void 0;
const react_1 = __importStar(require("react"));
const auth_service_1 = require("../services/auth.service");
const RecoverPasswordForm = ({ onSuccess, onCancel }) => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const result = await (0, auth_service_1.forgotPassword)({ email });
            if (result.success) {
                console.log('Reset password success:', result.data.emailSent);
                if (result.data.emailSent) {
                    setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
                }
                else {
                    // Modo desarrollo - mostrar URL de reset
                    setMessage(`Enlace de recuperación (desarrollo): ${result.data.resetUrl}`);
                }
                onSuccess?.();
            }
            else {
                setError(result.message);
            }
        }
        catch (err) {
            setError('Error inesperado. Inténtalo de nuevo.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="recover-password-form">
      <h2>Recuperar Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com"/>
        </div>

        {error && (<div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>)}

        {message && (<div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>
            {message}
          </div>)}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>

          {onCancel && (<button type="button" onClick={onCancel}>
              Cancelar
            </button>)}
        </div>
      </form>
    </div>);
};
exports.RecoverPasswordForm = RecoverPasswordForm;
const ResetPasswordForm = ({ token, onSuccess, onError }) => {
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    // Validar token al montar el componente
    react_1.default.useEffect(() => {
        const validateToken = async () => {
            const result = await (0, auth_service_1.validateResetToken)(token);
            if (!result.success || !result.data.valid) {
                onError?.(result.message || 'Token inválido o expirado');
            }
        };
        validateToken();
    }, [token, onError]);
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
        try {
            const result = await (0, auth_service_1.resetPassword)({ token, password });
            if (result.success) {
                onSuccess?.();
            }
            else {
                setError(result.message);
            }
        }
        catch (err) {
            setError('Error inesperado. Inténtalo de nuevo.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="reset-password-form">
      <h2>Restablecer Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}/>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}/>
        </div>

        {error && (<div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>)}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>);
};
exports.ResetPasswordForm = ResetPasswordForm;
