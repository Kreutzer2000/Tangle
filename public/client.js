let fileExtension = ''; // Almacena la extensión del archivo cargado
let originalFileName = '';  // Almacena el nombre original del archivo

const fileIconsMap = {
  'txt': 'fa-file-alt',
  'xlsx': 'fa-file-excel',
  'xls': 'fa-file-excel',
  'doc': 'fa-file-word',
  'docx': 'fa-file-word',
  'pdf': 'fa-file-pdf',
  'ppt': 'fa-file-powerpoint',
  'pptx': 'fa-file-powerpoint',
  'jpg': 'fa-file-image',
  'jpeg': 'fa-file-image',
  'png': 'fa-file-image',
  'gif': 'fa-file-image',
  'zip': 'fa-file-archive',
  'rar': 'fa-file-archive',
  // ... puedes agregar más extensiones aquí
};

// Función para enviar el hash SHA-3 del archivo al servidor
async function sendFileToServer(file) {
  // console.log(file);
  try {
    const formDataStorage = new FormData();
    formDataStorage.append('file', file);
    const responseStorage = await fetch('/uploadToAzure', {
        method: 'POST',
        body: formDataStorage,
    });
    const data = await responseStorage.json();
    // console.log(data);
    const azureBlobUrl = data.azureBlobUrl;

    // console.log(azureBlobUrl);
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
        formData.append('azureBlobUrl', azureBlobUrl); 
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        })
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
        startTimer(30);
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

function startTimer(duration) {
  let timer = duration;
  const timerElement = document.getElementById('timer');
  timerElement.textContent = `Desaparecerá en ${timer} segundos`;

  const interval = setInterval(() => {
      timer--;
      timerElement.textContent = `Desaparecerá en ${timer} segundos`;

      if (timer <= 0) {
          clearInterval(interval);
          document.getElementById('alert-container').style.display = 'none';
      }
  }, 1000);
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

async function retrieveFileByPhone(phone) {
  const userSelect = document.getElementById('userSelect');
  const selectedUserId = userSelect.value;
  // Validar que el teléfono sólo contiene números
  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(phone)) {
      Swal.fire({
          icon: 'warning',
          title: 'Número de teléfono inválido',
          text: 'Por favor, ingresa sólo números en el campo de teléfono.',
      });
      return;
  }
  if (!phone && !selectedUserId) {
      Swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Por favor, selecciona un usuario e ingresa un número de teléfono.',
      });
      return;
  }
  if (!phone) {
      Swal.fire({
          icon: 'warning',
          title: 'Ningún número de teléfono ingresado',
          text: 'Por favor, ingresa un número de teléfono para consultar.',
      });
      return;
  }
  if (!selectedUserId) {
      Swal.fire({
          icon: 'warning',
          title: 'Ningún usuario seleccionado',
          text: 'Por favor, selecciona un usuario del menú desplegable.',
      });
      return;
  }

  // Eliminar el contenedor de archivos antes de hacer la consulta
  const filesParentContainer = document.getElementById('files-parent-container');
  const filesContainer = document.getElementById('files-container');
  if (filesContainer) {
      filesParentContainer.removeChild(filesContainer);
  }

  // Si ambos campos están llenos, proceder con la consulta
  try {
    const response = await await fetch(`/retrieveByPhone/${phone}/${selectedUserId}`);
    
    // Si hay resultados, agregar el contenedor de archivos de nuevo al DOM
    const newFilesContainer = document.createElement('div');
    newFilesContainer.id = 'files-container';
    newFilesContainer.style.display = 'none';
    newFilesContainer.innerHTML = `
        <h3>Archivos asociados:</h3>
        <div class="row files-list" id="files-list"></div>
        <p id="no-files-message" style="text-align: center;">No hay archivos para mostrar.</p>
    `;
    filesParentContainer.appendChild(newFilesContainer);
    const noFilesMessage = document.getElementById('no-files-message');

    if (!response.ok) {
      Swal.fire({
          icon: 'info',
          title: 'No se encontraron transacciones',
          text: 'No hay transacciones asociadas a este número de teléfono y usuario.',
      });
      noFilesMessage.style.display = 'block';
      newFilesContainer.style.display = 'block';
      $('#userSelect').val('').trigger('change');
      document.getElementById('phoneInput').value = '';  // Limpiar el input de teléfono
      return;
    }

    const responseBody = await response.json();

    if(responseBody.length === 0) {
      Swal.fire({
          icon: 'info',
          title: 'No se encontraron transacciones',
          text: 'No hay transacciones asociadas a este número de teléfono y usuario.',
      });
      noFilesMessage.style.display = 'block';
      newFilesContainer.style.display = 'block';
      $('#userSelect').val('').trigger('change');
      document.getElementById('phoneInput').value = '';  // Limpiar el input de teléfono
      return;
    }

    // Mostrar los archivos
    const filesList = document.getElementById('files-list');
      
    // Limpiar la lista de archivos anterior
    filesList.innerHTML = '';

    // Iterar sobre todos los registros y añadirlos a la lista
    responseBody.forEach(record => {
      const fileLink = document.createElement('a');
      fileLink.href = record.dbData.ArchivoCifradoURL;
      fileLink.className = 'text-truncate d-block'; // Añade la clase para truncar el texto y asegurarte de que ocupe todo el ancho disponible
      
      // Extraer el nombre del archivo de la URL
      const fileName = record.dbData.ArchivoCifradoURL.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      // Decidir el icono basado en la extensión
      let fileIconClass = fileIconsMap[fileExtension] || 'fa-file';
      
      const fileIcon = document.createElement('i');
      fileIcon.className = `fas ${fileIconClass} fa-2x mb-2`; // Añade un margen inferior para separar el icono del nombre del archivo
      
      const fileDiv = document.createElement('div');
      fileDiv.className = 'col-12 col-sm-6 col-md-6 col-lg-6'; // Ajusta el diseño de las columnas según el tamaño de pantalla
      fileDiv.appendChild(fileIcon);
      fileDiv.appendChild(document.createElement('br'));
      fileDiv.appendChild(fileLink);
      fileLink.innerText = fileName;
      
      filesList.appendChild(fileDiv);
    });

    if (responseBody.length > 0) {
      noFilesMessage.style.display = 'none';
    } else {
      noFilesMessage.style.display = 'block';
    }
    
    newFilesContainer.style.display = 'block'; // Mostrar la sección de archivos
    $('#userSelect').val('').trigger('change');
    document.getElementById('phoneInput').value = '';  // Limpiar el input de teléfono
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

async function getUsersAndFillSelect() {
  try {
    const response = await fetch('/users');
    if (!response.ok) {
        console.error('Error fetching users:', await response.text());
        return;
    }
    const users = await response.json();
    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '';  // Limpia cualquier opción anterior
    
    // Añade una opción predeterminada con texto y sin valor
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Seleccionar usuario';
    defaultOption.value = '';  // El valor vacío indica ninguna selección
    defaultOption.selected = true;  // Esta opción es seleccionada por defecto
    defaultOption.disabled = true;  // Esta opción no es seleccionable
    userSelect.appendChild(defaultOption);

    // Ahora añade las opciones para cada usuario
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.UsuarioID;
        option.textContent = user.Usuario;
        userSelect.appendChild(option);
    });
  } catch (error) {
      console.error('Error:', error);
  }
}

function obtenerDatos() {
  // Realizar una solicitud AJAX al servidor para obtener los datos del usuario
    fetch('/getProfile', {
      method: 'GET',
      credentials: 'include', // Para enviar cookies
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(datosUsuario => {
      // Llenar la lista con los datos del usuario
      const lista = document.getElementById('userDataList');
      lista.innerHTML = `
          <li>Nombre y Apellido: ${datosUsuario.nombre} ${datosUsuario.apellido}</li>
          <li>Email: ${datosUsuario.email}</li>
          <li>Teléfono: ${datosUsuario.numeroTelefono}</li>
      `;
  
      // Mostrar el contenedor con los datos del usuario
      document.getElementById('userDataContainer').style.display = 'block';
  })
  .catch(error => {
    console.error('Error al obtener los datos del usuario:', error);
  });
}

function ocultarDatos() {
  // Oculta el contenedor con los datos del usuario
  const container = document.getElementById('userDataContainer');
  container.style.display = 'none';
  
  // Elimina el contenido del contenedor
  document.getElementById('userDataList').innerHTML = '';
}

// Llama a la función cuando la página se carga
document.addEventListener('DOMContentLoaded', async () => {
  await getUsersAndFillSelect();
  // Inicializa Select2 en el combobox de usuarios
  $('#userSelect').select2();
});