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
            // console.log(shaObj);
            
            // Poner los datos del archivo que deseas hashear
            shaObj.update(fileData);
            // console.log(fileData);
            // Obtener el hash en formato hexadecimal
            const hash = shaObj.getHash("HEX");
            // console.log(hash);
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
          // console.log('Response from server:', data);
    
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
  if (!blockId) {  // Verifica si no hay un Block ID ingresado
      Swal.fire({
          icon: 'warning',
          title: 'Ningún Block ID ingresado',
          text: 'Por favor, ingresa un Block ID para consultar.',
      });
      return;
  }
  try {
      const response = await fetch(`/retrieve/${blockId}`);
      // console.log(response);

      // Llenar la tabla con los datos recuperados
      const dataTableBody = document.getElementById('data-table-body');
      dataTableBody.innerHTML = '';  // Limpiar cualquier dato anterior

      if (!response.ok) {
          console.error('Server error:', await response.text());
          // Si el estado es 404, mostrar un mensaje en la tabla
          if (response.status === 404) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" class="text-center text-warning">El BlockID ${blockId} no está registrado.</td>
            `;
            dataTableBody.appendChild(row);
            // Mostrar el contenedor de datos
            document.getElementById('data-container').style.display = 'block';
            // Obtén la referencia al input donde se ingresa el BlockID
            const blockIdInput = document.getElementById('blockIdInput');
            // Limpia el contenido del input
            blockIdInput.value = '';
        }
        return;
      } 
      const responseBody = await response.json();  // Recibe un objeto JSON
      // console.log(responseBody);
      
      const fechaString = responseBody.dbData.fechaTransaccion;
      if (!fechaString) {
          console.error('Fecha no definida');
          return;
      }

      // Obtén la referencia al input donde se ingresa el BlockID
      const blockIdInput = document.getElementById('blockIdInput');
      // Limpia el contenido del input
      blockIdInput.value = '';

      // Descomponer la cadena de fecha en sus componentes
      const fechaComponents = fechaString.split(/[-T:.]/);
      const year = parseInt(fechaComponents[0], 10);
      const month = parseInt(fechaComponents[1], 10) - 1;  // Los meses en JavaScript son 0-indexados
      const day = parseInt(fechaComponents[2], 10);
      const hour = parseInt(fechaComponents[3], 10);
      const minute = parseInt(fechaComponents[4], 10);
      const second = parseInt(fechaComponents[5], 10);
      const millisecond = fechaComponents[6] ? parseInt(fechaComponents[6], 10) : 0;  // Asumiendo que los milisegundos pueden estar ausentes

      // Crear un objeto Date
      const fechaTransaccion = new Date(year, month, day, hour, minute, second, millisecond);
      // console.log(fechaTransaccion);

      // Formatear la fecha y hora
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const fecha = fechaTransaccion.toLocaleDateString(undefined, options);
      const hora = fechaTransaccion.toLocaleTimeString();
      // console.log(fecha);
      // console.log(hora);

      const row = document.createElement('tr');
      // <td>${responseBody.dbData.id}</td>
      row.innerHTML = `
          
          <td>${responseBody.dbData.usuario}</td>
          <td class="break-word">${responseBody.dbData.blockId}</td>
          <td class="break-word">${responseBody.dbData.hashSHA3}</td>
          <td>Día: ${fecha} Hora: ${hora}</td>
      `;
      dataTableBody.appendChild(row);

      // Mostrar el contenedor de datos
      document.getElementById('data-container').style.display = 'block';

  } catch (error) {
      console.error('Error:', error);
  }
}

// Función llamada cuando se hace clic en el botón de cargar
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {  // Verifica si no hay un archivo seleccionado
      Swal.fire({
          icon: 'warning',
          title: 'Ningún archivo seleccionado',
          text: 'Por favor, selecciona un archivo para subir.',
      });
      return;
  }
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

document.getElementById('toggleButton').addEventListener('click', toggleContainer);

function toggleContainer() {
  const container = document.getElementById('data-container');
  const button = document.getElementById('toggleButton');
  if (container.style.display === 'none') {
      container.style.display = 'block';
      button.textContent = 'Ocultar';
  } else {
      container.style.display = 'none';
      button.textContent = 'Ocultar';
  }
}

// Este código redirige al usuario a la ruta de cierre de sesión cuando hace clic en el botón de cierre de sesión.
document.getElementById('logoutButton').addEventListener('click', (event) => {
  event.preventDefault();  // Previene la navegación predeterminada
  window.location.href = '/logout';  // Redirige al usuario a la ruta de cierre de sesión
});