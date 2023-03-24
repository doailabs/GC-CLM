function fetchContactLists(platformClient) {
  console.log('getContactLists called');

  function displayContactLists(contactLists) {
    console.log('displayContactLists', contactLists);
    const contactListsTableBody = document.querySelector('#contactListsTable tbody');

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

  function fetchContactListsFromApi() {
    console.log('fetchContactListsFromApi');
    const apiInstance = new platformClient.OutboundApi();

    apiInstance.getOutboundContactlists()
      .then(response => {
        console.log('getOutboundContactlists response', response);
        const contactLists = response.entities.map(list => {
          return {
            id: list.id,
            name: list.name,
            dateCreated: list.dateCreated,
            division: list.division
          };
        });
        displayContactLists(contactLists);
      })
      .catch(error => console.error('Error al cargar las contact lists:', error));
  }

  fetchContactListsFromApi();
}
