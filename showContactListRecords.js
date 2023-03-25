function showContactListRecords(csvUrl) {
  console.log('showContactListRecords called');

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

  const request = new XMLHttpRequest();
  request.open('GET', csvUrl, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      const lines = request.responseText.split('\n');
      const headerLine = lines[0];
      const headers = headerLine.split(',');

      const rowCount = lines.length - 1;
      const pageCount = Math.ceil(rowCount / 50);
      let currentPage = 1;

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

        const previousPageButton = document.createElement('button');
        previousPageButton.textContent = 'Anterior';
        previousPageButton.disabled = currentPage === 1;
        paginationDiv.appendChild(previousPageButton);

        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'Siguiente';
        nextPageButton.disabled = currentPage === pageCount;
        paginationDiv.appendChild(nextPageButton);

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
    }
  };
  request.send();
}
