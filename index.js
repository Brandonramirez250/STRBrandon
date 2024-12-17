const searchInput = document.getElementById("searchInput");
const dataContainer = document.getElementById("dataContainer");
const searchType = document.getElementById("searchType");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 5;
let currentPage = 1;
let data = [];

// Cargar los datos desde Google Sheets usando Tabletop.js
function loadDataFromGoogleSheets() {
  Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1366f1Tta15g3rLA6OQCeZA4P7AXrWK5l/edit?usp=sharing',
    callback: function(sheetData, tabletop) {
      // Aquí se transforman los datos de la hoja de cálculo a un formato más útil
      data = sheetData.map(item => ({
        mac: item.MAC,
        sn: item.SN,
        activo: item.ACTIVO
      }));
      displayData(data);
    },
    simpleSheet: true
  });
}

// Mostrar los datos en la página
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
        <div class="mac">MAC: ${item.mac}</div>
        <div class="sn">SN: ${item.sn}</div>
        <div class="activo">Activo: ${item.activo}</div>
      `;

      dataContainer.appendChild(card);
    });

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

// Cambiar página
function changePage(page) {
  currentPage = page;
  displayData(data);
}

// Filtrar datos
searchInput.addEventListener('input', filterData);
searchType.addEventListener('change', filterData);

function filterData() {
  const searchValue = searchInput.value.toLowerCase();
  const filterBy = searchType.value;

  const filteredData = data.filter(item => {
    switch (filterBy) {
      case 'mac':
        return item.mac && item.mac.toLowerCase().includes(searchValue);
      case 'sn':
        return item.sn && item.sn.toLowerCase().includes(searchValue);
      case 'activo':
        return item.activo && item.activo.toLowerCase().includes(searchValue);
      default:
        return false;
    }
  });

  displayData(filteredData);
}

// Cargar los datos desde Google Sheets cuando la página esté lista
window.onload = loadDataFromGoogleSheets;
