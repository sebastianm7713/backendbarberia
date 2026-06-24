"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const useTransport = Boolean(env_1.env.SMTP_HOST && env_1.env.SMTP_PORT && env_1.env.SMTP_USER && env_1.env.SMTP_PASSWORD);
let transporter = null;
let testAccountInfo = null;
const getTransporter = async () => {
    if (transporter)
        return transporter;
    if (useTransport) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.env.SMTP_HOST,
            port: Number(env_1.env.SMTP_PORT) || 587,
            secure: env_1.env.SMTP_SECURE,
            auth: {
                user: env_1.env.SMTP_USER,
                pass: env_1.env.SMTP_PASSWORD,
            },
        });
        return transporter;
    }
    testAccountInfo = await nodemailer_1.default.createTestAccount();
    transporter = nodemailer_1.default.createTransport({
        host: testAccountInfo.smtp.host,
        port: testAccountInfo.smtp.port,
        secure: testAccountInfo.smtp.secure,
        auth: {
            user: testAccountInfo.user,
            pass: testAccountInfo.pass,
        },
    });
    return transporter;
};
const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: env_1.env.EMAIL_FROM,
        to,
        subject,
        html,
    };
    console.log('[mailer] Attempting to send email:', {
        to,
        subject,
        from: env_1.env.EMAIL_FROM,
        useTransport,
        smtpHost: env_1.env.SMTP_HOST,
        smtpPort: env_1.env.SMTP_PORT
    });
    const currentTransporter = await getTransporter();
    const result = await currentTransporter.sendMail(mailOptions);
    const previewUrl = nodemailer_1.default.getTestMessageUrl(result) || undefined;
    console.log('[mailer] Email sent successfully:', {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        previewUrl,
        smtpConfigured: useTransport
    });
    return {
        accepted: result.accepted,
        messageId: result.messageId,
        previewUrl,
        envelope: result.envelope,
        response: result.response,
    };
};
exports.sendMail = sendMail;
const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${env_1.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
    <p>Hola,</p>
    <p>Haz solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
    <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  `;
    const info = await (0, exports.sendMail)(email, 'Restablecer contraseña', html);
    return {
        smtpConfigured: useTransport,
        resetUrl,
        previewUrl: info.previewUrl,
        info,
    };
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
