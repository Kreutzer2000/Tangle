# 🌐 Documentación del servidor Express

## 📌 Introducción

Este documento describe detalladamente el funcionamiento y las rutas del servidor Express utilizado en el proyecto.

---

## 📦 Importaciones y Dependencias

### 1. **Express**
- **Descripción**: Framework web para Node.js.
- **Uso**: Crear y manejar el servidor web.

### 2. **Cookie-Parser**
- **Descripción**: Middleware para analizar cookies.
- **Uso**: Leer y establecer cookies en el navegador del cliente.

### 3. **MSSQL/MSNodeSQLv8**
- **Descripción**: Driver para conectar con SQL Server.
- **Uso**: Conectar y realizar operaciones con la base de datos SQL Server.

### 4. **@iota/sdk**
- **Descripción**: SDK oficial para trabajar con la red IOTA.
- **Uso**: Realizar operaciones relacionadas con la red IOTA, como enviar y recibir transacciones.

### 5. **Multer**
- **Descripción**: Middleware para manejar `multipart/form-data`, utilizado para subir archivos.
- **Uso**: Procesar y guardar archivos subidos por el cliente.

### 6. **fs.promises**
- **Descripción**: Módulo de sistema de archivos con funciones que retornan promesas.
- **Uso**: Leer y eliminar archivos de forma asíncrona.

### 7. **js-sha3**
- **Descripción**: Biblioteca para generar hashes SHA-3.
- **Uso**: Crear hashes SHA-3 de los datos.

### 8. **jsonwebtoken**
- **Descripción**: Biblioteca para trabajar con JSON Web Tokens.
- **Uso**: Generar y verificar tokens JWT para autenticación.

### 9. **express-jwt**
- **Descripción**: Middleware para validar tokens JWT en aplicaciones Express.
- **Uso**: Validar tokens JWT en las rutas protegidas.

### 10. **crypto**
- **Descripción**: Módulo nativo de Node.js para trabajar con criptografía.
- **Uso**: Hashing de contraseñas.

### 11. **@azure/storage-blob**
- **Descripción**: SDK de cliente para trabajar con Azure Blob Storage.
- **Uso**: Subir y gestionar archivos en Azure Blob Storage.

---

## 🛠 Configuración Inicial

### Azure Blob Storage
Se define la cadena de conexión para Azure Blob Storage, que se utiliza para almacenar archivos en la nube.

### Cliente IOTA
Se inicializa el cliente de IOTA para interactuar con la red Tangle.

---

## 🗄 Configuración de la Base de Datos

Se proporcionan detalles sobre la configuración de conexión a la base de datos SQL Server. Hay dos configuraciones:
1. **Local**: Para una instancia local de SQL Server.
2. **Azure**: Para una instancia de SQL Server alojada en Azure.

---

## 🔐 Middleware de Autenticación

### Custom JWT Middleware
Middleware personalizado para manejar la autenticación con JWT. Este middleware:
- Verifica la validez del token.
- Redirige al usuario a la página de inicio de sesión si el token no es válido o ha expirado.

---

## 🌐 Rutas del Servidor

### 📂 Rutas Estáticas
Se sirven archivos estáticos desde el directorio `public`, como HTML, CSS y JS.

### 🔒 Rutas de Autenticación
- **Login**: Sirve la página de inicio de sesión y verifica las credenciales del usuario.
- **Logout**: Cierra la sesión del usuario y elimina la cookie del token.

### 📡 Rutas de API
- **GetProfile**: Obtiene información del perfil del usuario autenticado.
- **UpdateProfile**: Actualiza la información del perfil del usuario autenticado.
- **UploadToAzure**: Permite subir archivos a Azure Blob Storage.
- **Upload**: Recibe y procesa el hash SHA-3 y la URL del archivo cifrado, luego envía el hash a la red Tangle y almacena los detalles en la base de datos.
- **Retrieve**: Recupera la información de un bloque específico de la red Tangle basado en el ID del bloque.
- **RetrieveByPhone**: Recupera la información de un bloque específico de la red Tangle basado en el número de teléfono y el ID del usuario.
- **Users**: Obtiene una lista de todos los usuarios registrados.

---

## 🚀 Inicio del Servidor

El servidor se inicia en el puerto 3000 o en el puerto definido en las variables de entorno.

---

## 📝 Notas Finales

Este servidor es esencial para el funcionamiento del proyecto, maneja la autenticación, la interacción con la base de datos, y la comunicación con servicios externos como Azure y IOTA.

---

