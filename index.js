// Referencia a los elementos de la página
const searchInput = document.getElementById("searchInput");
const dataContainer = document.getElementById("dataContainer");
const searchType = document.getElementById("searchType");
const paginationContainer = document.getElementById("pagination");

// Tamaño de página y página actual
const itemsPerPage = 5;
let currentPage = 1;
let data = [];

// Cargar los datos desde Google Sheets
const sheetUrl = 'https://docs.google.com/spreadsheets/d/1366f1Tta15g3rLA6OQCeZA4P7AXrWK5l/gviz/tq?tqx=out:json';

// Usamos Tabletop.js para acceder a Google Sheets
window.onload = function() {
  Tabletop.init({
    key: sheetUrl,
    simpleSheet: true,
    callback: function(response) {
      data = response; // Almacenamos los datos de la hoja en la variable 'data'
      displayData(data); // Muestra los datos en la página
    }
  });
};

// Función para mostrar los datos en la página
function displayData(filteredData) {
  dataContainer.innerHTML = '';
  paginationContainer.innerHTML = '';

  if (filteredData.length === 0) {
    const noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'noResultsMessage';
    noResultsMessage.textContent = 'Sin resultados.';
    dataContainer.appendChild(noResultsMessage);
  } else {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div>
          <div class="mac">MAC: ${item.mac}</div>
          <div class="sn">SN: ${item.sn}</div>
        </div>
        <div class="activo">Activo: ${item.activo}</div>
      `;
      dataContainer.appendChild(card);
    });

    // Paginación
    const createPageButton = (page, text) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.onclick = () => changePage(page);
      if (page === currentPage) button.classList.add('active');
      return button;
    };

    if (currentPage > 1) {
      paginationContainer.appendChild(createPageButton(currentPage - 1, 'Anterior'));
    }

    for (let page = 1; page <= totalPages; page++) {
      paginationContainer.appendChild(createPageButton(page, page));
    }

    if (currentPage < totalPages) {
      paginationContainer.appendChild(createPageButton(currentPage + 1, 'Siguiente'));
    }
  }
}

// Función para cambiar de página
function changePage(page) {
  currentPage = page;
  displayData(data);
}

// Función para filtrar los datos por búsqueda
searchInput.addEventListener('input', filterData);
searchType.addEventListener('change', filterData);

// Función de filtro
function filterData() {
  const searchValue = searchInput.value.toLowerCase();
  const filterBy = searchType.value;

  const filteredData = data.filter(item => {
    switch (filterBy) {
      case 'mac':
        return item.mac.toLowerCase().includes(searchValue);
      case 'sn':
        return item.sn.toLowerCase().includes(searchValue);
      case 'activo':
        return item.activo.toLowerCase().includes(searchValue);
      default:
        return false;
    }
  });

  displayData(filteredData);
}
