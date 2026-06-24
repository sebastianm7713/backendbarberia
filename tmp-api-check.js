const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: 'juanperez@barber.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('login status', loginRes.status);
    const token = loginData.data?.token;
    if (!token) return;
    const updateRes = await fetch('http://localhost:4000/api/configuracion-landing/1', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ businessName: 'Prueba Update 2', id: 1 })
    });
    const updateData = await updateRes.json();
    console.log('update status', updateRes.status, updateData);
  } catch (err) {
    console.error('ERR', err);
  }
})();
