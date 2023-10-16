const crypto = window.crypto || window.msCrypto;
let fileExtension = ''; // Almacena la extensión del archivo cargado
function arrayBufferToHex(arrayBuffer) {
  return Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

const secretKey = arrayBufferToHex(crypto.getRandomValues(new Uint8Array(32)));

// Función para encriptar el archivo
function encryptFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
      const fileData = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData);
      const encrypted = CryptoJS.AES.encrypt(wordArray, secretKey);
      console.log(secretKey + " = esto es el secretKey de cliente");  // Comprueba que la clave secreta se ha configurado correctamente
      const base64String = encrypted.toString();
      sendFileToServer(file);
  };
  reader.readAsArrayBuffer(file);
}

// Función para enviar el archivo encriptado al servidor
async function sendFileToServer(file) {
  try {
      const formData = new FormData();
      //formData.append('file', new Blob([encryptedFile]), 'file.enc');
      formData.append('file', file);
      formData.append('secretKey', secretKey);

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

  } catch (error) {
      console.error('Error:', error);
  }
}

async function retrieveFile(blockId) {
  try {
      const response = await fetch(`/retrieve/${blockId}`);
      //console.log(response);
      if (!response.ok) {
          console.error('Server error:', await response.text());
          return;
      } 
      const responseBody = await response.json();  // Recibe un objeto JSON
      //console.log(responseBody);
      const encryptedFileDataBase64 = responseBody.encryptedFileData;  // Obtén la cadena base64 encriptada
      
      // Decryption
      const decrypted = CryptoJS.AES.decrypt(encryptedFileDataBase64, secretKey).toString(CryptoJS.enc.Latin1);
        
      // Convertir la cadena desencriptada a un ArrayBuffer
      const decryptedFileData = new Uint8Array(decrypted.split('').map(char => char.charCodeAt(0)));
      
      // Creación del Blob
      const blob = new Blob([decryptedFileData], { type: 'application/octet-stream' });

      //console.log(blob); 
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'downloaded_file.' + fileExtension;  // Proporciona un nombre de archivo; puedes mejorar esto para incluir la extensión correcta
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);  // Limpia la URL temporal

      document.getElementById('blockIdInput').value = '';
  } catch (error) {
      console.error('Error:', error);
  }
}

// Función llamada cuando se hace clic en el botón de cargar
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  fileExtension = file.name.split('.').pop();  // Guarda la extensión del archivo cargado

  if (file.size > 25 * 1024) {  // Comprueba si el tamaño del archivo es mayor a 4KB
    Swal.fire({
        icon: 'error',
        title: 'Archivo demasiado grande',
        text: 'Elige un archivo de menos de 25KB.',
    });
    return;
  }

  //encryptFile(file);
  sendFileToServer(file);
}
