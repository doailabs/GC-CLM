function fetchContactLists(platformClient, pageNumber = 1) {
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

              if (totalPages > 1) {
                  const paginationContainer = document.querySelector('#pagination');
                  paginationContainer.innerHTML = '';

                  for (let i = 1; i <= totalPages; i++) {
                      const pageButton = document.createElement('button');
                      pageButton.textContent = i;
                      pageButton.addEventListener('click', () => {
                          fetchContactLists(platformClient, i);
                      });

                      paginationContainer.appendChild(pageButton);
                  }
              }
          })
          .catch(error => console.error('Error al cargar las contact lists:', error));
  }

  fetchContactListsFromApi(pageNumber);
}
