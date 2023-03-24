let currentPage = 1;
let platformClientInstance;

function fetchContactLists(platformClient, pageNumber = 1) {
  currentPage = pageNumber;
  platformClientInstance = platformClient;
  console.log('getContactLists called');

  function displayContactLists(contactLists) {
    console.log('displayContactLists', contactLists);
    const contactListsTableBody = document.querySelector('#contactListsTable tbody');
    contactListsTableBody.innerHTML = '';

    contactLists.forEach(list => {
      const row = document.createElement('tr');
      const idCell = document.createElement('td');
      idCell.textContent = list.id;
      const nameCell = document.createElement('td');
      nameCell.textContent = list.name;
      const dateCreatedCell = document.createElement('td');
      dateCreatedCell.textContent = list.dateCreated;
      const divisionCell = document.createElement('td');
      divisionCell.textContent = list.division.name;
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(dateCreatedCell);
      row.appendChild(divisionCell);
      contactListsTableBody.appendChild(row);
    });
  }

  function fetchContactListsFromApi(pageNumber) {
    console.log('fetchContactListsFromApi');
    const apiInstance = new platformClient.OutboundApi();
    const pageSize = 10;

    apiInstance.getOutboundContactlists(pageSize, pageNumber)
      .then(response => {
        console.log('getOutboundContactlists response', response);
        const contactLists = response.entities;
        const totalPages = response.pageCount;
        displayContactLists(contactLists);
        updatePaginationButtons(totalPages);
      })
      .catch(error => console.error('Error al cargar las contact lists:', error));
  }

  fetchContactListsFromApi(pageNumber);
}

function updatePaginationButtons(totalPages) {
  const previousPageBtn = document.querySelector('#previousPageBtn');
  const nextPageBtn = document.querySelector('#nextPageBtn');

  if (currentPage === 1) {
    previousPageBtn.disabled = true;
  } else {
    previousPageBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }

  previousPageBtn.onclick = () => fetchContactLists(platformClientInstance, currentPage - 1);
  nextPageBtn.onclick = () => fetchContactLists(platformClientInstance, currentPage + 1);
}
