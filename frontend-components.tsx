// ===== EJEMPLO DE COMPONENTE REACT =====
// Archivo: components/RecoverPasswordForm.tsx

import React, { useState } from 'react';
import { forgotPassword, validateResetToken, resetPassword } from '../services/auth.service';

interface RecoverPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await forgotPassword({ email });

      if (result.success) {
        console.log('Reset password success:', result.data.emailSent);

        if (result.data.emailSent) {
          setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        } else {
          // Modo desarrollo - mostrar URL de reset
          setMessage(`Enlace de recuperación (desarrollo): ${result.data.resetUrl}`);
        }

        onSuccess?.();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-password-form">
      <h2>Recuperar Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        {message && (
          <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>

          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ===== COMPONENTE PARA RESET PASSWORD =====
// Archivo: components/ResetPasswordForm.tsx

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
  onError
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validar token al montar el componente
  React.useEffect(() => {
    const validateToken = async () => {
      const result = await validateResetToken(token);
      if (!result.success || !result.data.valid) {
        onError?.(result.message || 'Token inválido o expirado');
      }
    };

    validateToken();
  }, [token, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const result = await resetPassword({ token, password });

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      <h2>Restablecer Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};