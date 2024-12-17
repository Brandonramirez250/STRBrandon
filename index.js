const searchInput = document.getElementById("searchInput");
const dataContainer = document.getElementById("dataContainer");
const searchType = document.getElementById("searchType");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 5;
let currentPage = 1;
let data = [];

// Tu clave de API y ID de hoja de cálculo
const API_KEY = 'TU_API_KEY';  // Sustituye con tu API key
const SPREADSHEET_ID = '1366f1Tta15g3rLA6OQCeZA4P7AXrWK5l';  // Sustituye con el ID de tu hoja de Google Sheets
const RANGE = 'Hoja1!A:C';  // Ajusta el rango según tus necesidades

// Cargar los datos desde Google Sheets
function loadDataFromGoogleSheets() {
  gapi.load('client', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
  }).then(function(response) {
    const rows = response.result.values;
    if (rows.length) {
      data = rows.slice(1).map(row => ({ mac: row[0], sn: row[1], activo: row[2] })); // Suponiendo que los datos están en las columnas A, B, C
      displayData(data);
    } else {
      console.log('No data found.');
    }
  }).catch(function(error) {
    console.error('Error al cargar los datos desde Google Sheets:', error);
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

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['MAC', 'SN', 'ACTIVO'];
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    pageData.forEach(item => {
      const row = document.createElement('tr');
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = item[header.toLowerCase()] || 'N/A';
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
