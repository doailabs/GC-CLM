function showContactListRecords(csvData) {
  console.log('showContactListRecords called');

  const lines = csvData.split('\n');
  const headerLine = lines[0];
  const headers = headerLine.split(',');

  const rowCount = lines.length - 1;
  const pageCount = Math.ceil(rowCount / 50);
  let currentPage = 1;

  console.log(`Mostrando ${rowCount} filas`);

  const table = document.createElement('table');
  table.id = 'contactListRecordsTable';

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const tableDiv = document.createElement('div');
  tableDiv.id = 'tableDiv';
  tableDiv.appendChild(table);

  const paginationDiv = document.createElement('div');
  paginationDiv.id = 'pagination';
  tableDiv.appendChild(paginationDiv);

  document.body.appendChild(tableDiv);

  const updateTable = () => {
    const start = (currentPage - 1) * 50 + 1;
    const end = Math.min(start + 50, rowCount + 1);
    const rows = lines.slice(start, end);

    tbody.innerHTML = '';
    rows.forEach(row => {
      const fields = row.split(',');
      const tableRow = document.createElement('tr');
      fields.forEach(field => {
        const tableData = document.createElement('td');
        tableData.textContent = field;
        tableRow.appendChild(tableData);
      });
      tbody.appendChild(tableRow);
    });

    console.log(`Mostrando filas del ${start} al ${end - 1} (de un total de ${rowCount})`);

    const previousPageButton = document.createElement('button');
    previousPageButton.textContent = 'Anterior';
    previousPageButton.disabled = currentPage === 1;
    paginationDiv.appendChild(previousPageButton);

    const nextPageButton = document.createElement('button');
    nextPageButton.textContent = 'Siguiente';
    nextPageButton.disabled = currentPage === pageCount;
    paginationDiv.appendChild(nextPageButton);

    console.log(`Página ${currentPage} de ${pageCount}`);

    previousPageButton.addEventListener('click', () => {
      currentPage--;
      updateTable();
    });

    nextPageButton.addEventListener('click', () => {
      currentPage++;
      updateTable();
    });
  };

  updateTable();

  document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('#loadingScreen');
    loadingScreen.style.display = 'none';
  });
}
