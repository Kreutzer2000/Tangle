// Función para encriptar el archivo
function encryptFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
      const fileData = event.target.result;
      const wordArray = CryptoJS.lib.WordArray.create(fileData);
      const encrypted = CryptoJS.AES.encrypt(wordArray, 'secret key');
      const base64String = encrypted.toString();
      sendFileToServer(base64String);
  };
  reader.readAsArrayBuffer(file);
}

// Función para enviar el archivo encriptado al servidor
async function sendFileToServer(encryptedFile) {
  try {
      const formData = new FormData();
      formData.append('file', new Blob([encryptedFile]), 'file.enc');

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

// Función llamada cuando se hace clic en el botón de cargar
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  encryptFile(file);
}
