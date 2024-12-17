const searchInput = document.getElementById("searchInput");
const dataContainer = document.getElementById("dataContainer");
const searchType = document.getElementById("searchType");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 5;
let currentPage = 1;
let data = [];

// URL de la hoja de Google Sheets (reemplazar con el enlace correcto)
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQskhSjiJ4H1yJl7G9AtQDhgFxu8ByFHxIQFA/pub?output=csv';  // Asegúrate de usar la URL publicada

// Usamos Tabletop.js para acceder a Google Sheets
window.onload = function() {
  Tabletop.init({
    key: '1366f1Tta15g3rLA6OQCeZA4P7AXrWK5l',  // Reemplaza con tu `key`
    simpleSheet: true,
    callback: function(response) {
      console.log("Datos cargados desde Google Sheets:", response);
      data = response; // Almacenamos los datos de la hoja en la variable 'data'
      displayData(data); // Muestra los datos en la página
    },
    error: function(error) {
      console.log("Error al cargar los datos:", error);
    }
  });
};

// Función para mostrar los datos en la página
function displayData(filteredData) {
  console.log("Datos filtrados para mostrar:", filteredData);
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

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(pageData[0]);
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.toUpperCase();
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    pageData.forEach(item => {
      const row = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = item[header] || 'N/A';
        row.appendChild(td);
      });
      table.appendChild(row);
    });

    dataContainer.appendChild(table);

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

function changePage(page) {
  currentPage = page;
  displayData(data);
}

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
