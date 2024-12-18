let data = []; // Datos cargados desde los archivos JSON
let filteredData = []; // Datos filtrados (según la búsqueda)
let currentPage = 1; // Página actual
const resultsPerPage = 6; // Número de resultados por página

// Cargar datos desde los ocho archivos JSON
async function loadData() {
  try {
    const [response1, response2, response3, response4, response5, response6, response7, response8] = await Promise.all([
      fetch('TVBOX1.json'),
      fetch('TVBOX2.json'),
      fetch('TVBOX3.json'),
      fetch('TVBOX4.json'),
      fetch('TVBOX5.json'),
      fetch('TVBOX6.json'),
      fetch('TVBOX7.json'),
      fetch('TVBOX8.json')
    ]);

    if (!response1.ok || !response2.ok || !response3.ok || !response4.ok || !response5.ok || !response6.ok || !response7.ok || !response8.ok) {
      throw new Error('No se pudieron cargar los archivos JSON');
    }

    const data1 = await response1.json();
    const data2 = await response2.json();
    const data3 = await response3.json();
    const data4 = await response4.json();
    const data5 = await response5.json();
    const data6 = await response6.json();
    const data7 = await response7.json();
    const data8 = await response8.json();

    // Combinamos todos los conjuntos de datos
    const allData = [...data1, ...data2, ...data3, ...data4, ...data5, ...data6, ...data7, ...data8];

    // Aseguramos que todos los elementos tengan el campo 'ACTIVO'
    data = allData.map(item => {
      if (!item.ACTIVO) {
        item.ACTIVO = 'No tiene';  // Asignamos 'No tiene' si no existe el campo 'ACTIVO'
      }
      return item;
    });

    // Inicializamos los datos filtrados con todos los datos
    filteredData = [...data];

    console.log('Datos cargados:', data); // Verifica que los datos se cargan correctamente
    renderData(); // Renderizamos los datos con paginación
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    alert('Hubo un error al cargar los datos, por favor intentalo de nuevo más tarde.');
  }
}

// Función para mostrar los datos en la interfaz
function renderData() {
  const dataContainer = document.getElementById('dataContainer');
  const noResults = document.getElementById('noResults');
  dataContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos resultados
  noResults.style.display = 'none'; // Ocultar el mensaje de "No resultados"

  // Calcular el rango de resultados a mostrar
  const start = (currentPage - 1) * resultsPerPage;
  const end = start + resultsPerPage;
  const currentData = filteredData.slice(start, end); // Slice para obtener los datos de la página actual

  // Mostrar los datos actuales
  if (currentData.length === 0) {
    noResults.style.display = 'block'; // Mostrar mensaje de "No resultados"
  } else {
    currentData.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <p><strong>SN:</strong> ${item.SN}</p>
        <p><strong>MAC:</strong> ${item.MAC}</p>
        <p><strong>ACTIVO:</strong> ${item.ACTIVO}</p>
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

  // Si no hay páginas, no se muestra nada
  if (totalPages <= 1) return;

  // Botón "Primero"
  const firstButton = document.createElement('button');
  firstButton.textContent = 'Primero';
  if (currentPage === 1) firstButton.classList.add('disabled');
  firstButton.addEventListener('click', () => {
    currentPage = 1;
    renderData();
  });
  paginationContainer.appendChild(firstButton);

  // Botón "Anterior"
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Anterior';
  if (currentPage === 1) prevButton.classList.add('disabled');
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    renderData();
  });
  paginationContainer.appendChild(prevButton);

  // Botones de las páginas
  const pageButtonRange = getPageButtonRange(currentPage, totalPages);
  for (let i = pageButtonRange.start; i <= pageButtonRange.end; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add('active');
    pageButton.addEventListener('click', () => {
      currentPage = i;
      renderData();
    });
    paginationContainer.appendChild(pageButton);
  }

  // Botón "Siguiente"
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Siguiente';
  if (currentPage === totalPages) nextButton.classList.add('disabled');
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) currentPage++;
    renderData();
  });
  paginationContainer.appendChild(nextButton);

  // Botón "Último"
  const lastButton = document.createElement('button');
  lastButton.textContent = 'Último';
  if (currentPage === totalPages) lastButton.classList.add('disabled');
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
    if (searchType === 'activo' && item.ACTIVO.toLowerCase().includes(searchInput)) return true;
    return false;
  });

  // Si no se encuentra "activo", mostrar "No tiene"
  if (filteredData.length === 0) {
    const noResults = document.getElementById('noResults');
    noResults.style.display = 'block';
    noResults.innerText = 'No se encontraron resultados para ese término.';
  } else {
    document.getElementById('noResults').style.display = 'none';
  }

  currentPage = 1; // Resetear a la primera página
  renderData(); // Actualizar la vista con los datos filtrados
}

// Escuchar cambios en los inputs de búsqueda
document.getElementById('searchInput').addEventListener('input', searchData);
document.getElementById('searchType').addEventListener('change', searchData);

// Cargar los datos al inicio
loadData();
