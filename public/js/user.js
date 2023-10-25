console.log('user.js loaded');

document.addEventListener('DOMContentLoaded', (event) => {
    // Solo intenta añadir el event listener si el formulario de registro existe
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }
    
    document.getElementById('login-form').addEventListener('submit', loginUser);
});

async function registerUser(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, apellido, email, usuario, contrasena })
    });
    
    if (response.ok) {
        alert('Registro exitoso');
        // Limpiar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('email').value = '';
        document.getElementById('usuario').value = '';
        document.getElementById('contrasena').value = '';
    } else {
        alert('Error en el registro');
    }
}

async function loginUser(event) {
    console.log(event);
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);
    console.log('Sending login request');  // Añade un log aquí
    try {
        debugger;
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'//,
                //'Authorization': 'Bearer ' + localStorage.getItem('token')  // Añade el token al header
            },
            body: JSON.stringify({ usuario: username, contrasena: password })
        });

        console.log('Received response:', response);  // Añade un log aquí
        const responseData = await response.json();
        console.log('Response data:', responseData);  // Añade un log aquí

        console.log(responseData);  // Esto imprimirá la respuesta en la consola
        if (response.ok) {
            document.cookie = `token=${responseData.token}; path=/`;  // Almacena el token como una cookie
            window.location.href = '/';
        } else {
            alert('Su Contraseña o Usuario son incorrectos');
            // Limpiar los campos del formulario
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    } catch (error) {
        console.error('Error:', error.JSON);  // Esto imprimirá cualquier error en la consola del navegador
    }
}
