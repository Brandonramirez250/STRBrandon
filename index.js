document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const dataContainer = document.getElementById("dataContainer");
    const searchType = document.getElementById("searchType"); // Campo para seleccionar el tipo de búsqueda
    const paginationContainer = document.getElementById("pagination");

    // Tamaño de página
    const itemsPerPage = 5;
    let currentPage = 1;
    let data = [];

    // Cargar los datos desde el archivo JSON
    fetch('data.json')
      .then(response => response.json())  // Convertir la respuesta en un objeto JSON
      .then(fetchedData => {
        data = fetchedData;
        // Mostrar todos los datos al cargar, sin filtro
        displayData(data);
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));

    // Función para mostrar los datos en la página
    function displayData(filteredData) {
      dataContainer.innerHTML = ''; // Limpiar contenido anterior
      paginationContainer.innerHTML = ''; // Limpiar paginación anterior

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

        // Crear los botones de paginación
        const createPageButton = (page, text) => {
          const button = document.createElement('button');
          button.textContent = text;
          button.onclick = () => changePage(page);
          if (page === currentPage) button.classList.add('active');
          return button;
        };

        // Botón de página anterior
        if (currentPage > 1) {
          paginationContainer.appendChild(createPageButton(currentPage - 1, 'Anterior'));
        } else {
          const disabledButton = document.createElement('button');
          disabledButton.textContent = 'Anterior';
          disabledButton.classList.add('disabled');
          paginationContainer.appendChild(disabledButton);
        }

        // Botones de número de página
        for (let page = 1; page <= totalPages; page++) {
          paginationContainer.appendChild(createPageButton(page, page));
        }

        // Botón de página siguiente
        if (currentPage < totalPages) {
          paginationContainer.appendChild(createPageButton(currentPage + 1, 'Siguiente'));
        } else {
          const disabledButton = document.createElement('button');
          disabledButton.textContent = 'Siguiente';
          disabledButton.classList.add('disabled');
          paginationContainer.appendChild(disabledButton);
        }
      }
    }

    // Función para cambiar de página
    function changePage(page) {
      currentPage = page;
      filterData();
    }

    // Función para filtrar los datos según el tipo de búsqueda
    function filterData() {
      const searchValue = searchInput.value.toLowerCase();
      const filterBy = searchType.value; // Obtener el tipo de búsqueda seleccionado

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

    // Añadir evento de búsqueda
    searchInput.addEventListener('input', filterData);
    searchType.addEventListener('change', filterData);
});
