import { sendMail } from '../src/utils/mailer';

// Script para probar envío de correos
(async () => {
  try {
    console.log('🧪 Probando envío de correo...');

    const result = await sendMail(
      'sebastianm7713@gmail.com',
      'Prueba de envío - BarberSite',
      `
        <h2>Prueba de envío de correo</h2>
        <p>Este es un correo de prueba para verificar que la configuración SMTP funciona correctamente.</p>
        <p>Si recibes este correo, significa que el sistema de envío está funcionando.</p>
        <p>Fecha de envío: ${new Date().toLocaleString()}</p>
      `
    );

    console.log('✅ Correo enviado exitosamente:', result);

    if (result.previewUrl) {
      console.log('🔗 Preview URL (solo para modo prueba):', result.previewUrl);
    }

  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  } finally {
    process.exit(0);
  }
})();