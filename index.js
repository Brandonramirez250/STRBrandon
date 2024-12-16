document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const dataContainer = document.getElementById("dataContainer");
    const searchType = document.getElementById("searchType");
    const paginationContainer = document.getElementById("pagination");
    const uploadExcel = document.getElementById("uploadExcel");
  
    // Tamaño de página
    const itemsPerPage = 5;
    let currentPage = 1;
    let data = [];
  
    // Función para manejar la carga del archivo Excel
    uploadExcel.addEventListener("change", handleFileUpload, false);
  
    function handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
  
        // Suponemos que los datos están en la primera hoja
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // Convertir los datos a formato JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Eliminar encabezados si los hay
        const headers = jsonData[0]; // Usar la primera fila como encabezados
        jsonData.shift(); // Eliminar la fila de encabezados
  
        // Convertir los datos en un formato adecuado
        data = jsonData.map(row => ({
          mac: row[0],
          sn: row[1],
          activo: row[2]
        }));
  
        displayData(data);
      };
  
      reader.readAsBinaryString(file);
    }
  
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
  
        createPagination(totalPages);
      }
    }
  
    // Función para crear botones de paginación
    function createPagination(totalPages) {
      const createPageButton = (page, text) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = () => changePage(page);
        if (page === currentPage) button.classList.add('active');
        return button;
      };
  
      if (currentPage > 1) {
        paginationContainer.appendChild(createPageButton(currentPage - 1, 'Anterior'));
      } else {
        const disabledButton = document.createElement('button');
        disabledButton.textContent = 'Anterior';
        disabledButton.classList.add('disabled');
        paginationContainer.appendChild(disabledButton);
      }
  
      for (let page = 1; page <= totalPages; page++) {
        paginationContainer.appendChild(createPageButton(page, page));
      }
  
      if (currentPage < totalPages) {
        paginationContainer.appendChild(createPageButton(currentPage + 1, 'Siguiente'));
      } else {
        const disabledButton = document.createElement('button');
        disabledButton.textContent = 'Siguiente';
        disabledButton.classList.add('disabled');
        paginationContainer.appendChild(disabledButton);
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
  
    // Añadir evento de búsqueda
    searchInput.addEventListener('input', filterData);
    searchType.addEventListener('change', filterData);
  });
  