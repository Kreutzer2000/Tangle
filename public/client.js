let fileExtension = ''; // Almacena la extensión del archivo cargado
let originalFileName = '';  // Almacena el nombre original del archivo

// Función para enviar el hash SHA-3 del archivo al servidor
async function sendFileToServer(file) {
  try {
    const reader = new FileReader();
        reader.onload = async function(event) {
            const fileData = event.target.result;
            // Crear una nueva instancia de jsSHA
            var shaObj = new jsSHA("SHA3-512", "ARRAYBUFFER");
            console.log(shaObj);
            
            // Poner los datos del archivo que deseas hashear
            shaObj.update(fileData);
            console.log(fileData);
            // Obtener el hash en formato hexadecimal
            const hash = shaObj.getHash("HEX");
            console.log(hash);
            const formData = new FormData();
            formData.append('hash', hash);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
              const text = await response.text();
              console.error('Server error:', text);
              return;
          }
    
          const data = await response.json();
          console.log('Response from server:', data);
    
          if (data.blockId) {
            document.getElementById('alert-message').textContent = 'Transacción enviada con éxito a la red Tangle. Block ID: ' + data.blockId;
            document.getElementById('alert-container').style.display = 'block';
            setTimeout(() => {
              document.getElementById('alert-container').style.display = 'none';
            }, 5000);  // 5000 milisegundos = 5 segundos
          } else {
              document.getElementById('alert-message').textContent = 'La transacción no se ha enviado correctamente';
              document.getElementById('alert-container').style.display = 'block';
              document.getElementById('alert-message').classList.remove('alert-success');
              document.getElementById('alert-message').classList.add('alert-danger');
          }
        };
        reader.readAsArrayBuffer(file);
  } catch (error) {
      console.error('Error:', error);
  }
}

async function retrieveFile(blockId) {
  try {
      const response = await fetch(`/retrieve/${blockId}`);
      console.log(response);
      if (!response.ok) {
          console.error('Server error:', await response.text());
          return;
      } 
      const responseBody = await response.json();  // Recibe un objeto JSON
      console.log(responseBody);
      const encryptedFileData = responseBody.encryptedFileData;  // Obtén la data encriptada
      console.log(encryptedFileData);

  } catch (error) {
      console.error('Error:', error);
  }
}

// Función llamada cuando se hace clic en el botón de cargar
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  originalFileName = file.name.split('.').slice(0, -1).join('.');  // Guarda el nombre original del archivo sin la extensión
  fileExtension = file.name.split('.').pop();  // Guarda la extensión del archivo cargado

  if (file.size > 25 * 1024) {  // Comprueba si el tamaño del archivo es mayor a 4KB
    Swal.fire({
        icon: 'error',
        title: 'Archivo demasiado grande',
        text: 'Elige un archivo de menos de 25KB.',
    });
    return;
  }

  sendFileToServer(file);
}

// Este código redirige al usuario a la ruta de cierre de sesión cuando hace clic en el botón de cierre de sesión.
document.getElementById('logoutButton').addEventListener('click', (event) => {
  event.preventDefault();  // Previene la navegación predeterminada
  window.location.href = '/logout';  // Redirige al usuario a la ruta de cierre de sesión
});