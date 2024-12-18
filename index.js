const searchInput = document.getElementById("searchInput");
const dataContainer = document.getElementById("dataContainer");
const searchType = document.getElementById("searchType");
const paginationContainer = document.getElementById("pagination");

const itemsPerPage = 5;
let currentPage = 1;
let data = [];

// Cargar datos desde el archivo JSON usando fetch
function loadData() {
  fetch('TVBOX1.JSON')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      displayData(data);
    })
    .catch(error => console.error('Error al cargar los datos:', error));
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
        <div class="mac">MAC: ${item.MAC}</div>
        <div class="sn">SN: ${item.SN}</div>
        <div class="activo">Activo: ${item.ACTIVO}</div>
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
        return item.MAC && item.MAC.toLowerCase().includes(searchValue);
      case 'sn':
        return item.SN && item.SN.toLowerCase().includes(searchValue);
      case 'activo':
        return item.ACTIVO && item.ACTIVO.toLowerCase().includes(searchValue);
      default:
        return false;
    }
  });

  displayData(filteredData);
}

// Cargar los datos desde el archivo JSON cuando la página esté lista
window.onload = loadData;
