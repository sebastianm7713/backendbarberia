import nodemailer from 'nodemailer';
import { env } from '../config/env';

const useTransport = Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD);

let transporter: nodemailer.Transporter | null = null;
let testAccountInfo: nodemailer.TestAccount | null = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (useTransport) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
    return transporter;
  }

  testAccountInfo = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
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

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  console.log('[mailer] Attempting to send email:', {
    to,
    subject,
    from: env.EMAIL_FROM,
    useTransport,
    smtpHost: env.SMTP_HOST,
    smtpPort: env.SMTP_PORT
  });

  const currentTransporter = await getTransporter();
  const result = await currentTransporter.sendMail(mailOptions);
  const previewUrl = nodemailer.getTestMessageUrl(result) || undefined;

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

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <p>Hola,</p>
    <p>Haz solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
    <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  `;

  const info = await sendMail(email, 'Restablecer contraseña', html);
  return {
    smtpConfigured: useTransport,
    resetUrl,
    previewUrl: info.previewUrl,
    info,
  };
};
