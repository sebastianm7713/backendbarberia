"use strict";
// ===== COPIA ESTE ARCHIVO AL FRONTEND =====
// Archivo destino: src/services/auth.service.ts (o donde tengas los servicios)
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
const API_BASE_URL = 'http://localhost:4000/api';
// Funciones para consumir el backend
const forgotPassword = async (data) => {
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
    }
    catch (error) {
        console.error('Error en forgotPassword:', error);
        return {
            success: false,
            message: 'Error de conexión. Inténtalo de nuevo.',
        };
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (data) => {
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
    }
    catch (error) {
        console.error('Error en resetPassword:', error);
        return {
            success: false,
            message: 'Error de conexión. Inténtalo de nuevo.',
        };
    }
};
exports.resetPassword = resetPassword;
// ===== EJEMPLO DE USO =====
/*
// En tu componente de recuperación de contraseña:

import { forgotPassword, resetPassword } from '../services/auth.service';

const handleForgotPassword = async (email: string) => {
  const result = await forgotPassword({ email });

  if (result.success) {
    console.log('Correo enviado:', result.data.emailSent);
    // Mostrar mensaje de éxito
  } else {
    console.error('Error:', result.message);
    // Mostrar error
  }
};

const handleResetPassword = async (token: string, newPassword: string) => {
  const result = await resetPassword({ token, password: newPassword });

  if (result.success) {
    console.log('Contraseña cambiada');
    // Redirigir a login
  } else {
    console.error('Error:', result.message);
    // Mostrar error
  }
};
*/ 
