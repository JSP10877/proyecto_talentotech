// Variables de los botones y las secciones
const crearReseñaBtn = document.getElementById('crearReseñaBtn');
const verReseñasBtn = document.getElementById('verReseñasBtn');
const crearReseñaSection = document.getElementById('crearReseña');
const verReseñasSection = document.getElementById('verReseñas');
const reseñaForm = document.getElementById('reseñaForm');
const reseñasContainer = document.getElementById('reseñasContainer');

// Función para cambiar entre secciones
function showSection(section) {
  document.querySelectorAll('.content').forEach((content) => {
    content.classList.remove('active');
  });
  section.classList.add('active');
}

// Evento para mostrar "Crear Reseña"
crearReseñaBtn.addEventListener('click', () => {
  showSection(crearReseñaSection);
});

// Evento para mostrar "Ver Reseñas"
verReseñasBtn.addEventListener('click', () => {
  showSection(verReseñasSection);
  cargarReseñas();
});

// Manejo del formulario
reseñaForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Crear un objeto FormData con los datos del formulario
  const formData = new FormData(reseñaForm);

  // Enviar los datos al servidor usando fetch
  fetch('guardar_resena.php', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success') {
        alert(data.message);
        reseñaForm.reset(); // Limpiar el formulario
        showSection(verReseñasSection); // Redirigir a "Ver Reseñas"
        cargarReseñas(); // Cargar las reseñas actualizadas
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Hubo un problema al enviar la reseña.');
    });
});

// Función para cargar las reseñas desde el servidor
function cargarReseñas() {
    fetch('obtener_resenas.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          reseñasContainer.innerHTML = ''; // Limpiar contenido previo
  
          data.reseñas.forEach((reseña) => {
            const reseñaCard = document.createElement('div');
            reseñaCard.classList.add('card', 'mb-3', 'shadow-sm', 'reseña-card');
            reseñaCard.setAttribute('data-id', reseña.id);
  
            reseñaCard.innerHTML = `
              <div class="card-body">
                <h5 class="card-title">${reseña.nombre}</h5>
                <h6 class="card-subtitle text-muted">${reseña.correo}</h6>
                <p class="card-text mt-2">${reseña.comentario}</p>
                ${
                  reseña.foto
                    ? `<img src="${reseña.foto}" alt="Foto de ${reseña.nombre}" class="img-fluid mt-3">`: ''
                }
                <div class="mt-3">
                  <button class="btn btn-sm btn-danger" onclick="eliminarReseña(${reseña.id})">Eliminar</button>
                  <button class="btn btn-sm btn-warning" onclick="modificarReseña(${reseña.id})">Modificar</button>
                </div>
              </div>
            `;
  
            reseñasContainer.appendChild(reseñaCard);
          });
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al cargar las reseñas.');
      });
  }
  
  // Función para eliminar una reseña
  function eliminarReseña(id) {
    if (confirm("¿Deseas eliminar esta reseña? Verificaremos si fuiste el propietario de esta reseña, sino la reestableceremos en unas horas.")) {
      fetch('eliminar_resena.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          if (data.status === 'success') {
            cargarReseñas();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Hubo un problema al eliminar la reseña.');
        });
    }
  }
  
  // Función para modificar una reseña
  function modificarReseña(id) {
    const reseñaCard = document.querySelector(`.reseña-card[data-id="${id}"]`);
    const comentarioParrafo = reseñaCard.querySelector('.card-text');
    const originalComentario = comentarioParrafo.textContent;
  
    // Reemplazar el contenido original por un campo de texto editable
    comentarioParrafo.innerHTML = `
      <textarea class="form-control mb-2">${originalComentario}</textarea>
      <div>
        <button class="btn btn-sm btn-success me-2" onclick="confirmarModificacion(${id})">Guardar</button>
        <button class="btn btn-sm btn-secondary" onclick="cancelarModificacion(${id}, '${originalComentario}')">Cancelar</button>
      </div>
    `;
  }
  
  // Función para confirmar la modificación de la reseña
  function confirmarModificacion(id) {
    const reseñaCard = document.querySelector(`.reseña-card[data-id="${id}"]`);
    const nuevoComentario = reseñaCard.querySelector('textarea').value;
  
    // Enviar el nuevo comentario al servidor
    fetch('modificar_resena.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${id}&comentario=${encodeURIComponent(nuevoComentario)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        if (data.status === 'success') {
          cargarReseñas(); // Recargar las reseñas actualizadas
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar la reseña.');
      });
  }
  
  // Función para cancelar la modificación
  function cancelarModificacion(id, originalComentario) {
    const reseñaCard = document.querySelector(`.reseña-card[data-id="${id}"]`);
    const comentarioParrafo = reseñaCard.querySelector('.card-text');
  
    // Restaurar el contenido original
    comentarioParrafo.textContent = originalComentario;
  }
  
  
  
  
