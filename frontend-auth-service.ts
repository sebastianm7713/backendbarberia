// ===== AUTH SERVICE PARA FRONTEND =====
// Archivo: services/auth.service.ts (o donde tengas los servicios)

const API_BASE_URL = 'http://localhost:4000/api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  data: {
    message: string;
    emailSent: boolean;
    resetUrl?: string;
  };
}

export interface ValidateTokenResponse {
  success: boolean;
  data: {
    valid: boolean;
    expiresAt: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface AuthError {
  success: false;
  message: string;
}

// ===== FUNCIONES PARA LLAMAR LOS ENDPOINTS =====

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse | AuthError> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Error al solicitar recuperación de contraseña',
      };
    }

    return result;
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return {
      success: false,
      message: 'Error de conexión. Inténtalo de nuevo.',
    };
  }
};

export const validateResetToken = async (token: string): Promise<ValidateTokenResponse | AuthError> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/validate?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Token inválido',
      };
    }

    return result;
  } catch (error) {
    console.error('Error en validateResetToken:', error);
    return {
      success: false,
      message: 'Error de conexión. Inténtalo de nuevo.',
    };
  }
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse | AuthError> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Error al restablecer contraseña',
      };
    }

    return result;
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return {
      success: false,
      message: 'Error de conexión. Inténtalo de nuevo.',
    };
  }
};

// ===== EJEMPLO DE USO EN COMPONENTE REACT =====

/*
// En tu componente RecoverPasswordForm.tsx:

import { forgotPassword, validateResetToken, resetPassword } from '../services/auth.service';

const handleForgotPassword = async (email: string) => {
  const result = await forgotPassword({ email });

  if (result.success) {
    console.log('Reset password success:', result.data.emailSent);
    // Mostrar mensaje de éxito
    // Si emailSent es false, mostrar result.data.resetUrl para desarrollo
  } else {
    console.error('Error:', result.message);
    // Mostrar error
  }
};

const handleValidateToken = async (token: string) => {
  const result = await validateResetToken(token);

  if (result.success && result.data.valid) {
    // Token válido, mostrar formulario de nueva contraseña
  } else {
    // Token inválido, mostrar error
  }
};

const handleResetPassword = async (token: string, newPassword: string) => {
  const result = await resetPassword({ token, password: newPassword });

  if (result.success) {
    // Contraseña cambiada exitosamente
    // Redirigir a login
  } else {
    // Mostrar error
  }
};
*/