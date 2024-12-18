let data = []; // Datos cargados desde el archivo JSON
let filteredData = []; // Datos filtrados (según la búsqueda)
let currentPage = 1; // Página actual
const resultsPerPage = 10; // Número de resultados por página

// Cargar datos desde el archivo JSON
async function loadData() {
  try {
    const response = await fetch('TVBOX1.json'); // Asegúrate de tener el archivo JSON en la ruta correcta
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON');
    }
    data = await response.json();
    filteredData = [...data]; // Inicialmente, los datos filtrados son todos
    renderData(); // Renderizar los datos con paginación
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    alert('Hubo un error al cargar los datos, por favor intentalo de nuevo más tarde.');
  }
}

// Función para mostrar los datos en la interfaz
function renderData() {
  const dataContainer = document.getElementById('dataContainer');
  dataContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos resultados

  // Calcular el rango de resultados a mostrar
  const start = (currentPage - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  const currentData = filteredData.slice(start, end); // Slice para obtener los datos de la página actual

  // Mostrar los datos actuales
  if (currentData.length === 0) {
    dataContainer.innerHTML = '<p>No se encontraron resultados</p>';
  } else {
    currentData.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <p><strong>SN:</strong> ${item.SN}</p>
        <p><strong>MAC:</strong> ${item.MAC}</p>
      `;
      dataContainer.appendChild(card);
    });
  }

  renderPagination(); // Renderizar la paginación
}

// Función para renderizar los botones de paginación
function renderPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = ''; // Limpiar los botones de paginación

  const totalPages = Math.ceil(filteredData.length / resultsPerPage); // Calcular total de páginas

  // Si hay menos de 2 páginas, no mostrar botones de "Primero", "Anterior", "Siguiente" y "Último"
  if (totalPages <= 1) return;

  // Botón "Primero"
  const firstButton = document.createElement('button');
  firstButton.textContent = 'Primero';
  firstButton.classList.add('nav-button', currentPage === 1 ? 'disabled' : '');
  firstButton.addEventListener('click', () => {
    currentPage = 1;
    renderData();
  });
  paginationContainer.appendChild(firstButton);

  // Botón "Anterior"
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Anterior';
  prevButton.classList.add('nav-button', currentPage === 1 ? 'disabled' : '');
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    renderData();
  });
  paginationContainer.appendChild(prevButton);

  // Botones de las páginas (Mostrar entre 5 y 7 botones de página por vez)
  const pageButtonRange = getPageButtonRange(currentPage, totalPages);
  for (let i = pageButtonRange.start; i <= pageButtonRange.end; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add(i === currentPage ? 'active' : '');
    pageButton.addEventListener('click', () => {
      currentPage = i;
      renderData();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Botón "Siguiente"
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Siguiente';
  nextButton.classList.add('nav-button', currentPage === totalPages ? 'disabled' : '');
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) currentPage++;
    renderData();
  });
  paginationContainer.appendChild(nextButton);

  // Botón "Último"
  const lastButton = document.createElement('button');
  lastButton.textContent = 'Último';
  lastButton.classList.add('nav-button', currentPage === totalPages ? 'disabled' : '');
  lastButton.addEventListener('click', () => {
    currentPage = totalPages;
    renderData();
  });
  paginationContainer.appendChild(lastButton);
}

// Función para calcular el rango de botones de la paginación
function getPageButtonRange(currentPage, totalPages) {
  let start = currentPage - 2;
  let end = currentPage + 2;

  // Evitar que los botones de página se salgan de los límites
  if (start < 1) start = 1;
  if (end > totalPages) end = totalPages;

  return { start, end };
}

// Función de búsqueda
function searchData() {
  const searchType = document.getElementById('searchType').value;
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  // Filtrar los datos basados en el tipo de búsqueda y el texto ingresado
  filteredData = data.filter(item => {
    if (searchType === 'mac' && item.MAC.toLowerCase().includes(searchInput)) return true;
    if (searchType === 'sn' && item.SN.toLowerCase().includes(searchInput)) return true;
    return false;
  });

  currentPage = 1; // Resetear a la primera página
  renderData(); // Actualizar la vista con los datos filtrados
}

// Escuchar cambios en los inputs de búsqueda
document.getElementById('searchInput').addEventListener('input', searchData);
document.getElementById('searchType').addEventListener('change', searchData);

// Cargar los datos al inicio
loadData();
