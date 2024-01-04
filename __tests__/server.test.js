const request = require('supertest');
const app = require('../server'); // Asegúrate de exportar 'app' en tu archivo server.js

describe('Pruebas para el servidor Express', () => {
    // Escribe tus pruebas aquí
});

describe('POST /login', () => {
    it('debería responder con un estado 200 para un inicio de sesión exitoso', async () => {
        const response = await request(app)
            .post('/login')
            .send({ usuario: 'HORNET1', contrasena: '123' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('debería responder con un estado 401 para credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/login')
            .send({ usuario: 'HORNET1', contrasena: '123' });
        expect(response.statusCode).toBe(401);
    });
});

describe('GET /getProfile', () => {
    it('debería responder con un estado 200 y datos del usuario', async () => {
        // Primero, realiza un inicio de sesión para obtener el token
        const loginResponse = await request(app)
            .post('/login')
            .send({ usuario: 'HORNET1', contrasena: '123' });

        // Verifica que el inicio de sesión haya sido exitoso
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        const token = loginResponse.body.token;

        // Luego, usa el token para acceder a la ruta protegida
        const response = await request(app)
            .get('/getProfile')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('nombre');
    });
});
