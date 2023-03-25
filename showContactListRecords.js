// Definir variables
let csvData = [];
let currentPage = 1;
const rowsPerPage = 50;

// Obtener datos del CSV y mostrar la tabla
fetch('ruta/al/csv/contact_list_XXXXX.csv')
  .then(response => response.text())
  .then(data => {
    // Parsear el CSV en un arreglo de objetos
    csvData = parseCsv(data);
    // Mostrar la tabla con los primeros 50 registros
    renderTable(currentPage);
  })
  .catch(error => console.error('Error al cargar el archivo CSV:', error));

// Función para parsear el CSV en un arreglo de objetos
function parseCsv(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });
}

// Función para mostrar la tabla con los registros en la página actual
function renderTable(page) {
  // Calcular índices de inicio y fin de la página actual
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  // Obtener los registros de la página actual
  const pageData = csvData.slice(start, end);
  // Crear la tabla y agregar los encabezados
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  Object.keys(pageData[0]).forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);
  // Agregar las filas de datos a la tabla
  const tbody = document.createElement('tbody');
  pageData.forEach(rowData => {
    const trBody = document.createElement('tr');
    Object.values(rowData).forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      trBody.appendChild(td);
    });
    tbody.appendChild(trBody);
  });
  table.appendChild(tbody);
  // Mostrar la tabla en la pantalla
  const tableContainer = document.querySelector('#table-container');
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
  // Mostrar los controles de paginación
  renderPagination();
}

// Función para mostrar los controles de paginación
function renderPagination() {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(csvData.length / rowsPerPage);
  // Crear los botones de paginación
  const paginationContainer = document.querySelector('#pagination-container');
  paginationContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      currentPage = i;
      renderTable(currentPage);
    });
    paginationContainer.appendChild(button);
  }
}
