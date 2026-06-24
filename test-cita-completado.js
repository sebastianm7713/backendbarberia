#!/usr/bin/env node

// Script para probar la conversión de cita a venta con productos
// Uso: node test-cita-completado.js <id_cita>

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:4000/api';
const ADMIN_TOKEN = 'tu_token_aqui'; // Reemplaza con un token válido

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function login() {
  console.log('🔐 Iniciando sesión...');
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'juanperez@barber.com',
      password: 'Barber123!'
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Login exitoso');
      return response.data.data.token;
    } else {
      throw new Error('Login fallido: ' + JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    process.exit(1);
  }
}

async function completarCita(idCita, token) {
  console.log(`🔄 Completando cita ${idCita}...`);
  try {
    const response = await makeRequest('PUT', `/citas/${idCita}`, {
      estado: 'completado'
    }, token);

    if (response.status === 200 && response.data.success) {
      console.log('✅ Cita completada exitosamente');
      return response.data;
    } else {
      console.log('❌ Error al completar cita:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Error en completar cita:', error.message);
    return null;
  }
}

async function verificarVenta(idCita, token) {
  console.log(`🔍 Verificando venta de cita ${idCita}...`);
  try {
    // Primero obtener la cita para ver si tiene id_ventas
    const citaResponse = await makeRequest('GET', `/citas/${idCita}`, null, token);
    if (citaResponse.status !== 200 || !citaResponse.data.success) {
      console.log('❌ Error al obtener cita:', citaResponse.data);
      return;
    }

    const cita = citaResponse.data.data.cita;
    console.log('📋 Datos de la cita:', {
      id_cita: cita.id_cita,
      estado: cita.estado,
      id_ventas: cita.id_ventas
    });

    if (!cita.id_ventas) {
      console.log('❌ La cita no tiene venta asociada');
      return;
    }

    // Obtener la venta
    const ventasResponse = await makeRequest('GET', '/ventas', null, token);
    if (ventasResponse.status !== 200 || !ventasResponse.data.success) {
      console.log('❌ Error al obtener ventas:', ventasResponse.data);
      return;
    }

    const venta = ventasResponse.data.data.find(v => v.id_ventas === cita.id_ventas);
    if (!venta) {
      console.log('❌ Venta no encontrada');
      return;
    }

    console.log('💰 Datos de la venta:', {
      id_ventas: venta.id_ventas,
      total: venta.total,
      productos_count: venta.productos?.length || 0,
      servicios_count: venta.servicios?.length || 0
    });

    if (venta.productos && venta.productos.length > 0) {
      console.log('📦 Productos en la venta:');
      venta.productos.forEach(p => {
        console.log(`  - ${p.nombre_producto}: ${p.cantidad} x $${p.precio_unitario} = $${p.subtotal}`);
      });
    } else {
      console.log('❌ No hay productos en la venta');
    }

    if (venta.servicios && venta.servicios.length > 0) {
      console.log('✂️ Servicios en la venta:');
      venta.servicios.forEach(s => {
        console.log(`  - ${s.nombre_servicio}: ${s.cantidad} x $${s.precio_unitario} = $${s.subtotal}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al verificar venta:', error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log('Uso: node test-cita-completado.js <id_cita>');
    console.log('Ejemplo: node test-cita-completado.js 10');
    process.exit(1);
  }

  const idCita = parseInt(args[0]);
  if (isNaN(idCita)) {
    console.log('❌ El ID de cita debe ser un número');
    process.exit(1);
  }

  console.log('🚀 Iniciando prueba de conversión cita → venta');
  console.log('=' .repeat(50));

  const token = await login();
  console.log('');

  const resultado = await completarCita(idCita, token);
  console.log('');

  if (resultado) {
    await verificarVenta(idCita, token);
  }

  console.log('');
  console.log('🏁 Prueba completada');
}

main().catch(console.error);